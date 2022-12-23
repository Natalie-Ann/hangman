const categories = ['Animals', 'Plants', 'Places', 'Things'];
import words from "./words.js";

const hangmanImages = ['./images/hangman_head.png', './images/hangman_body.png', './images/hangman_left_arm.png', './images/hangman_right_arm.png', './images/hangman_left_leg.png', './images/hangman_right_leg.png', './images/hangman_right_eye.png', './images/hangman_left_eye.png', './images/hangman_nose.png', './images/hangman_frown.png', './images/hangman_end.png'];

let round = 0;

let startPlayingButton = document.querySelector('input[value="Start Playing!"]');
let gamePlayVisuals = document.querySelector('.game_play');
let introVisuals = document.querySelector('.intro');
let categoriesForm = document.querySelector('form');
let gameFormat = document.querySelector('.game_format');
let startGameButton = document.querySelector('#start_game');
let wordBlanksContainer = document.querySelector('.wordBlanks');
let alphabetContainer = document.querySelector('.alphabet');
let usedLetters = document.querySelector('.used_letters');
let hangmanDrawing = document.querySelector('#hangman_drawing');
let gameOverScreen = document.querySelector('.game_over_screen');
let playAgainButton = document.querySelector('#play_again');
let currentWord;
let hintButton = document.querySelector('#hintButton');
let hint = document.querySelector('#hint');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

//returns random words from categories
function randomWordSelector(category) {
    if (category) {
        let randomWordIndex = getRandomIntInclusive(0, words[category].length - 1);
        return words[category][randomWordIndex];
    } else {
        let randomCategoryIndex = getRandomIntInclusive(0, 1);
        let category = categories[randomCategoryIndex];
        let randomWordIndex = getRandomIntInclusive(0, words[category].length - 1);
        
        return words[category][randomWordIndex];
    }
}

function createAlphabetButtons() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabet.split('').forEach(letter => {
        let letterButton = document.createElement('button');
        letterButton.value = letter;
        letterButton.textContent = letter;
        alphabetContainer.append(letterButton);
    }); 
}

function createSpaces(word) {
    word.split('').forEach(letter => {
        if (letter.match(/[A-Z]/gi)) {
            let marker = document.createElement('p');
            wordBlanksContainer.append(marker);
            marker.classList.add('marker');
        } else {
            let blank = document.createElement('p');
            wordBlanksContainer.append(blank);
        }
    })
}

startGameButton.addEventListener('click', (e) => {
    introVisuals.classList.add('hidden');
    gameFormat.classList.remove('hidden');
});

categoriesForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get category from form
    let formData = new FormData(categoriesForm);
    let category = formData.get('category');

    //randomWordSelector
    //random category and random word
    //selected category and random word
    if (category === 'Surprise Me') {
        currentWord = randomWordSelector();
    } else {
        currentWord = randomWordSelector(category);
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
    .then(response => response.json())
    .then(data => {
        hint.textContent = data[0].meanings[0].definitions[0].definition;
        console.log(data[0].meanings[0].definitions[0])
    })

    createSpaces(currentWord);

    createAlphabetButtons();

    //display the hangman gallows, spaces with number of letters, hints, and alphabet
    gamePlayVisuals.classList.remove('hidden');


    //hide intro/format questions
    introVisuals.classList.add('hidden');
    gameFormat.classList.add('hidden');

});

hintButton.addEventListener('click', (e) => {
    //toggle hint button hidden
    hintButton.classList.add('hidden');
    hint.classList.remove('hidden')

    //toggle paragraph
    //replace hint button with paragraph of hint
})

//when click letter button or press letter key, check if the word contains the letter. if yes, add to textContent of spaces.  Add to used letters.
alphabetContainer.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON') {
        //get letter from button
        let currentLetter = e.target.textContent.toLowerCase();

        //check if currentWord has the letter
        if (currentWord.toLowerCase().includes(currentLetter)) {
            let indices = [];
            let currentWordArray = currentWord.toLowerCase().split('');
            let index = currentWordArray.indexOf(currentLetter);
            while (index !== -1) {
                indices.push(index);
                index = currentWordArray.indexOf(currentLetter, index + 1);
            }
            //get positions of letters in words
            //add to that position in the blank spaces
            let characterBlanks = wordBlanksContainer.querySelectorAll('p');
            indices.forEach(index => {
                characterBlanks[index].textContent = currentLetter;
                //get node in that position from wordBlanksContainer
                //update textContent with currentWord
            })
            alphabetContainer.removeChild(e.target);
            //remove/gray out that letter
            
            //if character blanks are all filled, declare winner
            if (winningGame()) {
                gameOver();
                displayWinningMessage();
                //fireworks 
                //popup winner
            }

        } else {
            let usedLetter = document.createElement('p');
            usedLetter.textContent = currentLetter.toUpperCase();
            usedLetters.append(usedLetter);
            alphabetContainer.removeChild(e.target);
            //add to used letters and remove from alphabet

            //draw hangman -- update image with head-->body-->LA-->RA-->LL-->RL
            if (round > hangmanImages.length - 1) {
                gameOver();
                displayLosingMessage();
                console.log('game over');
                // hangmanDrawing.replaceWith(playAgainButton);
                //show game over screen 
            } else {
                hangmanDrawing.setAttribute('src', `${hangmanImages[round]}`);
            }

            round += 1;

        }

    }
})

