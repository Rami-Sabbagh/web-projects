import Tile from './Tile.js';

export default class TileMap {
    //==-- Protected properties --==//

    _container = document.createElement("div"); //The DOM element containing the game's grid

    //==-- Private properties --==//

    /**
     * The width of the map in tiles.
     */
    _width = 0;
    /**
     * The height of the map in tiles.
     */
    _height = 0;
    /**
     * A single dimentional array of the map tiles, row by row.
     */
    _tiles = [];
    /**
     * keys: an entity object. values: the index inside _tiles.
     */
    _entities = new Map();

    //==-- Constructor --==//

    /**
     * Constructs a new TileMap instance.
     * @param {number} width The width of the map in tiles. Defaults to (30).
     * @param {number} height The height of the map in tiles. Defaults to (20).
     */
    constructor(width = 30, height = 20) {
        this._container.className = "snake-game";
        this.setDimensions(width, height);
    }

    //==-- Getters and Setters --==//

    //(Number) The width of the map in tiles.
    get width() {
        return this._width;
    }

    //(Number) The height of the map in tiles.
    get height() {
        return this._height;
    }

    //The DOM element containing the tiles.
    get element() {
        return this._container;
    }

    //==-- Methods --==//

    /**
     * Sets the dimensions of the map.
     * @param {number} width The new width of the map, in tiles.
     * @param {number} height The new height of the map, in tiles.
     */
    setDimensions(width, height) {
        let newLength = width * height;

        if (newLength > this._tiles.length) {
            //Create new tiles
            for (let i = this._tiles.length; i < newLength; i++) {
                let tile = new Tile();
                this._tiles.push(tile);
                this._container.appendChild(tile.element);
            }

        } else if (newLength < this._tiles.length) {
            //Remove old tiles
            for (let i = this._tiles.length; i > newLength; i--) {
                this._container.removeChild(
                    this._tiles.pop().element
                );
            }

        }

        this._width = width;
        this._height = height;

        this._container.style["grid-template-columns"] = `repeat(${this._width}, 1fr)`;
    }

    /**
     * Adds an entity on a specific tile in the game, replacing an existing one if there is.
     *  (*) if the entity was added twice, it would be just moved into the new location.
     * @param {Entity} entity The entity to add.
     * @param {number} x The X coordinates of the target tile, 0-based.
     * @param {number} y The Y coordinates of the target tile, 0-based.
     */
    addEntity(entity, x, y) {
        let index = y * this._width + x;

        if (this._tiles[index].entity) {
            this.removeEntity(this._tiles[index].entity)
        }

        this._tiles[index].entity = entity;
        this._entities.set(entity, index);
    }

    /**
     * Returns the entity set on a specific tile, or (undefined) if unoccupied.
     * @param {number} x The X coordinates of the target tile, 0-based.
     * @param {number} y The Y coordinates of the target tile, 0-based.
     * @returns {?Entity} The entity set on a specific tile, or (undefined) if unoccupied.
     */
    getEntity(x, y) {
        return this._tiles[y * this._width + x].entity;
    }

    /**
     * Removes a specific entity from the map.
     * @param {Entity} entity The entity to remove.
     */
    removeEntity(entity) {
        if (!this._entities.has(entity)) { return }
        let index = this._entities.get(entity);

        this._tiles[index].entity = undefined;
        this._entities.delete(entity);
    }

    /**
     * Removes all the entities from the map.
     */
    clearEntities() {
        this._entities.forEach(entityIndex => this._tiles[entityIndex].entity = undefined);
        this._entities.clear();
    }
}