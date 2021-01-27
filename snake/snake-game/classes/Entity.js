/**
 * An entity is a game object which occupies a tile.
 * It's expected to extend this class, and call the super constructor with a specific class name.
 */
export default class Entity {

    //==-- Contructor --==//

    /**
     * Creates a new entity.
     * @param {string} className The name of the CSS class to apply on the tile element which the entity occupies.
     */
    constructor(className) {
        this._className = className;
    }

    //==-- Getters and Setters --==//

    get className() {
        return this._className;
    }

    //==-- Methods --==//

    /**
     * Consumes the entity by a snake.
     * @param {Snake} snake The snake which consumed the entity.
     * @returns {boolean} (true) to reject the consumtion of this entity, causing the death of the snake.
     */
    consumed(snake) { return false; }
}