document.addEventListener('keyup', (e) => {
    validateInput(e.key);
    if (e.key.match(/[A-Z]/gi) && (e.key.length === 1)) {
        //get letter from button
        let currentLetter = e.key.toLowerCase();

        //check if currentLetter has already been used (currently in word bank)

        //check if currentWord has the letter
        if (currentWord.toLowerCase().includes(currentLetter)) {
            let indices = [];
            let currentWordArray = currentWord.toLowerCase().split('');
            let index = currentWordArray.indexOf(currentLetter);
            while (index !== -1) {
                indices.push(index);
                index = currentWordArray.indexOf(currentLetter, index + 1);
            }
            //get positions of letters in words
            //add to that position in the blank spaces
            let characterBlanks = wordBlanksContainer.querySelectorAll('p');
            indices.forEach(index => {
                characterBlanks[index].textContent = currentLetter;
                //get node in that position from wordBlanksContainer
                //update textContent with currentWord
            });
            //find child that matches that letter in alphabetContainer and remove that letter
            let currentLetterButton = alphabetContainer.querySelector(`[value="${currentLetter.toUpperCase()}"]`);
            alphabetContainer.removeChild(currentLetterButton);

            if (winningGame()) {
                gameOver();
                displayWinningMessage();
                //fireworks 
                //popup winner
            }

        } else {
            let usedLetter = document.createElement('p');
            usedLetter.textContent = currentLetter.toUpperCase();
            usedLetters.append(usedLetter);
            
            let currentLetterButton = alphabetContainer.querySelector(`[value="${currentLetter.toUpperCase()}"]`);
            if (alphabetContainer.contains(currentLetterButton)) {
                alphabetContainer.removeChild(currentLetterButton);
            }
            //add to used letters and remove from alphabet

            //draw hangman
            if (round > hangmanImages.length - 1) {
                gameOver();
                displayLosingMessage();
                //game over
            } else {
                hangmanDrawing.setAttribute('src', `${hangmanImages[round]}`);
            }

            round += 1;

        }

    }

});

playAgainButton.addEventListener('click', (e) => {
    gameFormat.classList.remove('hidden');
    gamePlayVisuals.classList.add('hidden');
    gameOverScreen.style.display = 'none';
    categoriesForm.reset();
    resetGame();
});


function resetGame() {
    //clear out children in alphabet and wordblanks
    //redraw alphabet
    //clear used letters
    let usedLettersTitle = document.getElementById('used_letters_title');
    let letterBankTitle = document.getElementById('letter_bank_title');

    wordBlanksContainer.replaceChildren();
    alphabetContainer.replaceChildren(letterBankTitle);
    usedLetters.replaceChildren(usedLettersTitle);

    hintButton.classList.remove('hidden');
    hint.classList.add('hidden')

    //reset rounds back to 0
    round = 0;

    //show start hangman image
    hangmanDrawing.setAttribute('src', './images/hangman_start.png');
    // playAgainButton.replaceWith(hangmanDrawing);

    //reset the win/lose messages
    document.getElementById('lose_message').style.display = 'block';
    document.getElementById('win_message').style.display = 'block';
}

function validateInput(keypress) {
    if ((!keypress.match(/[A-Z]/gi)) || keypress.length > 1) {
        alert('Please only use alphabetic characters.');
    }
}


function gameOver() {
    console.log('game over screen');
    gameOverScreen.style.display = 'block';
    playAgainButton.classList.remove('hidden');
    //on top of entire screen, blanket grayscreen, with play again button on top

}

function winningGame() {
    return [...wordBlanksContainer.children].every((blank, index) => currentWord.toLowerCase()[index] === blank.textContent);

    //check if all blanks are filled
    
    //show celebration fireworks
}

function displayWinningMessage() {
    document.getElementById('lose_message').style.display = 'none';

    // document.getElementById('game_over_popup').style.backgroundImage = <iframe src="https://giphy.com/embed/26tOZ42Mg6pbTUPHW" width="480" height="320" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/26tOZ42Mg6pbTUPHW">via GIPHY</a></p>;
}

function displayLosingMessage() {
    document.getElementById('win_message').style.display = 'none';
}


function updateScore() {
    //after 
}

