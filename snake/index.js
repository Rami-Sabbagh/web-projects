import Game from './snake-game/Game.js';
import StandardKeyboardControls from './snake-game/StandardKeyboardControls.js';
import Gamepad2Keyboard from './snake-game/Gamepad2Keyboard.js';

let game = new Game(30, 20);

let timer = new class Timer {
    _timer = 0;
    _timerInterval = undefined;

    start() {
        this.reset();
        this.resume();
    }

    resume() {
        if (this._timerInterval !== undefined) { return }
        this._timerInterval = setInterval(this.tick.bind(this), 1000);
    }

    pause() {
        if (this._timerInterval === undefined) { return; }
        clearInterval(this._timerInterval);
        this._timerInterval = undefined;
    }

    stop() { this.pause(); }

    reset() {
        this._timer = 0;
        this.updateDisplay();
    }

    tick() {
        this._timer++;
        this.updateDisplay();
    }

    formatDisplay() {
        let seconds = (this._timer % 60).toString();
        let minutes = Math.floor(this._timer / 60).toString();

        if (seconds.length === 1) { seconds = "0" + seconds; }
        if (minutes.length === 1) { minutes = "0" + minutes; }

        return minutes + ":" + seconds;
    }

    updateDisplay() {
        document.querySelector(".timer-value").innerHTML = this.formatDisplay();
    }
}

function updateScoreDisplay(increaseByOne) {
    document.querySelector(".score-value").innerHTML = (game.snake.length + (increaseByOne ? 1 : 0)).toString();
}

function showDeathOverlay() {
    let overlay = document.querySelector(".game-over");
    let scoreDisplay = document.querySelector(".game-over .score");
    scoreDisplay.innerHTML = `<b>Score:</b> ${game.snake.length.toString()} - <b>Time:</b> ${timer.formatDisplay()}`;
    overlay.classList.add("active");
}

function hideDeathOverlay() {
    let overlay = document.querySelector(".game-over");
    overlay.classList.remove("active");
}

//Starts / Restarts the game.
function startGame() {
    hideDeathOverlay();
    game.start();
    timer.start();
    timer.updateDisplay();
    updateScoreDisplay();
}

game.onFruitConsumed = () => updateScoreDisplay(true); //we increase by 1 because the snake's length has not been updated yet at this call.
game.onDeath = () => { timer.stop(); showDeathOverlay(); }

new StandardKeyboardControls(game.snake);
new Gamepad2Keyboard();

let root = document.querySelector(".game-container");
root.insertBefore(game.element, root.firstChild)

//==-- Toolbar buttons --//
document.querySelector(".game-bar .buttons-container .icon-reload").onclick = startGame;

//==-- Death screen --==//
let restartButton = document.querySelector(".restart");
restartButton.onclick = startGame;

startGame();