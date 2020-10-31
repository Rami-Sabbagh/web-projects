export default class DummyAI {

    //==-- Private properties --==//

    _game = undefined;
    _snake = undefined;
    _tileMap = undefined;
    _width = undefined;

    //==-- Constructor --==//

    constructor(game) {
        this._game = game;
        this._snake = this._game.snake;
        this._tileMap = this._game.tileMap;
        this._width = this._tileMap.width;

        setInterval(this.tick.bind(this), this._snake._movementTimeout);
    }

    //==-- Methods --==//

    tick() {
        if (this._snake._headX === this._width-1) {
            this._snake.direction = 2;
            this._snake.direction = 3;
        } else if (this._snake._headX === 0) {
            this._snake.direction = 2;
            this._snake.direction = 1;
        }
    }
}