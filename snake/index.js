import Game from './snake-game/Game.js';
import StandardKeyboardControls from './snake-game/StandardKeyboardControls.js';
import Gamepad2Keyboard from './snake-game/Gamepad2Keyboard.js';

let restartButton = document.querySelector(".game-bar .buttons-container .icon-reload");
let fullscreenButton = document.querySelector(".game-bar .buttons-container .icon-fullscreen");

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

//Toggles fullscreen mode.
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.querySelector("html").requestFullscreen();
    }
}

function updateFullscreenButton() {
    if (document.fullscreenElement) {
        fullscreenButton.classList.remove("icon-fullscreen");
        fullscreenButton.classList.add("icon-fullscreen-exit");
    } else {
        fullscreenButton.classList.remove("icon-fullscreen-exit");
        fullscreenButton.classList.add("icon-fullscreen");
    }
}

game.onFruitConsumed = () => updateScoreDisplay(true); //we increase by 1 because the snake's length has not been updated yet at this call.
game.onDeath = () => { timer.stop(); showDeathOverlay(); }

new StandardKeyboardControls(game.snake);
new Gamepad2Keyboard();

let root = document.querySelector(".game-container");
root.insertBefore(game.element, root.firstChild)

if (document.fullscreenEnabled) { fullscreenButton.removeAttribute("disabled"); }
document.onfullscreenchange = updateFullscreenButton;

//==-- Toolbar buttons --//
restartButton.onclick = () => { game.reset(); setTimeout(startGame, 200); };
fullscreenButton.onclick = toggleFullscreen;

//==-- Death screen --==//
let deathRestartButton = document.querySelector(".restart");
deathRestartButton.onclick = startGame;

startGame();