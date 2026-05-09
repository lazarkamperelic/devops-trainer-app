const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const categorySelect = document.getElementById("categorySelect");
const subcategorySelect = document.getElementById("subcategorySelect");
const timeSelect = document.getElementById("timeSelect");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const commandsDiv = document.getElementById("commands");
const descriptionsDiv = document.getElementById("descriptions");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const accuracyEl = document.getElementById("accuracy");
const timerEl = document.getElementById("timer");
const finalScoreEl = document.getElementById("finalScore");

let selectedCommand = null;
let selectedDescription = null;
let nextIndex = 5;
let score = 0;
let attempts = 0;
let correctAnswers = 0;
let matchedCount = 0;
let timer = parseInt(timeSelect.value);
let interval = null;
let data = [];

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
menuBtn.addEventListener("click", goToMenu);

document.addEventListener("DOMContentLoaded", loadCategories);

async function loadCategories() {
    const response = await fetch("/api/categories");
    const categories = await response.json();

    categorySelect.innerHTML = "";

    const categoryOrder = ["linux", "git", "docker", "kubernetes", "terraform", "aws-cli"];

    categoryOrder.forEach(categoryKey => {
        if (!categories[categoryKey]) return;

        const option = document.createElement("option");
        option.value = categoryKey;
        option.textContent = categories[categoryKey].name;
        categorySelect.appendChild(option);
    });

    updateSubcategories(categories);

    categorySelect.addEventListener("change", () => {
        updateSubcategories(categories);
    });
}

function updateSubcategories(categories) {
    const selectedCategory = categorySelect.value;
    const subcategories = categories[selectedCategory].subcategories;

    subcategorySelect.innerHTML = "";

    Object.keys(subcategories).forEach(subcategoryKey => {
        const option = document.createElement("option");
        option.value = subcategoryKey;
        option.textContent = subcategories[subcategoryKey].name;
        subcategorySelect.appendChild(option);
    });

    updateHighScoreDisplay();
}

async function startGame() {
    const category = categorySelect.value;
    const subcategory = subcategorySelect.value;

    const response = await fetch(`/api/questions/${category}/${subcategory}`);
    data = await response.json();

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    endScreen.classList.add("hidden");

    commandsDiv.innerHTML = "";
    descriptionsDiv.innerHTML = "";

    selectedCommand = null;
    selectedDescription = null;
    nextIndex = 5;

    score = 0;
    attempts = 0;
    correctAnswers = 0;
    matchedCount = 0;
    timer = parseInt(timeSelect.value);

    updateScore();
    updateAccuracy();
    updateHighScoreDisplay();
    updateTimer();

    startTimer();
    loadGame();
}

function startTimer() {
    clearInterval(interval);

    interval = setInterval(() => {
        timer--;
        updateTimer();

        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    timerEl.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateScore() {
    scoreEl.textContent = `Score: ${score}`;
}

function updateAccuracy() {
    if (attempts === 0) {
        accuracyEl.textContent = "Accuracy: 100%";
        return;
    }

    const accuracy = Math.round((correctAnswers / attempts) * 100);
    accuracyEl.textContent = `Accuracy: ${accuracy}%`;
}

function getHighScoreKey() {
    const category = categorySelect.value;
    const subcategory = subcategorySelect.value;
    return `highScore_${category}_${subcategory}`;
}

function updateHighScoreDisplay() {
    const highScore = localStorage.getItem(getHighScoreKey()) || 0;
    highScoreEl.textContent = `High Score: ${highScore}`;
}

function saveHighScore() {
    const key = getHighScoreKey();
    const currentHighScore = Number(localStorage.getItem(key) || 0);

    if (score > currentHighScore) {
        localStorage.setItem(key, score);
    }

    updateHighScoreDisplay();
}

function endGame() {
    clearInterval(interval);

    saveHighScore();

    commandsDiv.innerHTML = "";
    descriptionsDiv.innerHTML = "";

    const accuracy =
        attempts === 0
            ? 100
            : Math.round((correctAnswers / attempts) * 100);

    finalScoreEl.textContent =
        `Final score: ${score} | Accuracy: ${accuracy}%`;

    endScreen.classList.remove("hidden");
}

function loadGame() {
    const firstFive = data.slice(0, 5);
    const shuffled = [...firstFive].sort(() => Math.random() - 0.5);

    firstFive.forEach(item => {
        commandsDiv.appendChild(createCommandCard(item));
    });

    shuffled.forEach(item => {
        descriptionsDiv.appendChild(createDescriptionCard(item));
    });
}

function createCommandCard(item) {
    const card = document.createElement("div");
    card.className = "card command-card";
    card.textContent = item.desc;
    card.dataset.cmd = item.cmd;

    card.addEventListener("click", () => {
        if (selectedDescription) {
            if (card.dataset.cmd === selectedDescription.dataset.cmd) {
                handleCorrect(card, selectedDescription);
            } else {
                handleWrong(card, selectedDescription);
            }
            return;
        }

        document.querySelectorAll(".command-card").forEach(c => {
            c.classList.remove("selected");
        });

        selectedCommand = card;
        card.classList.add("selected");
    });

    return card;
}

function createDescriptionCard(item) {
    const card = document.createElement("div");
    card.className = "card description-card";
    card.textContent = item.cmd;
    card.dataset.cmd = item.cmd;

    card.addEventListener("click", () => {
        if (selectedCommand) {
            if (selectedCommand.dataset.cmd === card.dataset.cmd) {
                handleCorrect(selectedCommand, card);
            } else {
                handleWrong(selectedCommand, card);
            }
            return;
        }

        document.querySelectorAll(".description-card").forEach(c => {
            c.classList.remove("selected");
        });

        selectedDescription = card;
        card.classList.add("selected");
    });

    return card;
}

function handleCorrect(cmd, desc) {
    cmd.classList.add("correct");
    desc.classList.add("correct");

    score++;
    attempts++;
    correctAnswers++;
    matchedCount++;

    updateScore();
    updateAccuracy();

    selectedCommand = null;
    selectedDescription = null;

    setTimeout(() => {
        replacePair(cmd, desc);
    }, 400);
}

function handleWrong(cmd, desc) {
    cmd.classList.add("wrong");
    desc.classList.add("wrong");

    attempts++;
    updateAccuracy();

    selectedCommand = null;
    selectedDescription = null;

    setTimeout(() => {
        cmd.classList.remove("wrong", "selected");
        desc.classList.remove("wrong", "selected");
    }, 400);
}

function replacePair(cmd, desc) {
    if (nextIndex >= data.length) {
        nextIndex = 0;
        data = [...data].sort(() => Math.random() - 0.5);
    }

    const newItem = data[nextIndex];

    const newCmd = createCommandCard(newItem);
    const newDesc = createDescriptionCard(newItem);

    cmd.replaceWith(newCmd);
    desc.replaceWith(newDesc);

    nextIndex++;
}

function restartGame() {
    clearInterval(interval);
    startGame();
}

function goToMenu() {
    clearInterval(interval);

    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    endScreen.classList.add("hidden");

    commandsDiv.innerHTML = "";
    descriptionsDiv.innerHTML = "";

    updateHighScoreDisplay();
}
