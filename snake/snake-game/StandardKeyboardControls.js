let keyboardBindings = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3,

    w: 0, W: 0,
    d: 1, D: 1,
    s: 2, S: 2,
    a: 3, A: 3
}

export default class StandardKeyboardControls {

    //==-- Private properties --==//
    _snake = undefined;

    //==-- Constructor --==//

    constructor(snake) {
        this._snake = snake;
        document.addEventListener("keydown", this.onkeydown.bind(this));
    }

    //==-- Methods --==//

    onkeydown(ev) {
        if (ev.key in keyboardBindings) {
            this._snake.direction = keyboardBindings[ev.key];
        }
    }
}