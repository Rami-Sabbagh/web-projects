import SnakePiece from './SnakePiece';
import Tile from './Tile';
import TileMap from './TileMap';

export const enum Direction {
    TOP, RIGHT, BOTTOM, LEFT
}

interface Vector {
    0: number; //vx
    1: number; //vy
}

const movementVectors: [Vector, Vector, Vector, Vector] = [
    [0, -1], //0: top
    [1, 0], //1: right
    [0, 1], //2: bottom
    [-1, 0], //3: left
];

export default class Snake {
    //==-- Private properties --==//

    private readonly tileMap: TileMap;
    private readonly pieces: SnakePiece[] = [];

    private _headX: number = 0;
    private _headY: number = 0;

    private _direction: Direction = Direction.RIGHT;
    private lastMovementDirection: Direction = Direction.RIGHT;

    private movementInterval: number | undefined = undefined;
    private readonly movementHandler: TimerHandler = this.move.bind(this);
    readonly movementTimeout: number = 200;

    private _grow: number = 0;

    //==-- Contructor --==//

    /**
     * Constructs a new Snake instance.
     * @param {TileMap} tileMap The map which the snake belongs to.
     */
    constructor(tileMap: TileMap) {
        this.tileMap = tileMap;
    }

    //==-- Getters and Setters --==//

    get length(): number { return this.pieces.length; }
    get spawned(): boolean { return this.pieces.length !== 0; }
    get paused(): boolean { return this.movementInterval === undefined; }

    get direction(): Direction { return this.lastMovementDirection; }
    set direction(value: Direction) { if ((this.lastMovementDirection + value) % 2 === 1) { this._direction = value; } }

    get headX(): number { return this._headX; }
    get headY(): number { return this._headY; }

    //==-- Callbacks --==//

    /**
     * Called when the snake dies (when die() is called).
     */
    onDeath(): void { }

    //==-- Methods --==//

    /**
     * Respawns the snake.
     * @param {number} x The x coordinates to spawn the snake's head at.
     * @param {number} y The y coordinates to spawn the snake's head at.
     * @param {number} length The initial length of the snake, defaults to (5).
     */
    respawn(x: number, y: number, length: number = 5): void {
        if (this.length !== 0) { this.destroy(); }

        for (let i = 0; i < length; i++) {
            let piece = new SnakePiece();
            this.pieces.push(piece);
            this.tileMap.addEntity(piece, x - i, y);
        }

        this._headX = x;
        this._headY = y;
        this._direction = Direction.RIGHT;
        this.lastMovementDirection = Direction.RIGHT;
    }

    /**
     * Destroys the snake and removes it from existance.
     */
    destroy(): void {
        this.pause(); //Make sure the snake is paused first.

        this.pieces.forEach((piece) => this.tileMap.removeEntity(piece));
        this.pieces.splice(0);
        this._grow = 0;
    }

    /**
     * Resumes the snake's movement.
     */
    resume(): void {
        if (this.pieces.length === 0) { throw new Error("Can't resume the snake's movement while it's not in existance (respawn it first)."); }
        //If it was already active, pause it, and reactivate it (so the interval timeout is updated).
        if (this.movementInterval !== undefined) { this.pause(); }

        //Make sure the head piece is in place (can be not in the map when resuming after death).
        this.tileMap.addEntity(this.pieces[0], this._headX, this._headY);

        this.movementInterval = setInterval(this.movementHandler, this.movementTimeout);
    }

    /**
     * Pauses the snake's movement.
     */
    pause(): void {
        //Already not active / paused.
        if (this.movementInterval === undefined) { return; }

        clearInterval(this.movementInterval);
        this.movementInterval = undefined;
    }

    /**
     * Kills the snake, by pausing it, and calling the onDeath callback.
     */
    die(): void {
        this.pause();
        this.onDeath();
    }

    /**
     * Tells the snake to grow by a specific amount, takes the same amount of movements to be applied.
     * (Takes 2 movements to grow by 2, etc...).
     * @param {number} amount The specific amount to grow by.
     */
    grow(amount: number = 1): void { this._grow += amount; }

    /**
     * Makes the snake move by a single step.
     */
    move(): void {
        this.lastMovementDirection = this._direction;

        let headPiece;
        if (this._grow > 0) {
            headPiece = new SnakePiece();
            this._grow--;
        } else {
            headPiece = this.pieces.pop() as SnakePiece;
            this.tileMap.removeEntity(headPiece);
        }
        this.pieces.unshift(headPiece);

        let movementVector = movementVectors[this._direction];
        let movementVectorX = movementVector[0];
        let movementVectorY = movementVector[1];

        this._headX += movementVectorX, this._headY += movementVectorY;
        if (this._headX < 0) { this._headX = this.tileMap.width - 1 }
        if (this._headY < 0) { this._headY = this.tileMap.height - 1 }
        this._headX %= this.tileMap.width, this._headY %= this.tileMap.height;

        let entityToConsume = this.tileMap.getEntity(this._headX, this._headY);
        if (entityToConsume && entityToConsume.consumed(this)) {
            this.die(); //Consumtion rejected, the snake shall die now because it can't move.
            return; //Prevent the entity from being consumed, although it would be forcibaly consumed when the snake resumes (if revived).
        }

        this.tileMap.addEntity(headPiece, this._headX, this._headY);
    }
}