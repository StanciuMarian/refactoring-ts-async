import camelCase from 'lodash.camelcase'

class SwaggerFilter {
    constructor(swagdocs) {
        this.paths = swagdocs.paths;
        this.tags = swagdocs.tags;
    }

    getFilteredDocs() {
        let controllers = {};
        for(let tag of this.tags) {
            controllers[tag.name] = [];
        }
        for(let pathName in this.paths) {
            let controllerTag = Object.values(this.paths[pathName])[0].tags[0];
            let path = {
                [pathName] : this.paths[pathName]
            }
            controllers[controllerTag].push(path);
        }
        return controllers;
    }

    
}

export default SwaggerFilter;