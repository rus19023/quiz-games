const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// my added variables for bonus and grade score
let totalCorrect = 0;
let consecutiveCorrect = 0;
let lastCorrect = false;

let questions = [];
fetch('questions.json')
//fetch('https://opentdb.com/api.php?amount=10&type=boolean')
//fetch('https://rus19023.github.io/flashcards/questions.json')
//fetch( 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple' )
//fetch('https://opentdb.com/api.php?amount=10&category=17&difficulty=medium')
    .then((res) => {
        console.log(res);
        if (!res.ok) {
            //throw new Error("HTTP error " + response.status);
            console.error(err);
        }
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            console.log(loadedQuestions);
            questions = loadedQuestions;

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    //localStorage.clear();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //console.log("mostRecentScore: " + score);
        
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

// TODO:  allow and check for number of correct answers to be selected
// TODO:  push selected plural answers to array, then check against correct answer array?
// TODO:  


choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            lastCorrect = true;  
                //incrementScore(CORRECT_BONUS);
                //console.log('lastCorrect: ' + lastCorrect);
            if (lastCorrect) {
               consecutiveCorrect ++;
               console.log('consecutiveCorrect: ' + consecutiveCorrect);        
               
               // if more than 10 correct in a row, add bonus! (testing if all 3 correct, add bonus!)
               if (consecutiveCorrect > 2) {
                totalCorrect += 100;
                consecutiveCorrect = 0;
               } 
            }          
            totalCorrect ++;
        }
        console.log("totalCorrect: " + totalCorrect + " questionCounter: " + questionCounter + '  consecutiveCorrect: ' + consecutiveCorrect );
        grade = totalCorrect/questionCounter;
        incrementScore(grade);

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 100);
    });
});

incrementScore = (num) => {
    score = (num*100).toFixed(0);
    scoreText.innerText = score;
};
