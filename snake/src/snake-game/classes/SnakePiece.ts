import Entity from './Entity';
import Snake from './Snake';

//Represents a piece of the snake in the game.
export default class SnakePiece extends Entity {

    //==-- Constructor --==//

    constructor() {
        super("snake-piece");
    }

    //==-- Methods --==//

    //--(overrides Entity)--//
    consumed(snake: Snake): boolean {
        return true; //reject the consumtion.
    }
}