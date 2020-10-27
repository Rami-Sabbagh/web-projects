import Game from './snake-game/Game.js';
import Gamepad2Keyboard from './snake-game/Gamepad2Keyboard.js';

let game = new Game(30,20);
let root = document.querySelector(".game-container");
root.insertBefore(game.element, root.firstChild)

new Gamepad2Keyboard();