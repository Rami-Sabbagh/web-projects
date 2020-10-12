
let memoryBarButtonsIds = [
    "mc", "mr", "m+", "m-", "ms"
];

let inputPadButtonsIds = [
    "percent", "ce", "c", "backspace",
    "inverse", "square", "square_root", "divide",
    "num_7", "num_8", "num_9", "multiply",
    "num_4", "num_5", "num_6", "substract",
    "num_1", "num_2", "num_3", "add",
    "invert", "num_0", "period", "calculate"
];

//The HTML elements

let mainDisplay = document.querySelector(".main-display");
let secondaryDisplay = document.querySelector(".secondary-display");
let memoryBar = document.querySelector(".memory-bar")
let inputPad = document.querySelector(".input-pad")

//Calculator variables

let entry = undefined;

//Calculator logic

//num should be a digit string, like "1".
function onNumpadInput(num) {
    if (entry === undefined) { entry = 0; }
    entry = Number(entry + num);

    mainDisplay.innerHTML = entry;
}

//The buttons handlers

function memoryBarHandler(buttonId, ev) {
    console.log("memory bar", buttonId);
    secondaryDisplay.innerHTML = buttonId;
}

function inputPadHandler(buttonId, ev) {
    console.log("input pad", buttonId);
    
    if (buttonId.startsWith("num_")) {
        onNumpadInput(buttonId.substring(4));
    }
}

//Register the onclick event handlers

memoryBar.querySelectorAll("button").forEach(function(button, id) {
    let buttonId = memoryBarButtonsIds[id];
    button.onclick = function(ev) {
        memoryBarHandler(buttonId, ev);
    }
});

inputPad.querySelectorAll("button").forEach(function(button, id) {
    let buttonId = inputPadButtonsIds[id];
    button.onclick = function(ev) {
        inputPadHandler(buttonId, ev);
    }
});