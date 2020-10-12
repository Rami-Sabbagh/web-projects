
let memoryBarButtonsIds = [
    "mc", "mr", "m+", "m-", "ms"
];

let inputPadButtonsIds = [
    "percent", "ce", "c", "backspace",
    "inverse", "square", "square_root", "divide",
    "num_7", "num_8", "num_9", "multiply",
    "num_4", "num_5", "num_6", "subtract",
    "num_1", "num_2", "num_3", "add",
    "invert_sign", "num_0", "period", "calculate"
];

//The HTML elements

let mainDisplay = document.querySelector(".main-display");
let secondaryDisplay = document.querySelector(".secondary-display");
let memoryBar = document.querySelector(".memory-bar")
let inputPad = document.querySelector(".input-pad")

//Calculator variables

let entryBuffer = [];
let entryPeriod = undefined;
let entrySign = false; //true when negative.

//Entry input logic

function formatEntryString() {
    if (entryPeriod === 0) {
        return (entrySign ? "-" : "") + "0." + entryBuffer.join("");
    } else if (entryBuffer.length === 0) {
        return (entrySign ? "-" : "") + "0";
    }

    let fromattedString = (entrySign ? "-" : "");
    let integerPartLength = entryPeriod || entryBuffer.length;

    for (let i = 0; i < integerPartLength; i++) {
        if (i !== 0 && (integerPartLength - i) % 3 === 0) fromattedString += ",";
        fromattedString += entryBuffer[i];
    }

    if (entryPeriod !== undefined) {
        fromattedString += ".";
        for (let i = entryPeriod; i < entryBuffer.length; i++) {
            fromattedString += entryBuffer[i];
        }
    }

    return fromattedString;
}

function updateEntryDisplay() {
    mainDisplay.innerHTML = formatEntryString();
}

//num should be a digit string, like "1".
function onNumpadInput(num) {
    if (entryBuffer.length === 16) return;
    if (num === "0" && entryPeriod === undefined && entryBuffer.length === 0) return;
    entryBuffer.push(num);
}

function onPeriodInput() {
    if (entryPeriod !== undefined) return;
    entryPeriod = entryBuffer.length;
}

function onInvertSignInput() {
    if (entryBuffer.length === 0 & entryPeriod === undefined) return;
    entrySign = !entrySign;
}

function onClearEntryInput() {
    entryBuffer = [];
    entryPeriod = undefined;
    entrySign = false;
}

function onBackspaceInput() {
    if (entryPeriod !== undefined && entryBuffer.length === entryPeriod) {
        entryPeriod = undefined;
    } else {
        entryBuffer.pop();
    }

    if (entryBuffer.length === 0 && entryPeriod === undefined) entrySign = false;
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
        updateEntryDisplay();
    }

    switch (buttonId) {
        case "period":
            onPeriodInput();
            updateEntryDisplay();
            break;
        case "invert_sign":
            onInvertSignInput();
            updateEntryDisplay();
            break;
        case "c":
        case "ce":
            onClearEntryInput();
            updateEntryDisplay();
            break;
        case "backspace":
            onBackspaceInput();
            updateEntryDisplay();
            break;
    }
}

//Register the onclick event handlers

memoryBar.querySelectorAll("button").forEach(function (button, id) {
    let buttonId = memoryBarButtonsIds[id];
    button.onclick = function (ev) {
        memoryBarHandler(buttonId, ev);
    }
});

inputPad.querySelectorAll("button").forEach(function (button, id) {
    let buttonId = inputPadButtonsIds[id];
    button.onclick = function (ev) {
        inputPadHandler(buttonId, ev);
    }
});