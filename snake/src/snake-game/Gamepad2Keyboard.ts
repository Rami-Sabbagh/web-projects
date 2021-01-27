export default class Gamepad2Keyboard {
    private readonly gamepads: {[gamepadId: string]: Gamepad} = {};
    private readonly gamepadZone = 0.8;
    
    constructor() {

        window.addEventListener("gamepadconnected", (event: Event) => {
            const ev = event as GamepadEvent;

            let gamepad = ev.gamepad;
            console.log("Gamepad Connected", gamepad);
            this.gamepads[gamepad.id] = gamepad;
        })
        
        window.addEventListener("gamepaddisconnected", (event: Event) => {
            const ev = event as GamepadEvent;

            let gamepad = ev.gamepad;
            console.log("Gamepad Disconnected", gamepad);
            delete this.gamepads[gamepad.id];
        })

        let updateLoopHandler: FrameRequestCallback = (dt: number) => {
            this.updateControllers();
            requestAnimationFrame(updateLoopHandler);
        }
        requestAnimationFrame(updateLoopHandler);
    }

    updateControllers(): void {
        for (let gamepadId in this.gamepads) {
            let gamepad = this.gamepads[gamepadId];

            let axisX = gamepad.axes[0];
            let axisY = gamepad.axes[1];

            if (axisX > this.gamepadZone) {
                this.emulateKeyboardButton("ArrowRight");
            } else if (axisX < -this.gamepadZone) {
                this.emulateKeyboardButton("ArrowLeft");
            }

            if (axisY > this.gamepadZone) {
                this.emulateKeyboardButton("ArrowDown");
            } else if (axisY < -this.gamepadZone) {
                this.emulateKeyboardButton("ArrowUp");
            }
        }
    }

    emulateKeyboardButton(key: string) {
        document.dispatchEvent(new KeyboardEvent("keydown", {key: key}));
        document.dispatchEvent(new KeyboardEvent("keyup", {key: key}));
    }
}