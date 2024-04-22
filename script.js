'use strict';

const score0Element = document.getElementById('score--0');
const score1Element = document.getElementById('score--1');
const playerZero = document.querySelector('.player--0');
const playerOne = document.querySelector('.player--1');
const playerZeroScores = document.getElementById('current--0');
const playerOneScores = document.getElementById('current--1');
const diceImg = document.querySelector('.dice');
const newGame = document.querySelector('.btn--new');
const rollDice = document.querySelector('.btn--roll');
const holdDice = document.querySelector('.btn--hold');
let scores, currentScore, activePlayer, playing;

// Function to initialize settings
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  // Playing mode on
  playing = true;
  // Starting position
  score0Element.textContent = 0;
  score1Element.textContent = 0;
  // Scores reset
  playerZeroScores.textContent = 0;
  playerOneScores.textContent = 0;
  // Image hidden
  diceImg.classList.add('hidden');
  // Remove winner class
  playerZero.classList.remove('player--winner');
  playerOne.classList.remove('player--winner');
  // Remove active classes
  playerZero.classList.add('player--active');
  playerOne.classList.remove('player--active');
};

// Function to switch player
const playerSwitching = function () {
  // Changing active player and resetting total scores to 0 if they roll 1
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  // Toggle active player class to change interface
  playerZero.classList.toggle('player--active');
  playerOne.classList.toggle('player--active');
};

// Function to load language file
function loadLanguage(lang) {
  return fetch(`${lang}.json`)
    .then(response => response.json())
    .catch(error => console.error('Error loading language file:', error));
}

// Function to replace placeholders with translated text
function translateUI(data) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.dataset.i18n;
    if (data.hasOwnProperty(key)) {
      element.textContent = data[key];
    }
  });
}

// Function to switch language
function switchLanguage(lang) {
  loadLanguage(lang)
    .then(data => {
      translateUI(data);
    })
    .catch(error => console.error('Error switching language:', error));
}

// Initial language load
switchLanguage('en');

// Event listener for language switcher
const languageSelector = document.getElementById('language-selector');
languageSelector.addEventListener('change', function() {
  const selectedLanguage = this.value;
  switchLanguage(selectedLanguage);
});

init();

rollDice.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceImg.classList.remove('hidden');
    diceImg.src = `/images/dice-${dice}.png`;
    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    } else {
      playerSwitching();
    }
  }
});

holdDice.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
    if (scores[activePlayer] >= 100) {
      playing = false;
      document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
      document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
      diceImg.classList.add('hidden');
    } else {
      playerSwitching();
    }
  }
});

newGame.addEventListener('click', init);
