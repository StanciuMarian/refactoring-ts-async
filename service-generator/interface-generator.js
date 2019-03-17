import { ImportDeclaration } from "ts-simple-ast";

class DefinitionsGenerator {
    constructor(swaggerDocs, ast, tracker) {
        this.definitions = swaggerDocs.definitions;
        this.ast = ast;
        this.tracker = tracker;
    }

    constructClassesAST() {
        for(let definitionName in this.definitions) {
            let clasa = this.resolveClassDeclaration(definitionName);
            let definition = this.definitions[definitionName];
            if(definition.type === 'object') {
                if(definition.properties) {
                    let properties = this.getPropertiesForClass(definition.properties)
                    this.resolvePropertiesInjection(clasa, properties);
                }
            }
            this.tracker.addClass(definitionName, clasa)
            this.sourceFile.save();
        }
    }

    resolveClassDeclaration(definition) {
        let clasa;
        try{
            this.sourceFile = this.ast.createSourceFile(`./output/api/dto/${definition}.ts`)
            clasa = this.sourceFile.addClass({
                name: definition
            });
            clasa.setIsExported(true);
            return clasa;
        } catch(sourceFileAlreadyExistsError) {
            this.sourceFile = this.ast.addExistingSourceFile(`./output/api/dto/${definition}.ts`);
            clasa = this.sourceFile.getClass(definition);
        }
        return clasa;
    
    }

    getPropertiesForClass(properties) {
        let props = [];
        for(let name in properties) {
            let type = this.resolvePropertyType(name, properties[name]);
            // let initializer = this.resolveInitializersForProperty(type);
            props.push({name, type});
        } 
        return props;
    }

    resolveInitializersForProperty(type) {
        if(type == 'string') {
            return "''";
        } else if(type == 'number') {
            return '0';
        } else if(type.includes('[]')) {
            return '[]';
        } else if(type == 'boolean') {
            return 'false';
        } else if(type == 'any') {
            return;
        } else {
            return 'new ' + type + '()';
        }
    }

    resolvePropertiesInjection(clasa, properties) {
        clasa.getInstanceProperties().forEach(property => property.remove());
        clasa.addProperties(properties);
        let memberCurrentIndex = 0;
        clasa.getInstanceProperties().forEach(property => property.setOrder(memberCurrentIndex++));
        clasa.getInstanceMethods().forEach(method => method.setOrder(memberCurrentIndex++));
    }

    resolvePropertyType(propertyName, property) {
        if(property.enum) {
            return this.resolveTypeForEnumProperty(property, propertyName);
        }
        switch(String(property.type)) {
            case 'object': return 'any'
            case 'integer': return 'number'
            case 'array': return this.resolveTypeForArrayProperty(property) + '[]';
            case 'undefined': return this.resolveReferenceTypeProperty(property)
            default: return property.type
        }
    }
    
    resolveImportType(typeName) {
        if(!this.namedImportAlreadyExists(typeName)) {
            this.sourceFile.addImportDeclaration({
                moduleSpecifier: `./${typeName}`
            }).addNamedImports([
                typeName
            ])
        }
    }
    
    namedImportAlreadyExists(typeName) {
        let importDeclarations = this.sourceFile.getImportDeclarations();
        let namedImports = importDeclarations.flatMap(importDeclaration => importDeclaration.getNamedImports());
        return namedImports.some(namedImport => String(namedImport.getNameNode().getText()) === String(typeName))
    }
    
    resolveReferenceTypeProperty(property) {
        let typeName = property['$ref'].split('/').pop();
        this.resolveImportType(typeName);
        return typeName;
    }

    resolveTypeForArrayProperty(property) {
        switch(String(property.items.type)) {
            case 'object': return 'any'
            case 'undefined': return this.resolveReferenceTypeProperty(property.items)
            default: return property.items.type
        }
    }

    resolveTypeForEnumProperty(property, propertyName) {
        let enumName = this.resolveEnumName(propertyName);
        if(this.arrayContainsNumbers(property.enum)) {
            return 'number';
        } else if(!this.tracker.isEnumDeclared(enumName)) {
            let members = property.enum.map(value => {
                return {
                    name: value,
                    value: value
                }});
            let sourceFile = this.resolveEnumDeclaration(enumName);
            let enumDeclaration = sourceFile.getEnum(enumName);
            this.resolveEnumMembersInjection(enumDeclaration, members)
            this.tracker.addEnum(enumName, enumDeclaration);
            sourceFile.save();
        }
        this.resolveImportType(enumName)
        return enumName;
    }

    resolveEnumDeclaration(name) {
        let sourceFile;
        let enumDeclaration;
        try{
            sourceFile = this.ast.createSourceFile(`./output/api/dto/${name}.ts`);
            enumDeclaration = sourceFile.addEnum({name})
            enumDeclaration.setIsExported(true);
        } catch(sourceFileAlreadyExistsError) {
            sourceFile = this.ast.addExistingSourceFile(`./output/api/dto/${name}.ts`);
            enumDeclaration = sourceFile.getEnum(name);
        }
        return sourceFile;
    }resolveEnumDeclaration(name) {
        let sourceFile;
        let enumDeclaration;
        try{
            sourceFile = this.ast.createSourceFile(`./output/api/dto/${name}.ts`);
            enumDeclaration = sourceFile.addEnum({name})
            enumDeclaration.setIsExported(true);
        } catch(sourceFileAlreadyExistsError) {
            sourceFile = this.ast.addExistingSourceFile(`./output/api/dto/${name}.ts`);
            enumDeclaration = sourceFile.getEnum(name);
        }
        return sourceFile;
    }

    resolveEnumMembersInjection(enumDeclaration, members) {
        enumDeclaration.getMembers().forEach(member => member.remove());
        enumDeclaration.addMembers(members);
    }

    resolveEnumName(propertyName) {
        return propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1) + 'Enum';
    }

    arrayContainsNumbers(array) {
        return array.some(value => !isNaN(value))
    }
}

export default DefinitionsGenerator;


                                                                                                               
