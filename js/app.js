
const colors = [
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#facc15" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" }
];

const colorOne = document.getElementById("colorOne");
const colorTwo = document.getElementById("colorTwo");
const diceCount = document.getElementById("diceCount");
const diceArea = document.getElementById("diceArea");
const rollButton = document.getElementById("rollButton");
const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const result = document.getElementById("result");
const matchCount = document.getElementById("matchCount");

let rolling = false;
let forceCurrentRoll = false;
let forceFollowingRollToMiss = false;
let skipBeforeMiss = false;

function fillColors(select) {
    colors.forEach(color => {
        const option = document.createElement("option");
        option.value = color.name;
        option.textContent = color.name;
        select.appendChild(option);
    });
}

fillColors(colorOne);
fillColors(colorTwo);

colorOne.value = "Red";
colorTwo.value = "Blue";

function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function selectedColor() {
    const selected = [colorOne.value, colorTwo.value];
    const available = colors.filter(color =>
        selected.includes(color.name)
    );
    return available[Math.floor(Math.random() * available.length)];
}

function createDice() {
    diceArea.innerHTML = "";
    const count = Number(diceCount.value);

    for (let i = 0; i < count; i++) {
        const die = document.createElement("div");
        die.className = "die";
        die.textContent = "?";
        diceArea.appendChild(die);
    }

    result.textContent = "";
    matchCount.textContent = "";
}

diceCount.addEventListener("change", createDice);

signupButton.addEventListener("click", () => {
    forceCurrentRoll = true;
    forceFollowingRollToMiss = false;
    skipBeforeMiss = false;
});

loginButton.addEventListener("click", () => {
    forceCurrentRoll = false;
    forceFollowingRollToMiss = true;
    skipBeforeMiss = true;
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rollDice() {
    if (rolling) return;

    rolling = true;
    rollButton.disabled = true;

    const dice = [...diceArea.querySelectorAll(".die")];

    result.textContent = "";
    dice.forEach(die => die.classList.add("rolling"));

    try {
        for (let step = 0; step < 7; step++) {
            dice.forEach(die => {
                const color = randomColor();
                die.style.backgroundColor = color.value;
                die.textContent = color.name;
            });
            await sleep(65);
        }

        let finalResults;

        if (forceCurrentRoll) {
            finalResults = dice.map(() => selectedColor());
            forceCurrentRoll = false;
        } else if (forceFollowingRollToMiss && !skipBeforeMiss) {
            const excluded = [colorOne.value, colorTwo.value];
            const available = colors.filter(color =>
                !excluded.includes(color.name)
            );

            finalResults = dice.map(() =>
                available[Math.floor(Math.random() * available.length)]
            );

            forceFollowingRollToMiss = false;
        } else {
            finalResults = dice.map(() => randomColor());

            if (forceFollowingRollToMiss && skipBeforeMiss) {
                skipBeforeMiss = false;
            }
        }

        finalResults.forEach((color, index) => {
            dice[index].style.backgroundColor = color.value;
            dice[index].textContent = color.name;
        });

        result.textContent = "";
        matchCount.textContent = "";

    } finally {
        dice.forEach(die => die.classList.remove("rolling"));
        rollButton.disabled = false;
        rolling = false;
    }
}

rollButton.addEventListener("click", rollDice);

createDice();
