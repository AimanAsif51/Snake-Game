// ================= GAME COMPONENTS =================
let inputDir = { x: 0, y: 0 };
let lastPaintTime = 0;
let speed = 9;
let score = 0;
let isPaused = false;

const foodSound = new Audio('mixkit-video-game-treasure-2066.wav');
const gameOverSound = new Audio('game-over-classic-206486.mp3');
const moveSound = new Audio('mixkit-player-jumping-in-a-video-game-2043.wav');
const musicSound = new Audio('mixkit-game-level-music-689.wav');

musicSound.loop = true;

let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 5 };

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

// ================= MAIN LOOP =================
function main(ctime) {
    window.requestAnimationFrame(main);

    if (isPaused) return;

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;

    gameEngine();
}

// ================= COLLISION =================
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    if (
        snake[0].x >= 18 || snake[0].x <= 0 ||
        snake[0].y >= 18 || snake[0].y <= 0
    ) {
        return true;
    }

    return false;
}

// ================= GAME ENGINE =================
function gameEngine() {

    if (isCollide(snakeArr)) {
        musicSound.pause();
        gameOverSound.play();
        isPaused = true;
        alert("Game Over!");
        return;
    }

    // Eat food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;
        scoreBox.innerHTML = "Score: " + score;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "Hiscore: " + hiscoreval;
        }

        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        food = {
            x: Math.floor(Math.random() * 15) + 2,
            y: Math.floor(Math.random() * 15) + 2
        };
    }

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Draw
    board.innerHTML = "";

    snakeArr.forEach((e, index) => {
        let el = document.createElement("div");
        el.style.gridRowStart = e.y;
        el.style.gridColumnStart = e.x;
        el.classList.add(index === 0 ? "head" : "snake");
        board.appendChild(el);
    });

    let foodEl = document.createElement("div");
    foodEl.style.gridRowStart = food.y;
    foodEl.style.gridColumnStart = food.x;
    foodEl.classList.add("food");
    board.appendChild(foodEl);
}

// ================= HISCORE =================
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
hiscoreBox.innerHTML = "Hiscore: " + hiscoreval;

// ================= BUTTON EVENTS =================
pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.innerText = isPaused ? "▶ Resume" : "⏸ Pause";

    if (isPaused) musicSound.pause();
    else musicSound.play();
});

restartBtn.addEventListener("click", () => {
    score = 0;
    scoreBox.innerHTML = "Score: 0";
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 0 };
    isPaused = false;
    pauseBtn.innerText = "⏸ Pause";
    musicSound.play();
});

// ================= CONTROLS =================
window.addEventListener("keydown", e => {
    moveSound.play();
    musicSound.play();

    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});

// ================= START =================
window.requestAnimationFrame(main);
