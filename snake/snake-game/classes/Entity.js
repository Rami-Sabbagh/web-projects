export default class Entity {
    constructor(className) {
        this._className = className;
    }

    get className() {
        return this._className;
    }
}