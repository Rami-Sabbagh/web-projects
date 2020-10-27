import TileMap from './classes/TileMap.js';
import Snake from './classes/Snake.js';
import Fruit from './classes/Fruit.js';

export default class Game {
    _timer = 0;
    _timerHandle = undefined;

    constructor(width = 100, height = 100, initialFruits = 5) {
        this.tileMap = new TileMap(width, height);

        this.snake = new Snake(this.tileMap, this.onFruitConsumed.bind(this), this.onDeath.bind(this),
            Math.floor(width / 2) + 2,
            Math.floor(height / 2)
        );

        for (let i = 0; i < initialFruits; i++) {
            this.spawnNewFruit();
        }

        this._timerHandle = setInterval(() => {
            this._timer++;
            this.updateTimerDisplay();
        }, 1000);
        this.updateScoreDisplay();
    }

    get element() {
        return this.tileMap.element;
    }

    spawnNewFruit() {
        let x = Math.floor(Math.random() * this.tileMap.width);
        let y = Math.floor(Math.random() * this.tileMap.height);

        if (this.tileMap.getEntity(x, y)) {
            this.spawnNewFruit();
            return;
        }

        let fruit = new Fruit();
        this.tileMap.addEntity(fruit, x, y);
    }

    formatTimer() {
        let seconds = (this._timer % 60).toString();
        let minutes = Math.floor(this._timer / 60).toString();

        if (seconds.length === 1) { seconds = "0" + seconds; }
        if (minutes.length === 1) { minutes = "0" + minutes; }

        return minutes + ":" + seconds;
    }

    updateScoreDisplay() {
        document.querySelector(".score-value").innerHTML = this.snake.length.toString();
    }

    updateTimerDisplay() {
        document.querySelector(".timer-value").innerHTML = this.formatTimer();
    }

    onFruitConsumed() {
        this.spawnNewFruit();
        this.updateScoreDisplay();
    }

    onDeath() {
        if (this._timerHandle !== undefined) {
            clearInterval(this._timerHandle);
            this._timerHandle = undefined;
        }
        alert("YOU LOST!");
    }
}