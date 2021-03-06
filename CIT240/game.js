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
//let answers = 0;

// my added variables for bonus and grade score
//let totalCorrect = 0;
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

        //console.log('res.results.type: ' + res);
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };
            
            //console.log('question-type: ' + formattedQuestion[0].type);
            //console.log('loadedQuestions: ' + loadedQuestions);
            questions = loadedQuestions;
            //console.log('formattedQuestion.results.type: ' + formattedQuestion.results.type);

            const answerChoices = [...loadedQuestion.incorrect_answers];
            

            /*
            // get # of answers from questions.type, 2 if true/false, 4 if multiple.
            questionType = question.type; 
            console.log('questionType: ' + questionType);
            //console.log('answers = ' + answers);       
            
            if (questionType === 'boolean') {
                answers = 2;
            } else {
                answers = 4;
            }
            */
           
            formattedQuestion.answer = Math.floor(Math.random() * 2) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });
            //console.log('formattedQuestion: ' + formattedQuestion.answer);
            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
     });

//CONSTANTS
const CORRECT_BONUS = 100;
const CORRECT_POINTS = 10;
const MAX_QUESTIONS = 30;

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
        // if answer is correct
        if (classToApply === 'correct') {
            //debugger;
            // set last answer correct to true so it can be counted for consecutive bonus
            lastCorrect = true;
            // add this correct answer to consecutive total
            if (lastCorrect) {
                consecutiveCorrect ++;
                //console.log('consecutiveCorrect: ' + consecutiveCorrect);

                // add points for correct answer
                incrementScore(CORRECT_POINTS);
                
                // bonuses for consecutive correct answers!
                switch (consecutiveCorrect) {
                    case 3:
                        incrementScore(CORRECT_BONUS);
                        console.log('1st level bonus level consecutive questions answered correctly, add bonus')
                        break;
                    case 10:
                        incrementScore(CORRECT_BONUS * 3);
                        break;
                    case 15:
                        incrementScore(CORRECT_BONUS * 4);
                        break;
                    case 20:
                        incrementScore(CORRECT_BONUS * 5);
                        break;
                    case 25:
                        incrementScore(CORRECT_BONUS * 10);
                        break;
                    default:
                        break;
                }
            } else {
                consecutiveCorrect = 0;
            }
        }
        console.log(" questionCounter: " + questionCounter + '  consecutiveCorrect: ' + consecutiveCorrect );
        //grade = totalCorrect/questionCounter;
        //incrementScore(grade);

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 100);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
