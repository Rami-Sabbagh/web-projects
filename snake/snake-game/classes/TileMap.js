import Tile from './Tile.js';

export default class TileMap {
    //Protected properties
    _container = document.createElement("div"); //The DOM element containing the game's grid
    //Private properties
    _width = 0;
    _height = 0;
    _tiles = [];
    _entities = new Map();

    //Constructor
    constructor(width = 100, height = 100) {
        this._container.className = "snake-game";
        this.setDimensions(width, height);
    }

    //Getters and Setters
    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get element() {
        return this._container;
    }

    //Methods
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

    getEntity(x, y) {
        return this._tiles[y * this._width + x].entity;
    }

    addEntity(entity, x, y) {
        let index = y * this._width + x;

        if (this._tiles[index].entity) {
            this.removeEntity(this._tiles[index].entity)
        }

        this._tiles[index].entity = entity;
        this._entities.set(entity, index);
    }

    removeEntity(entity) {
        if (!this._entities.has(entity)) { return }
        let index = this._entities.get(entity);
        
        this._tiles[index].entity = undefined;
        this._entities.delete(entity);
    }
}