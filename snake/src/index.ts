import Game from './snake-game/Game';
import StandardKeyboardControls from './snake-game/StandardKeyboardControls';
import Gamepad2Keyboard from './snake-game/Gamepad2Keyboard';

let restartButton: HTMLElement = document.querySelector(".game-bar .buttons-container .icon-reload") as HTMLElement;
let fullscreenButton: HTMLElement = document.querySelector(".game-bar .buttons-container .icon-fullscreen") as HTMLElement;
let pauseButton: HTMLElement = document.querySelector(".game-bar .buttons-container .icon-pause") as HTMLElement;

let game: Game = new Game(30, 20);

let timer = new class Timer {
    private timer: number = 0;
    private timerInterval: number | undefined = undefined;
    private readonly timerTimeout: number = 200;

    start(): void {
        this.reset();
        this.resume();
    }

    resume(): void {
        if (this.timerInterval !== undefined) { return }
        this.timerInterval = setInterval(this.tick.bind(this), this.timerTimeout);
    }

    pause(): void {
        if (this.timerInterval === undefined) { return; }
        clearInterval(this.timerInterval);
        this.timerInterval = undefined;
    }

    stop(): void { this.pause(); }

    reset(): void {
        this.timer = 0;
        this.updateDisplay();
    }

    tick(): void {
        this.timer += this.timerTimeout/1000;
        this.updateDisplay();
    }

    formatDisplay(): string {
        let seconds = Math.floor(this.timer % 60).toString();
        let minutes = Math.floor(this.timer / 60).toString();

        if (seconds.length === 1) { seconds = "0" + seconds; }
        if (minutes.length === 1) { minutes = "0" + minutes; }

        return minutes + ":" + seconds;
    }

    updateDisplay(): void {
        (document.querySelector(".timer-value") as HTMLElement).innerHTML = this.formatDisplay();
    }
}

function updateScoreDisplay(increaseByOne: boolean = false) {
    (document.querySelector(".score-value") as HTMLElement).innerHTML = (game.snake.length + (increaseByOne ? 1 : 0)).toString();
}

function showDeathOverlay() {
    let overlay = document.querySelector(".game-over") as HTMLElement;
    let scoreDisplay = document.querySelector(".game-over .score") as HTMLElement;
    scoreDisplay.innerHTML = `<b>Score:</b> ${game.snake.length.toString()} - <b>Time:</b> ${timer.formatDisplay()}`;
    overlay.classList.add("active");
}

function hideDeathOverlay() {
    let overlay = document.querySelector(".game-over") as HTMLElement;
    overlay.classList.remove("active");
}

//Starts / Restarts the game.
function startGame() {
    hideDeathOverlay();
    game.start();
    timer.start();
    timer.updateDisplay();
    updateScoreDisplay();

    if (document.querySelector(".game-paused.active")) {
        game.pause();
        timer.pause();
    }
}

//Toggles the game's paused state.
function toggleGamePause() {
    let overlay = document.querySelector(".game-paused") as HTMLElement;
    let active = overlay.classList.toggle("active");
    
    if (active) {
        pauseButton.classList.remove("icon-pause");
        setTimeout(() => pauseButton.classList.add("icon-play"), 50);

        game.pause();
        timer.pause();
    } else {
        pauseButton.classList.remove("icon-play");
        setTimeout(() => pauseButton.classList.add("icon-pause"), 50);
        
        game.resume();
        timer.resume();
    }
}

//Toggles fullscreen mode.
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        (document.querySelector("html") as HTMLElement).requestFullscreen();
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

let root: HTMLElement = document.querySelector(".game-container") as HTMLElement;
root.insertBefore(game.element, root.firstChild)

if (document.fullscreenEnabled) { fullscreenButton.removeAttribute("disabled"); }
document.onfullscreenchange = updateFullscreenButton;

//==-- Toolbar buttons --//
restartButton.onclick = () => { game.reset(); setTimeout(startGame, 200); };
fullscreenButton.onclick = toggleFullscreen;
pauseButton.onclick = toggleGamePause;

//==-- Death screen --==//
let deathRestartButton: HTMLElement = document.querySelector(".restart") as HTMLElement;
deathRestartButton.onclick = startGame;

startGame();