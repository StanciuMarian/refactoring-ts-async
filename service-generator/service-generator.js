import camelCase from 'lodash.camelcase'
import isEqual from 'lodash.isequal'


const API_URI_PREFIX = ''
const httpDependecy = {
    name: 'http',
    type: 'HttpClient',
    scope: 'private'
}

const defaultImports = [{
    moduleSpecifier: '@angular/common/http',
    namedImport: 'HttpClient'
}, {
    moduleSpecifier: '@angular/core',
    namedImport: 'Injectable'
}, {
    moduleSpecifier: 'rxjs',
    namedImport: 'Observable'
}, {
    moduleSpecifier: 'rxjs/operators',
    namedImport: 'map'
}, {
    moduleSpecifier: '../common/helpers/constants',
    namedImport: 'constants'
}, {
    moduleSpecifier: '@angular/common/http',
    namedImport: 'HttpHeaders' 
}]

class ServiceGenerator {

    constructor(controllerName, controller, ast, definitions, enums) {
        this.controller = controller;
        this.controllerName = controllerName;
        this.ast = ast
        this.definitions = definitions;
        this.definitionsToBeImported = new Set();
        this.enums = enums
    }


    generateService() {
        this.controllerName = this.controllerName.replace('controller', 'api')
        const serviceFile = this.ast.createSourceFile("./output/api/" + this.controllerName + ".ts", "", { overwrite: true });
        let className = camelCase(this.controllerName);
        let clasa = serviceFile.addClass({
            name: className[0].toUpperCase() + className.substring(1)
        });
        this.addJsDoc(clasa, `DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED\n${banner}`);
        this.resolveDecorator(clasa, "Injectable");
        this.addInitialImports(serviceFile)
        clasa.setIsExported(true)
        this.resolveConstructor(clasa, [httpDependecy])
        for (let path of this.controller) {
            let methodsInfo = this.getMethodsInfo(path);
            this.resolveMethods(clasa, methodsInfo)
        }
        this.definitionsToBeImported.forEach(namedImport => this.addNamedImport(serviceFile, `./dto/${namedImport}`, namedImport))
        serviceFile.save();
    }

    addJsDoc(declaration, message) {
        declaration.addJsDoc({
            description: message
        })
    }

    resolveDecorator(clasa, decoratorName) {
        clasa.addDecorator({
            name: decoratorName,
            arguments: ["{providedIn: 'root'}"]
        })
    }

    addInitialImports(serviceFile) {
        for(let defaultImport of defaultImports) {
            this.addNamedImport(serviceFile, defaultImport.moduleSpecifier, defaultImport.namedImport)
        }
    }

    addNamedImport(serviceFile, moduleSpecifier, namedImport) {
        serviceFile.addImportDeclaration({moduleSpecifier})
                   .addNamedImport(namedImport);
    }

    resolveConstructor(clasa, arrayOfDependecies) {
        clasa.addConstructor({
            parameters: arrayOfDependecies
        })
    }

    getMethodsInfo(pathObject) {
        let methodsInfo = []
        let endPoint = Object.keys(pathObject)[0];
        let httpMethods = pathObject[endPoint];
        for (let httpMethod in httpMethods) {
            if(httpMethod != 'options') {
                let methodInfo = {}
                methodInfo.endPoint = endPoint.replace('/api', ''); 
                methodInfo.httpMethod = httpMethod;
                methodInfo.name = httpMethods[httpMethod].summary
                
                
                methodInfo.parameters = this.resolveParams(httpMethods[httpMethod]);
                methodInfo.returnType = this.resolveReturnType(httpMethods[httpMethod])
                methodInfo.shouldSkip = this.shouldSkipMethod(methodInfo)
                methodsInfo.push(methodInfo);
            }
        }
        return methodsInfo;
    }

    shouldSkipMethod(methodInfo) {
        let isDownloadMethod = methodInfo.endPoint.includes('download') 
        let hasFileParameters = methodInfo.parameters.some(param => String(param.type) === 'file');
        return isDownloadMethod || hasFileParameters
    }

    resolveParams(httpMethod) {
        let parameters = []
        if (httpMethod.parameters) {
            
            for (let reqParam of httpMethod.parameters) {
                if(reqParam.name != "Accept-Language") {
                    let parameter = {}
                    parameter.name = reqParam.name.replace('[]', '');
                    parameter.paramType = reqParam.in
                    parameter.type = this.resolveParamType(reqParam)
                    parameters.push(parameter)
                }
            }
        }
        return parameters;
    }
    
    resolveParamType(reqParam) {
        if (reqParam.enum) {
            return this.resolveEnumType(reqParam.enum)
        }
        switch(String(reqParam.type)) {
            case 'integer': return 'number'
            case 'array': return reqParam.items.type + '[]'
            case 'undefined': return this.resolveParamTypeBySchema(reqParam.schema)
            default: return reqParam.type
        }
    }

    resolveParamTypeBySchema(schema) {
        if(schema.type) {
            if(schema.type == 'integer') {
                return 'number';
            }
            return schema.type;
        } else if(schema["$ref"]) {
            return schema["$ref"].split('/').pop() 
        } else {
            return schema.items["$ref"].split('/').pop() + '[]';
        }
    }

    resolveEnumType(arrayEnumValues) {
        for (let enumDecl of this.enums) {
            let enumValues = enumDecl.getMembers().map(member => member._compilerNode.name.escapedText)
            if (isEqual(enumValues.sort(), arrayEnumValues.sort())) {
                this.definitionsToBeImported.add(enumDecl.getName())
                return enumDecl.getName();
            }
        }

    }


