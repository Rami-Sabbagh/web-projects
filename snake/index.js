import Game from './snake-game/Game.js';
import StandardKeyboardControls from './snake-game/StandardKeyboardControls.js';
import Gamepad2Keyboard from './snake-game/Gamepad2Keyboard.js';

let game = new Game(30,20);
let root = document.querySelector(".game-container");
root.insertBefore(game.element, root.firstChild)

new StandardKeyboardControls(game.snake);
new Gamepad2Keyboard();