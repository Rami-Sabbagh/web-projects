import TileMap from './classes/TileMap.js';
import Snake from './classes/Snake.js';
import Fruit from './classes/Fruit.js';

export default class Game {

    //==-- Public Fields --==//

    startingSnakeLength = undefined;

    //==-- Private Fields --==//

    _tileMap = undefined;
    _fruitsCount = undefined;
    _snake = undefined;
    _fruitConsumtionHandler = undefined;

    //==-- Constructor --==//

    //- width (Number): The width of the game's map in tiles, defaults to (30).
    //- height (Number): The height of the game's map in tiles, defaults to (20).
    //- fruitsCount (Number): The number of fruits in the game.
    //- startingSnakeLength (Number): The starting length of the snake.
    constructor(width, height, fruitsCount = 5, startingSnakeLength = 5) {
        this._tileMap = new TileMap(width, height);
        this._fruitsCount = fruitsCount;
        this.startingSnakeLength = startingSnakeLength;

        this._snake = new Snake(this._tileMap);
        this._snake.onDeath = () => this.onDeath();
        this._fruitConsumtionHandler = () => {
            this.spawnFruit();
            this.onFruitConsumed();
        };
    }

    //==-- Getters and Setters --==//

    get element() { return this._tileMap.element; }
    get tileMap() { return this._tileMap; }
    get snake() { return this._snake; }

    //==-- Callbacks --==//

    //Called when the snake dies.
    onDeath() { }

    //Called when the fruit is consumed.
    onFruitConsumed() { }

    //==-- Methods --==//

    //Setups and starts/restarts the game.
    start() {
        this.setup();
        this.resume();
    }

    //Pauses the game.
    pause() {
        this._snake.pause();
    }

    //Starts/Resumes the game.
    resume() {
        if (!this._snake.spawned) { throw new Error("The snake is not spawned for the game to resume, call .setup() first before resuming the game."); }
        this._snake.resume();
    }

    //Setups the game's entities.
    setup() {
        if (this._snake.spawned) { this.reset(); }
        this.spawnSnake();
        this.spawnStartingFruits();
    }

    //Resets the game's state, unspawning all the entities.
    reset() {
        this._snake.destroy();
        this._tileMap.clearEntities();
    }

    //Spawns/Respawns the game's snake.
    spawnSnake() {
        this._snake.respawn(
            Math.floor((this._tileMap.width + this.startingSnakeLength)/2),
            Math.floor(this._tileMap.height/2),
            this.startingSnakeLength
        );
    }

    //Spawns the starting fruits.
    spawnStartingFruits() {
        for (let i = 0; i < this._fruitsCount; i++) {
            this.spawnFruit();
        }
    }

    //Spawns a fruit at a random empty location.
    spawnFruit() {
        let x = Math.floor(Math.random() * this.tileMap.width);
        let y = Math.floor(Math.random() * this.tileMap.height);

        if (this.tileMap.getEntity(x, y)) {
            this.spawnFruit();
            return;
        }

        let fruit = new Fruit();
        fruit.onConsumtion = this._fruitConsumtionHandler;
        this.tileMap.addEntity(fruit, x, y);
    }
}