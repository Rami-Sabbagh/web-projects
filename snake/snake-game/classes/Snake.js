import Fruit from './Fruit.js';
import SnakePiece from './SnakePiece.js';

let movementVectors = [
    [0, -1], //0: top
    [1, 0], //1: right
    [0, 1], //2: bottom
    [-1, 0], //3: left
];

let keyboardBindings = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3,

    w: 0, W: 0,
    d: 1, D: 1,
    s: 2, S: 2,
    a: 3, A: 3
}

export default class Snake {
    _dead = false;
    _pieces = [];
    _growNextTick = false;
    _tickIntervalHandle = undefined;
    _directionNextTick = undefined;

    constructor(tileMap, onFruitConsumed, onDeath, x, y, length = 5) {
        this.tileMap = tileMap;
        this.onFruitConsumed = onFruitConsumed;
        this.onDeath = onDeath;

        this.headX = x;
        this.headY = y;

        this.direction = 1; //0: top, 1: right, 2: bottom, 3: left

        //Construct the snake pieces
        for (let i = 0; i < length; i++) {
            let piece = new SnakePiece();
            this._pieces.push(piece);
            this.tileMap.addEntity(piece, x - i, y);
        }

        this._tickIntervalHandle = setInterval(this.ontick.bind(this), 200);
        document.addEventListener("keydown", this.onkeydown.bind(this));
    }

    get length() {
        return this._pieces.length;
    }

    move() {
        let shouldGrow = this._growNextTick;
        this._growNextTick = false;

        if (this._directionNextTick !== undefined) {
            this.direction = this._directionNextTick;
            this._directionNextTick = undefined;
        }

        let piece;
        if (shouldGrow) {
            piece = new SnakePiece();
            this._pieces.unshift(piece);
        } else {
            piece = this._pieces.pop();
            this._pieces.unshift(piece);
            this.tileMap.removeEntity(piece);
        }

        let vector = movementVectors[this.direction];
        let vectorX = vector[0], vectorY = vector[1];

        this.headX += vectorX, this.headY += vectorY;
        if (this.headX < 0) { this.headX = this.tileMap.width - 1 }
        if (this.headY < 0) { this.headY = this.tileMap.height - 1 }
        this.headX %= this.tileMap.width, this.headY %= this.tileMap.height;

        let consumed = this.tileMap.getEntity(this.headX, this.headY);
        if (consumed) {
            if (consumed instanceof Fruit) {
                this._growNextTick = true;
                this.onFruitConsumed();
            } else {
                this.die();
            }
        }

        this.tileMap.addEntity(piece, this.headX, this.headY);
    }

    ontick() {
        this.move();
    }

    onkeydown(ev) {
        let direction = keyboardBindings[ev.key];

        if (direction !== undefined) {
            if ((this.direction + direction) % 2) {
                this._directionNextTick = direction;
            }
        }
    }

    die() {
        this._dead = true;
        if (this._tickIntervalHandle !== undefined) {
            clearInterval(this._tickIntervalHandle);
            this._tickIntervalHandle = undefined;
        }

        this.onDeath();
    }
}