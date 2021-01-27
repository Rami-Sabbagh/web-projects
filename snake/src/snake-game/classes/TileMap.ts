import Entity from './Entity';
import Tile from './Tile';

export default class TileMap {
    //==-- Protected properties --==//

    /**
     * The DOM element containing the game's grid.
     */
    readonly element: HTMLElement = document.createElement("div");

    //==-- Private properties --==//

    /**
     * The width of the map in tiles.
     */
    private _width: number = 0;
    /**
     * The height of the map in tiles.
     */
    private _height: number = 0;
    /**
     * A single dimentional array of the map tiles, row by row.
     */
    private tiles: Tile[] = [];
    /**
     * keys: an entity object. values: the index inside _tiles.
     */
    private entities: Map<Entity, number> = new Map();

    //==-- Constructor --==//

    /**
     * Constructs a new TileMap instance.
     * @param {number} width The width of the map in tiles. Defaults to (30).
     * @param {number} height The height of the map in tiles. Defaults to (20).
     */
    constructor(width: number = 30, height: number = 20) {
        this.element.className = "snake-game";
        this.setDimensions(width, height);
    }

    //==-- Setters and Getters --==//

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    //==-- Methods --==//

    /**
     * Sets the dimensions of the map.
     * @param {number} width The new width of the map, in tiles.
     * @param {number} height The new height of the map, in tiles.
     */
    setDimensions(width: number, height: number): void {
        let newLength = width * height;

        if (newLength > this.tiles.length) {
            //Create new tiles
            for (let i = this.tiles.length; i < newLength; i++) {
                let tile = new Tile();
                this.tiles.push(tile);
                this.element.appendChild(tile.element);
            }

        } else if (newLength < this.tiles.length) {
            //Remove old tiles
            for (let i = this.tiles.length; i > newLength; i--) {
                const tile = this.tiles.pop() as Tile;
                this.element.removeChild(tile.element);
            }

        }

        this._width = width;
        this._height = height;

        this.element.style.gridTemplateColumns = `repeat(${this._width}, 1fr)`;
    }

    /**
     * Adds an entity on a specific tile in the game, replacing an existing one if there is.
     *  (*) if the entity was added twice, it would be just moved into the new location.
     * @param {Entity} entity The entity to add.
     * @param {number} x The X coordinates of the target tile, 0-based.
     * @param {number} y The Y coordinates of the target tile, 0-based.
     */
    addEntity(entity: Entity, x: number, y: number): void {
        let index = y * this._width + x;

        const oldEntity = this.tiles[index].entity;
        if (oldEntity) this.removeEntity(oldEntity);

        this.tiles[index].entity = entity;
        this.entities.set(entity, index);
    }

    /**
     * Returns the entity set on a specific tile, or (undefined) if unoccupied.
     * @param {number} x The X coordinates of the target tile, 0-based.
     * @param {number} y The Y coordinates of the target tile, 0-based.
     * @returns {Entity?} The entity set on a specific tile, or (null) if unoccupied.
     */
    getEntity(x: number, y: number): Entity | null {
        return this.tiles[y * this._width + x].entity;
    }

    /**
     * Removes a specific entity from the map.
     * @param {Entity} entity The entity to remove.
     */
    removeEntity(entity: Entity): void {
        if (!this.entities.has(entity)) { return }
        let index = this.entities.get(entity) as number;

        this.tiles[index].entity = null;
        this.entities.delete(entity);
    }

    /**
     * Removes all the entities from the map.
     */
    clearEntities(): void {
        this.entities.forEach(entityIndex => this.tiles[entityIndex].entity = null);
        this.entities.clear();
    }
}