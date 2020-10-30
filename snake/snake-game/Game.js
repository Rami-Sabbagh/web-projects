import TileMap from './classes/TileMap.js';
import Snake from './classes/Snake.js';
import Fruit from './classes/Fruit.js';

export default class Game {
    _timer = 0;
    _timerHandle = undefined;

    constructor(width = 30, height = 20, initialFruits = 5) {
        this.tileMap = new TileMap(width, height);

        this.snake = new Snake(this.tileMap, Math.floor(width / 2) + 2, Math.floor(height / 2));
        this.snake.onDeath = this.onDeath.bind(this);

        for (let i = 0; i < initialFruits; i++) {
            this.spawnNewFruit();
        }

        this._timerHandle = setInterval(() => {
            this._timer++;
            this.updateTimerDisplay();
        }, 1000);
        this.updateScoreDisplay();

        document.querySelector(".game-over .restart").addEventListener("click", ev => {
            document.querySelector(".game-over").classList.remove("active");
            this.snake.destroy();
            this.tileMap.clearEntities();
            this.snake.respawn(Math.floor(width / 2) + 2, Math.floor(height / 2));

            for (let i = 0; i < initialFruits; i++) {
                this.spawnNewFruit();
            }

            this.snake.resume();
            //TODO: Fix timer no longer working after restart
        });
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
        fruit.onConsumtion = this.onFruitConsumed.bind(this);
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
        //Stop the game timer
        if (this._timerHandle !== undefined) {
            clearInterval(this._timerHandle);
            this._timerHandle = undefined;
        }

        let overlay = document.querySelector(".game-over");
        let scoreDisplay = document.querySelector(".game-over .score");

        scoreDisplay.innerHTML = `<b>Score:</b> ${this.snake.length.toString()} - <b>Time:</b> ${this.formatTimer()}`;

        overlay.classList.add("active");
    }
}