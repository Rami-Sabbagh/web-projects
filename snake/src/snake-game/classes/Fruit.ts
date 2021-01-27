import Entity from './Entity';
import Snake from './Snake';

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
    consumed(snake: Snake): boolean {
        this.onConsumtion();
        snake.grow();
        return false;
    }
}