    resolveReturnType(httpMethod) {
        let schema = httpMethod.responses['200'].schema;
        if (!schema) {
            return 'void';
        }
        switch (String(schema.type)) {
            case 'array': return (schema.items.type || schema.items["$ref"].split('/').pop() || 'any') + '[]';
            case 'integer': return 'number';
            case 'object': return 'any'
            case 'undefined': return schema["$ref"].split('/').pop()
            default: return schema.type;
        }
        
    }

    getBodyParam(parameters) {
        let params = parameters.filter(parameter => parameter.paramType === 'body');
        if (params.length) {
            return params[0]
        } else {
            return {}
        }

    }

    resolveBodyText(serviceMethod) {
        let {httpReturnType, options} = this.resolveReturnTypeAndOptionsForHttpCall(serviceMethod);
        let bodyText = `return this.http.${serviceMethod.httpMethod}`;
        bodyText += httpReturnType
        bodyText += `(\`\${constants.APP_ENDPOINT}${API_URI_PREFIX}${serviceMethod.endPoint}\``;
        bodyText += this.resolveBodyForHttpCall(serviceMethod);
        bodyText += `,${options})`;
        
        let returnType = serviceMethod.returnType.replace('[]', '');
        if (this.isGeneratedDefinition(returnType)) {
            if (this.isArrayType(serviceMethod.returnType)) {
                bodyText += `\n\t.pipe(map(response => response.map(entry => Object.assign(new ${returnType}(), entry))))`;
            } else {
                bodyText += `\n\t.pipe(map(response => Object.assign(new ${returnType}(), response)))`;
            }
        } else if(returnType == 'number') {
            bodyText += `\n\t.pipe(map(response => +response))`
        }
        return bodyText;
    }

    resolveBodyForHttpCall(serviceMethod) {
        let bodyParam = this.getBodyParam(serviceMethod.parameters);
        if (serviceMethod.httpMethod === 'post' || serviceMethod.httpMethod === 'put') {
            if(serviceMethod.name == 'test') {
                console.log(bodyParam)
            }
            return `,${bodyParam.name ? bodyParam.name : '{}'}`
        }
        return '';
    }

    resolveReturnTypeAndOptionsForHttpCall(serviceMethod) {
        let bodyParam = this.getBodyParam(serviceMethod.parameters);
        let httpHeaders;
        if(bodyParam && bodyParam.type == 'string') {
            httpHeaders = "headers: new HttpHeaders().set('Content-Type', 'application/json')"
        }
        if(serviceMethod.returnType == 'string' || serviceMethod.returnType == 'number') {
            return {
                httpReturnType: '',
                options: `{responseType: 'text'${httpHeaders? ',' + httpHeaders : ''}}`
            }
        } else {
            return {
                httpReturnType: `<${serviceMethod.returnType}>`,
                options: `{${httpHeaders? httpHeaders : ''}}`
            }
        }
    }

    resolveMethods(clasa, methodsInfo) {
        for (let methodInfo of methodsInfo) {
            if (methodInfo.shouldSkip) {
                return
            }
            let method = clasa.addMethod({
                name: methodInfo.name,
                returnType: `Observable<${methodInfo.returnType}>`
            })
            this.addJsDoc(method, `DO NOT TOUCH!! Auto-Generated Code! ANY CHANGES WILL BE REVERTED\n`)
            this.resolveImport(methodInfo.returnType);
           
            methodInfo.parameters.forEach(parameter => {
                method.addParameter({
                    name: parameter.name,
                    type: parameter.type
                })
                this.resolveImport(parameter.type);
                if (parameter.paramType === 'query') {
                    methodInfo.endPoint = methodInfo.endPoint.concat(this.addQueryParamToEndPoint(parameter, methodInfo.endPoint));
                }
            })
            this.resolveVariableInterpolation(methodInfo)
            let bodyText = this.resolveBodyText(methodInfo);
            method.setBodyText(bodyText)
        }
    }

    addMethod(clasa, name, returnType) {
        clasa.addMethod({
            name: name,
            returnType: `Observable<${returnType}>`
        })
    }

    resolveVariableInterpolation(serviceMethod) {
        serviceMethod.endPoint = serviceMethod.endPoint.replace(new RegExp("{", "g"), '${');
    }

    addQueryParamToEndPoint(param, endPoint) {
        if (endPoint.indexOf('?') == -1) {
            return `?${param.name}={${param.name}}`
        } else {
            return `&${param.name}={${param.name}}`
        }
    }

    resolveImport(type) {
        let cleanType = type.replace('[]', '');
        if (this.isGeneratedDefinition(cleanType)) {
            this.definitionsToBeImported.add(cleanType);
        }
    }

    isGeneratedDefinition(type) {
        return this.definitions.includes(String(type));
    }

    isArrayType(type) {
        return new String(type).includes('[]');
    }

}

export default ServiceGenerator;

const banner = `
█████╗ ██╗   ██╗████████╗ ██████╗  ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗███████╗██████╗ 
██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
███████║██║   ██║   ██║   ██║   ██║██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   █████╗  ██║  ██║
██╔══██║██║   ██║   ██║   ██║   ██║██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██╔══╝  ██║  ██║
██║  ██║╚██████╔╝   ██║   ╚██████╔╝╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ███████╗██████╔╝
╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝ `