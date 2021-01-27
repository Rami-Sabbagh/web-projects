import Snake from "./classes/Snake";
import TileMap from "./classes/TileMap";
import Game from "./Game";

export default class DummyAI {

    //==-- Private properties --==//

    private game: Game;
    private snake: Snake;
    private tileMap: TileMap;
    private width: number;

    //==-- Constructor --==//

    constructor(game: Game) {
        this.game = game;
        this.snake = this.game.snake;
        this.tileMap = this.game.tileMap;
        this.width = this.tileMap.width;

        setInterval(this.tick.bind(this), this.snake.movementTimeout);
    }

    //==-- Methods --==//

    tick() {
        if (this.snake.headX === this.width-1) {
            this.snake.direction = 2;
            this.snake.direction = 3;
        } else if (this.snake.headX === 0) {
            this.snake.direction = 2;
            this.snake.direction = 1;
        }
    }
}