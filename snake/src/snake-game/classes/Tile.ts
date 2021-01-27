import Entity from "./Entity";

export default class Tile {
    //==-- Protected properties --==//

    readonly element: HTMLElement = document.createElement("div");
    private _entity: Entity | null = null;

    //==-- Getters and Setters --==//

    // The entity occuping this tile.
    get entity(): Entity | null {
        return this._entity;
    }

    set entity(entity: Entity | null) {
        this._entity = entity;
        this.element.className = entity ? entity.className : '';
    } 
}