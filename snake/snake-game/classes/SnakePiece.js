import Entity from './Entity.js';

//Represents a piece of the snake in the game.
export default class SnakePiece extends Entity {

    //==-- Constructor --==//

    constructor() {
        super("snake-piece");
    }

    //==-- Methods --==//

    //--(overrides Entity)--//
    consumed(snake) {
        return true; //reject the consumtion.
    }
}