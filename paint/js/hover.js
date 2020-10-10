{
    const canvas = document.querySelector(".hover-canvas");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");

    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    let brushRadius = 25/2;

    let hoverHandler = {
        _events: ["pointerover", "pointerenter", "pointerdown", "pointermove",
            "pointerup", "pointercancel", "pointerout", "pointerleave"],

        pointers: {}, //indexes: pointerId, values: [lastX, lastY]
        pointersChanged: false, //When true, the canvas has to be updated.

        //Whether a pointer of this type is supported or not.
        isSupported: function (pointerType) {
            return (pointerType === "mouse" || pointerType === "pen");
        },

        drawPointers: function() {
            clearCanvas();

            ctx.strokeStyle = "#aaaaaa";
            ctx.lineWidth = 3;
            ctx.beginPath();

            for (let pointerId in this.pointers) {
                let pointer = this.pointers[pointerId];
                if (pointer === undefined) continue;
                ctx.arc(pointer[0], pointer[1], brushRadius, 0, 2*Math.PI);
            }

            ctx.stroke();
            this.pointersChanged = false;
        },

        onEvent: function (ev) {
            if (!this.isSupported(ev.pointerType)) return;

            switch (ev.type) {
                case "pointerout":
                case "pointerleave":
                case "pointercancel":
                    if (this.pointers[ev.pointerId] !== undefined) {
                        delete this.pointers[ev.pointerId];
                    }
                    break;
                
                default:
                    this.pointers[ev.pointerId] = [ev.x, ev.y];
                    break;
            }

            if (!this.pointersChanged) {
                this.pointersChanged = true;
                requestAnimationFrame(timestamp => this.drawPointers());
            }
        },

        addListeners: function () {
            for (let event of this._events) {
                window.addEventListener(event, ev => this.onEvent(ev));
            }
        }
    }

    window.addEventListener("resize", function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        hoverHandler.drawPointers();
    })

    hoverHandler.addListeners();
}