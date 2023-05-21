const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const board = document.getElementById("board");
const selector = document.getElementById("selector");
const containerMain = document.getElementById("containerMain");
const textInput = document.getElementById("textInput");

const SQUARES_NUMBER_ROW = Math.ceil(
    containerMain.getBoundingClientRect().width / 24
);
const SQUARES_NUMBER_COL = Math.ceil(
    containerMain.getBoundingClientRect().height / 24 + 1
);
const SQUARES_HALF_SIZE = 12;

let selectorXSize = selector.getBoundingClientRect().width;
let selectorYSize = selector.getBoundingClientRect().height;
let selectorXCoord = selector.offsetLeft;
let selectorYCoord = selector.offsetTop;
let selectorX = [selectorXCoord, selectorXSize + selectorXCoord];
let selectorY = [selectorYCoord, selectorYSize + selectorYCoord];

let squaresFontElements = [];

const newRowElements = [];

let word = "";

let animationStop = true;
let afkTime = 12;
let timeUntilAnimationStop = 0;

for (let i = 0; i < SQUARES_NUMBER_COL; i++) {
    const row = document.createElement("div");

    row.classList.add("row1");

    squaresFontElements.push([]);

    for (let j = 0; j < SQUARES_NUMBER_ROW; j++) {
        const square = document.createElement("div");

        square.classList.add("square1");

        if (Math.random() < 0.01) {
            squaresFontElements[i].push(square);

            square.textContent =
                ALPHABET[Math.round(Math.random() * ALPHABET.length)];
        }

        row.append(square);
    }

    board.append(row);
}
squaresFontElements = squaresFontElements.map((rowItem) => {
    if (rowItem[0]) {
        return rowItem
            .map((colItem) => {
                if (colItem) {
                    return colItem;
                }
                return null;
            })
            .filter((colItem) => !!colItem);
    }
    return null;
});

const scroll = () => {
    if (!animationStop && timeUntilAnimationStop > 0) {
        squaresFontElements = squaresFontElements.map((item) => {
            if (item) {
                return (item = item.filter((item1) => {
                    const itemX =
                        item1.getBoundingClientRect().left -
                        2 -
                        containerMain.getBoundingClientRect().left +
                        SQUARES_HALF_SIZE;
                    const itemY =
                        item1.getBoundingClientRect().top -
                        2 -
                        containerMain.getBoundingClientRect().top +
                        SQUARES_HALF_SIZE;
                    if (
                        itemX > selectorX[0] &&
                        itemX < selectorX[1] &&
                        itemY > selectorY[0] &&
                        itemY < selectorY[1]
                    ) {
                        word += item1.textContent;
                        textInput.value = word;
                        item1.textContent = "";
                        return false;
                    }
                    return true;
                }));
            }
            return null;
        });

        board.firstChild.style.marginTop = `${
            parseInt(getComputedStyle(board.firstChild).marginTop) + 1
        }px`;

        if (board.firstChild.offsetTop >= 24) {
            squaresFontElements.pop();

            const row = document.createElement("div");

            row.classList.add("row1");

            for (let i = 0; i < SQUARES_NUMBER_ROW; i++) {
                const square = document.createElement("div");

                square.classList.add("square1");

                if (Math.random() < 0.01) {
                    newRowElements.push(square);

                    square.textContent =
                        ALPHABET[Math.round(Math.random() * ALPHABET.length)];
                }

                row.append(square);
            }

            squaresFontElements = [newRowElements, ...squaresFontElements];
            board.removeChild(board.lastChild);
            board.firstChild.style.marginTop = `0px`;
            board.prepend(row);
        }
        requestAnimationFrame(scroll);
    }
};

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowRight":
            if (
                selectorX[1] <
                containerMain.getBoundingClientRect().width - 6
            ) {
                timeUntilAnimationStop = afkTime;
                selector.style.left = `${selectorX[0] + 6}px`;
                selectorXCoord = selector.offsetLeft;
                selectorX = [selectorXCoord, selectorXSize + selectorXCoord];
            }
            break;
        case "ArrowLeft":
            if (selectorX[0] - 6 > 0) {
                timeUntilAnimationStop = afkTime;
                selector.style.left = `${selectorX[0] - 6}px`;
                selectorXCoord = selector.offsetLeft;
                selectorX = [selectorXCoord, selectorXSize + selectorXCoord];
            }
            break;
        case "ArrowUp":
            if (selectorY[0] - 6 > 0) {
                timeUntilAnimationStop = afkTime;
                selector.style.top = `${selectorY[0] - 6}px`;
                selectorYCoord = selector.offsetTop;
                selectorY = [selectorYCoord, selectorYSize + selectorYCoord];
            }
            break;
        case "ArrowDown":
            if (
                selectorY[0] <
                containerMain.getBoundingClientRect().height - 6
            ) {
                timeUntilAnimationStop = afkTime;
                selector.style.top = `${selectorY[0] + 6}px`;
                selectorYCoord = selector.offsetTop;
                selectorY = [selectorYCoord, selectorYSize + selectorYCoord];
            }
            break;
        default:
            break;
    }
});

document.addEventListener("click", (e) => {
    if (e.target.closest("#start") && animationStop) {
        animationStop = false;
        timeUntilAnimationStop = afkTime;
        requestAnimationFrame(scroll);
        const intervalTimer = setInterval(() => {
            console.log(timeUntilAnimationStop);
            if (!(timeUntilAnimationStop > 0)) {
                animationStop = true;
                timeUntilAnimationStop = 0;
                clearInterval(intervalTimer);
            } else {
                timeUntilAnimationStop -= 1;
            }
        }, 1000);
    }
    if (e.target.closest("#stop") && !animationStop) {
        animationStop = true;
        timeUntilAnimationStop = 0;
    }
});
