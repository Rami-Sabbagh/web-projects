export default class Tile {
    //==-- Protected properties --==//

    _element = document.createElement("div");

    //==-- Getters and Setters --==//

    get element() {
        return this._element;
    }

    // The entity occuping this tile.
    get entity() {
        return this._entity;
    }

    set entity(entity) {
        this._entity = entity;
        this._element.className = entity ? entity.className : undefined;
    } 
}