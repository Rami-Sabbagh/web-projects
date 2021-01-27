import TileMap from './classes/TileMap';
import Snake from './classes/Snake';
import Fruit from './classes/Fruit';

export default class Game {

    //==-- Properties --==//

    readonly startingSnakeLength: number;
    readonly tileMap: TileMap;
    readonly fruitsCount: number;
    readonly snake: Snake;

    private readonly fruitConsumtionHandler: () => void;

    //==-- Constructor --==//

    /**
     * Create a new instance of the snake game.
     * @param {number} width The width of the game's map in tiles. Defaults to (30).
     * @param {number} height The height of the game's map in tiles. Defaults to (20).
     * @param {number} fruitsCount The number of fruits in the game.
     * @param {number} startingSnakeLength The starting length of the snake.
     */
    constructor(width: number, height: number, fruitsCount: number = 5, startingSnakeLength: number = 5) {
        this.tileMap = new TileMap(width, height);
        this.fruitsCount = fruitsCount;
        this.startingSnakeLength = startingSnakeLength;

        this.snake = new Snake(this.tileMap);
        this.snake.onDeath = () => this.onDeath();
        this.fruitConsumtionHandler = () => {
            this.spawnFruit();
            this.onFruitConsumed();
        };
    }

    //==-- Getters and Setters --==//

    get element(): HTMLElement { return this.tileMap.element; }

    //==-- Callbacks --==//

    /**
     * Called when the snake dies.
     */
    onDeath(): void { }

    /**
     * Called when the fruit is consumed.
     */
    onFruitConsumed(): void { }

    //==-- Methods --==//

    /**
     * Setups and starts/restarts the game.
     */
    start(): void {
        this.setup();
        this.resume();
    }

    /**
     * Pauses the game.
     */
    pause(): void {
        this.snake.pause();
    }

    /**
     * Starts/Resumes the game.
     */
    resume(): void {
        if (!this.snake.spawned) { throw new Error("The snake is not spawned for the game to resume, call .setup() first before resuming the game."); }
        this.snake.resume();
    }

    /**
     * Setups the game's entities.
     */
    setup(): void {
        if (this.snake.spawned) { this.reset(); }
        this.spawnSnake();
        this.spawnStartingFruits();
    }

    /**
     * Resets the game's state, unspawning all the entities.
     */
    reset(): void {
        this.snake.destroy();
        this.tileMap.clearEntities();
    }

    /**
     * Spawns/Respawns the game's snake.
     */
    spawnSnake(): void {
        this.snake.respawn(
            Math.floor((this.tileMap.width + this.startingSnakeLength)/2),
            Math.floor(this.tileMap.height/2),
            this.startingSnakeLength
        );
    }

    /**
     * Spawns the starting fruits.
     */
    spawnStartingFruits(): void {
        for (let i = 0; i < this.fruitsCount; i++) {
            this.spawnFruit();
        }
    }

    /**
     * Spawns a fruit at a random empty location.
     */
    spawnFruit(): void {
        let x = Math.floor(Math.random() * this.tileMap.width);
        let y = Math.floor(Math.random() * this.tileMap.height);

        if (this.tileMap.getEntity(x, y)) {
            this.spawnFruit();
            return;
        }

        let fruit = new Fruit();
        fruit.onConsumtion = this.fruitConsumtionHandler;
        this.tileMap.addEntity(fruit, x, y);
    }
}