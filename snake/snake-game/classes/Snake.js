import SnakePiece from './SnakePiece.js';

let movementVectors = [
    [0, -1], //0: top
    [1, 0], //1: right
    [0, 1], //2: bottom
    [-1, 0], //3: left
];

export default class Snake {
    //==-- Private properties --==//

    _tileMap = undefined;
    _pieces = [];

    _headX = undefined;
    _headY = undefined;

    _direction = undefined; //0: top, 1: right, 2: bottom, 3: left
    _lastMovementDirection = undefined;

    _movementInterval = undefined;
    _movementHandler = this.move.bind(this);
    _movementTimeout = 200;

    _grow = 0;

    //==-- Contructor --==//

    /**
     * Constructs a new Snake instance.
     * @param {TileMap} tileMap The map which the snake belongs to.
     */
    constructor(tileMap) {
        this._tileMap = tileMap;
    }

    //==-- Getters and Setters --==//

    get length() { return this._pieces.length; }
    get spawned() { return this._pieces.length !== 0; }
    get paused() { return this._movementInterval === undefined; }

    get direction() { return this._lastMovementDirection; }
    set direction(value) { if ((this._lastMovementDirection + value) % 2 === 1) { this._direction = value; } }

    //==-- Callbacks --==//

    /**
     * Called when the snake dies (when die() is called).
     */
    onDeath() { }

    //==-- Methods --==//

    /**
     * Respawns the snake.
     * @param {number} x The x coordinates to spawn the snake's head at.
     * @param {number} y The y coordinates to spawn the snake's head at.
     * @param {number} length The initial length of the snake, defaults to (5).
     */
    respawn(x, y, length = 5) {
        if (this.length !== 0) { this.destroy(); }

        for (let i = 0; i < length; i++) {
            let piece = new SnakePiece();
            this._pieces.push(piece);
            this._tileMap.addEntity(piece, x - i, y);
        }

        this._headX = x;
        this._headY = y;
        this._direction = 1;
        this._lastMovementDirection = 1;
    }

    /**
     * Destroys the snake and removes it from existance.
     */
    destroy() {
        this.pause(); //Make sure the snake is paused first.

        for (let piece in this._pieces) { this._tileMap.removeEntity(piece); }
        this._pieces.splice(0);
        this._grow = 0;

        this._headX = undefined;
        this._headY = undefined;
        this._direction = undefined;
        this._lastMovementDirection = undefined;
    }

    /**
     * Resumes the snake's movement.
     */
    resume() {
        if (this._pieces.length === 0) { throw new Error("Can't resume the snake's movement while it's not in existance (respawn it first)."); }
        //If it was already active, pause it, and reactivate it (so the interval timeout is updated).
        if (this._movementInterval !== undefined) { this.pause(); }

        //Make sure the head piece is in place (can be not in the map when resuming after death).
        this._tileMap.addEntity(this._pieces[0], this._headX, this._headY);

        this._movementInterval = setInterval(this._movementHandler, this._movementTimeout);
    }

    /**
     * Pauses the snake's movement.
     */
    pause() {
        //Already not active / paused.
        if (this._movementInterval === undefined) { return; }

        clearInterval(this._movementInterval);
        this._movementInterval = undefined;
    }

    /**
     * Kills the snake, by pausing it, and calling the onDeath callback.
     */
    die() {
        this.pause();
        this.onDeath();
    }

    /**
     * Tells the snake to grow by a specific amount, takes the same amount of movements to be applied.
     * (Takes 2 movements to grow by 2, etc...).
     * @param {number} amount The specific amount to grow by.
     */
    grow(amount=1) { this._grow += amount; }

    /**
     * Makes the snake move by a single step.
     */
    move() {
        this._lastMovementDirection = this._direction;

        let headPiece;
        if (this._grow > 0) {
            headPiece = new SnakePiece();
            this._grow--;
        } else {
            headPiece = this._pieces.pop();
            this._tileMap.removeEntity(headPiece);
        }
        this._pieces.unshift(headPiece);

        let movementVector = movementVectors[this._direction];
        let movementVectorX = movementVector[0];
        let movementVectorY = movementVector[1];

        this._headX += movementVectorX, this._headY += movementVectorY;
        if (this._headX < 0) { this._headX = this._tileMap.width - 1 }
        if (this._headY < 0) { this._headY = this._tileMap.height - 1 }
        this._headX %= this._tileMap.width, this._headY %= this._tileMap.height;

        let entityToConsume = this._tileMap.getEntity(this._headX, this._headY);
        if (entityToConsume && entityToConsume.consumed(this)) {
            this.die(); //Consumtion rejected, the snake shall die now because it can't move.
            return; //Prevent the entity from being consumed, although it would be forcibaly consumed when the snake resumes (if revived).
        }

        this._tileMap.addEntity(headPiece, this._headX, this._headY);
    }
}