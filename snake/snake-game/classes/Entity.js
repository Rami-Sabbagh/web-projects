//An entity is a game object which occupies a tile.
//It's expected to extend this class, and call the super constructor with a specific class name.
export default class Entity {

    //==-- Contructor --==//

    //- className (String): The name of the CSS class to apple on the tile element which the entity occupies.
    constructor(className) {
        this._className = className;
    }

    //==-- Getters and Setters --==//

    get className() {
        return this._className;
    }

    //==-- Methods --==//

    //Consume the entity by a snake.
    //return: rejectConsumtion: (true) to reject the consumtion of this entity, causing the death of the snake.
    consumed(snake) { return false; }
}