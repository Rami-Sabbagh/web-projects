import Entity from './Entity.js';

//Represents a fruit in the game.
export default class Fruit extends Entity {

    //==-- Constructor --==//

    constructor() {
        super("fruit");
    }

    //==-- Callbacks --==//

    onConsumtion() { }

    //==-- Methods --==//

    //--(overrides Entity)--//
    consumed(snake) {
        this.onConsumtion();
        snake.grow();
        return false;
    }
}