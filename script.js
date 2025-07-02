// Quiz logic for Japanese Verb Conjugation Quiz

let mode = "jp-en"; // "jp-en" or "en-jp"
let includeAnime = true;
let currentGroupIndex = 0;
let currentQuestionIndex = 0;
let questions = [];
let score = 0;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const modeSelect = document.getElementById("mode-select");
const groupSelect = document.getElementById("group-select");
const animeToggle = document.getElementById("anime-toggle");

const startQuizBtn = document.getElementById("start-quiz");
const openCheatsheetBtn = document.getElementById("open-cheatsheet");

const groupNameElem = document.getElementById("group-name");
const progressElem = document.getElementById("progress");
const scoreElem = document.getElementById("score");

const questionElem = document.getElementById("question");
const optionsElem = document.getElementById("options");
const feedbackElem = document.getElementById("feedback");

const nextQuestionBtn = document.getElementById("next-question");
const quitQuizBtn = document.getElementById("quit-quiz");

const finalScoreElem = document.getElementById("final-score");
const restartQuizBtn = document.getElementById("restart-quiz");
const backToStartBtn = document.getElementById("back-to-start");

function shuffleArray(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function populateGroupSelect() {
  groupSelect.innerHTML = "";
  conjugationGroups.forEach((group, index) => {
    if (!includeAnime && group.isAnime) return;
    const option = document.createElement("option");
    option.value = index;
    option.textContent = group.groupName;
    groupSelect.appendChild(option);
  });
}

function buildQuestions() {
  questions = [];
  const group = conjugationGroups[currentGroupIndex];
  if (!group) return;

  group.conjugations.forEach((item) => {
    if (!includeAnime && group.isAnime) return;
    if (mode === "jp-en") {
      questions.push({
        question: item.jp,
        answer: item.en,
      });
    } else {
      questions.push({
        question: item.en,
        answer: item.jp,
      });
    }
  });

  shuffleArray(questions);
}

function showStartScreen() {
  startScreen.classList.remove("hidden");
  quizScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");
  feedbackElem.textContent = "";
  nextQuestionBtn.disabled = true;
}

function showQuizScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  resultsScreen.classList.add("hidden");
  feedbackElem.textContent = "";
  nextQuestionBtn.disabled = true;
}

function showResultsScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");
  finalScoreElem.textContent = `You scored ${score} out of ${questions.length}`;
}

function displayQuestion() {
  const current = questions[currentQuestionIndex];
  if (!current) return;

  groupNameElem.textContent = conjugationGroups[currentGroupIndex].groupName;
  progressElem.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
  scoreElem.textContent = `Score: ${score}`;

  questionElem.textContent = current.question;
  optionsElem.innerHTML = "";

  // Build choices with 3 wrong + 1 correct answer randomly placed
  const answersPool = conjugationGroups.flatMap(g => g.conjugations);
  let choices = [current.answer];
  while (choices.length < 4) {
    const randomItem = answersPool[Math.floor(Math.random() * answersPool.length)];
    const choice = mode === "jp-en" ? randomItem.en : randomItem.jp;
    if (!choices.includes(choice)) choices.push(choice);
  }
  shuffleArray(choices);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(btn, current.answer);
    optionsElem.appendChild(btn);
  });

  feedbackElem.textContent = "";
  nextQuestionBtn.disabled = true;
}

function selectAnswer(button, correctAnswer) {
  const buttons = optionsElem.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);

  if (button.textContent === correctAnswer) {
    button.classList.add("correct");
    feedbackElem.textContent = "Correct!";
    score++;
  } else {
    button.classList.add("incorrect");
    feedbackElem.textContent = `Oops! The correct answer was: ${correctAnswer}`;
    // Highlight correct answer button
    buttons.forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }
  nextQuestionBtn.disabled = false;
}

startQuizBtn.addEventListener("click", () => {
  mode = modeSelect.value;
  includeAnime = animeToggle.checked;
  currentGroupIndex = parseInt(groupSelect.value);
  score = 0;
  currentQuestionIndex = 0;

  buildQuestions();
  if (questions.length === 0) {
    alert("No questions available for this group with current settings.");
    return;
  }
  showQuizScreen();
  displayQuestion();
});

nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    showResultsScreen();
  } else {
    displayQuestion();
  }
});

quitQuizBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to quit the quiz?")) {
    showStartScreen();
  }
});

restartQuizBtn.addEventListener("click", () => {
  score = 0;
  currentQuestionIndex = 0;
  buildQuestions();
  showQuizScreen();
  displayQuestion();
});

backToStartBtn.addEventListener("click", () => {
  showStartScreen();
});

openCheatsheetBtn.addEventListener("click", () => {
  window.open("cheatsheet.html", "_blank");
});

// Update groups dropdown when anime toggle or mode changes
animeToggle.addEventListener("change", () => {
  includeAnime = animeToggle.checked;
  populateGroupSelect();
});
modeSelect.addEventListener("change", () => {
  // no action needed here currently
});

// Initialize page
populateGroupSelect();
showStartScreen();
