export default class Gamepad2Keyboard {
    _gamepads = {};
    _gamepadZone = 0.8;
    
    constructor() {
        window.addEventListener("gamepadconnected", ev => {
            let gamepad = ev.gamepad;
            console.log("Gamepad Connected", gamepad);
            this._gamepads[gamepad.id] = gamepad;
        })
        
        window.addEventListener("gamepaddisconnected", ev => {
            let gamepad = ev.gamepad;
            console.log("Gamepad Disconnected", gamepad);
            delete this._gamepads[gamepad.id];
        })

        let updateLoopHandler = (dt) => {
            this.updateControllers();
            requestAnimationFrame(updateLoopHandler);
        }
        requestAnimationFrame(updateLoopHandler);
    }

    updateControllers() {
        for (let gamepadId in this._gamepads) {
            let gamepad = this._gamepads[gamepadId];

            let axisX = gamepad.axes[0];
            let axisY = gamepad.axes[1];

            if (axisX > this._gamepadZone) {
                this.emulateKeyboardButton("ArrowRight");
            } else if (axisX < -this._gamepadZone) {
                this.emulateKeyboardButton("ArrowLeft");
            }

            if (axisY > this._gamepadZone) {
                this.emulateKeyboardButton("ArrowDown");
            } else if (axisY < -this._gamepadZone) {
                this.emulateKeyboardButton("ArrowUp");
            }
        }
    }

    emulateKeyboardButton(key) {
        document.dispatchEvent(new KeyboardEvent("keydown", {key: key}));
        document.dispatchEvent(new KeyboardEvent("keyup", {key: key}));
    }
}