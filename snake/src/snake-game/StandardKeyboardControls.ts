import Snake, { Direction } from "./classes/Snake";

let keyboardBindings: {[keyName: string]: Direction} = {
    ArrowUp: Direction.TOP,
    ArrowRight: Direction.RIGHT,
    ArrowDown: Direction.BOTTOM,
    ArrowLeft: Direction.LEFT,

    w: Direction.TOP, W: Direction.TOP,
    d: Direction.RIGHT, D: Direction.RIGHT,
    s: Direction.BOTTOM, S: Direction.BOTTOM,
    a: Direction.LEFT, A: Direction.LEFT
}

export default class StandardKeyboardControls {

    //==-- Private properties --==//
    
    private readonly snake: Snake;

    //==-- Constructor --==//

    constructor(snake: Snake) {
        this.snake = snake;
        document.addEventListener("keydown", this.onkeydown.bind(this));
    }

    //==-- Methods --==//

    onkeydown(ev: KeyboardEvent) {
        if (!this.snake.paused && ev.key in keyboardBindings) {
            this.snake.direction = keyboardBindings[ev.key];
        }
    }
}