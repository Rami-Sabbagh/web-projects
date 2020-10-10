{
    const canvas = document.querySelector(".game-canvas");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, width, height);

    window.addEventListener("resize", function() {
        let imagedata = ctx.getImageData(0, 0, width, height);
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        ctx.fillRect(0, 0, width, height);
        ctx.putImageData(imagedata, 0, 0);
    })

    let pointers = {
        _events: ["pointerdown", "pointerup", "pointercancel"],
        _down: {},

        isDown: function (pointerId) {
            return this._down[pointerId] === true;
        },

        onevent: function (ev) {
            switch (ev.type) {
                case "pointerdown":
                    this._down[ev.pointerId] = true;
                    break;

                case "pointerup":
                case "pointercancel":
                    delete this._down[ev.pointerId];
            }
        },

        addListeners: function () {
            for (let event of this._events) {
                window.addEventListener(event, ev => this.onevent(ev));
            }
        }
    }

    pointers.addListeners();

    function paint(ev) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 25;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(ev.x, ev.y);
        if (ev.pointerType === "touch") {
            ctx.lineTo(ev.x, ev.y);
        } else {
            ctx.lineTo(ev.x - ev.movementX, ev.y - ev.movementY);
        }
        ctx.stroke();
    }

    for (let event of ["pointercancel", "pointerup", "pointermove", "pointerdown"]) {
        window.addEventListener(event, function (ev) {
            if (pointers.isDown(ev.pointerId) || ev.pointerType === "touch") {
                paint(ev);
            }
        });
    }

    window.ontouchstart = function(event) {
        if (event.touches.length > 1) {
            event.preventDefault(); //Prevent touch gestures.
        }
    }
}