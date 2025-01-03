import {wordList} from './List/word-list.js';

const keyboardDiv = document.querySelector(".keyboard")
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord;
let correctLetters;
let wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerHTML = `<b>${wrongGuessCount} / ${maxGuesses}</b>`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");

}

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // After 600ms of game complete.. showing modal with relevant details
    setTimeout(() => {
        const modalText = isVictory ? `You found the word: ` : `The correct word was: `;
        gameModal.querySelector("img").src = `images/${isVictory ? `victory` : `lost`}.gif`
        gameModal.querySelector("h4").innerText = `${isVictory ? `Congratulations` : `Game Over!`}`
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`

        gameModal.classList.add("show");
    }, 300);
}

const initGame = (button, clickedLetter) => {
    // checking if clickedLetter is exist on the currentWord
    if(currentWord.includes(clickedLetter)) {
        // showing all the correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerHTML = `<b>${wrongGuessCount} / ${maxGuesses}</b>`;

    //calling gameOver function if any of therse conditions meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);


    const guessesTextB = guessesText.querySelector("b");
    guessesTextB.style.color = "#ff0000"; // Force the red color



}

// Creating keyboard buttons and adding event listeners
for(let i=97; i<=122; i++) {
   const button = document.createElement("button");
   button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();

playAgainBtn.addEventListener("click", getRandomWord);