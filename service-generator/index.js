import Project from 'ts-simple-ast';
import DefinitionsGenerator from './interface-generator'
import ServiceGenerator from './service-generator';
import SwaggerFilter from './swagger-filter'
import Tracker from './Tracker';
import axios from 'axios';
import fs from 'fs'


let swaggerJSON;

const ast = new Project()

let handler = (error) => {
    if (error) throw error;
    console.log('path/file.txt was deleted');
}

let sourceFiles = ast.addExistingSourceFiles(`./output/api/**/*.ts`);
sourceFiles.forEach(sourceFile => {
    let clase = sourceFile.getClasses();

    if (clase[0]) {
        if (clase[0].getInstanceMethods().length === 0) {
            fs.unlinkSync(String(sourceFile.getFilePath()), handler)
        }
    } else {
        fs.unlinkSync(String(sourceFile.getFilePath()), handler)
    }

})



axios.get('http://localhost:8080/v2/api-docs')
    .then(response => {
        swaggerJSON = response.data
        console.log('Retrived JSON from server...')
        generator()
    })
    .catch(error => {
        console.log(error)
    });
let generator = () => {
    console.log('Starting generating...')

    const tracker = new Tracker();
    const definitionsGenerator = new DefinitionsGenerator(swaggerJSON, ast, tracker);
    definitionsGenerator.constructClassesAST();
    console.log('Data structures generated...')

    let swaggerFilter = new SwaggerFilter(swaggerJSON);
    console.log('Parsing JSON for services generation...')
    let controllers = swaggerFilter.getFilteredDocs();

    let definitions = tracker.definitionsNames
    let enums = tracker.enums
    console.log('Starting generating services...')
    for (let controller in controllers) {
        new ServiceGenerator(controller, controllers[controller], ast, definitions, enums).generateService();
    }
    console.log('Done!!!')
}



