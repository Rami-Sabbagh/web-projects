import Game from './snake-game/Game.js';

let game = new Game(30,20);
let root = document.querySelector(".game-container");
root.insertBefore(game.element, root.firstChild)