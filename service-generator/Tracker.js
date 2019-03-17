export default class Tracker {

    constructor() {
        this.definitionsNames = [];
        this. enums = [];
        this.classes = [];
    }

    addEnum(enumName, enumeration) {
        this.definitionsNames.push(enumName);
        this.enums.push(enumeration);
    }

    addClass(className, clasa) {
        this.definitionsNames.push(className);
        this.classes.push(clasa);
    }

    isEnumDeclared(enumName) {
        return this.definitionsNames.includes(String(enumName));
    }
}