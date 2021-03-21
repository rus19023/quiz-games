// TODO:  push selected plural answers to array, then check against correct answer array?

//CONSTANTS
const CORRECT_BONUS = 1000;
const CORRECT_POINTS = 100;
var MAX_QUESTIONS = 40;
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const hud = document.getElementById('hud');
const game = document.getElementById('game');
const nextButton = document.getElementById('next-button');
const bonus = document.getElementById('bonus-text');

var currentQuestion = {};
var acceptingAnswers = false;
var score = 0;
var questionCounter = 0;
var availableQuestions = [];
var bonusText = "Go get your name on the leaderboard!";
var bonusesReached = 1;
var numAnswers = 0;
// my added variables for bonus and grade score
//let totalCorrect = 0;
var consecutiveCorrect = 0;
var lastCorrect = false;
var jsonFile = document.getElementById('chooseGame').value;
var easyMode = false;

startGame = () => {
    jsonFile = document.getElementById('chooseGame').selected;    
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    var totalQuestions = availableQuestions.length;
    if (totalQuestions < MAX_QUESTIONS) {
        MAX_QUESTIONS = totalQuestions;
    }
    
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');           
    explanation.classList.add('hidden');
    //localStorage.clear();
};
var questions = [];
fetch(jsonFile)
//fetch('https://opentdb.com/api.php?amount=10&type=boolean')
//fetch('https://rus19023.github.io/flashcards/questions.json')
//fetch( 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple' )
//fetch('https://opentdb.com/api.php?amount=10&category=17&difficulty=medium')
    .then((res) => {
        // console.log(res);
        if (!res.ok) {
            //throw new Error("HTTP error " + response.status);
            console.error(err);
        }
        //console.log('res.data: ' + res);
        jsonFile = document.getElementById('chooseGame').selected;
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.data.map((loadedQuestion) => {            
            const formattedQuestion = {
                question: loadedQuestion.question + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(From Section " + loadedQuestion.section + ", Question # " + loadedQuestion.qnum +")",
                explanation: loadedQuestion.explanation,
                exam: loadedQuestion.difficulty,
                quiz: loadedQuestion.type,
                week: loadedQuestion.category,
                section: loadedQuestion.section,
                correct: loadedQuestion.correct_answer,
                qnum: loadedQuestion.qnum  
            };
            setEasyMode = () => {      
                explanation.innerHTML = "<br>Explanation: " + currentQuestion.explanation;      
                explanation.classList.remove('hidden');
                easyMode = true;
                //console.log(easyMode);
            }

            /*
            selectGame = () => {
                //debugger;            
                jsonFile = document.getElementById('chooseGame').selected;
            }  
            */          
            
            // set variable for correct answer
            correctAnswer = loadedQuestion.correct_answer;
            //  console.log("correctAnswer " + correctAnswer);
            //questions = loadedQuestions;
            console.log("questions.length: "+ questions.length);
            const answerChoices = [...loadedQuestion.incorrect_answers];
            if (correctAnswer.includes('True') || correctAnswer.includes('False')) {
                numAnswers = 2;
            } else {
                numAnswers = answerChoices.length + 1;
            }
            console.log("answerChoices.length: "+ answerChoices.length);
            formattedQuestion.answer = Math.floor(Math.random() * numAnswers) + 1;
            // mix correct answers up randomly with incorrect answers
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
        //console.log('gameChoice ' + gameChoice);
        //selectGame();
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

    getNewQuestion = () => {           
        explanation.classList.add('hidden');
        // if number of questions is maxed out, save score and end game
        if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
            localStorage.setItem('mostRecentScore', score);
            //console.log("mostRecentScore: " + score);
            //go to the end page
            return window.location.assign('end.html');
        }
        nextButton.classList.add('hidden');
        questionCounter++;
        progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
        //Update the progress bar
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
        // Randomly choose one of the questions left in the list
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];

        question.innerHTML = currentQuestion.question;
        choices.forEach((choice) => {
            // randomize possible answers
            const number = choice.dataset['number'];
            // display the possible answers
            choice.innerHTML = currentQuestion['choice' + number];
        });
        // remove the question just displayed from the list
        availableQuestions.splice(questionIndex, 1);
        acceptingAnswers = true; 
    };  // end of get new question
 
//debugger;
// process answer choice that was clicked
choices.forEach((choice) => {
    console.log('choice: ' + choice);
    choice.addEventListener('click', (e) => {
        choice.classList.remove('correct');
        choice.classList.remove('incorrect');
        if (!acceptingAnswers) return;
            // answer was clicked on, don't allow any more clicks
            acceptingAnswers = false;
            // set variable for chosen answer
            const selectedChoice = e.target;
            // set variable for index of chosen answer
            const selectedAnswer = selectedChoice.dataset['number'];
            // set styling to chosen answer, either correct or incorrect
            const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
            // if answer is correct
        if (classToApply === 'correct') {
            // set last-answer-correct variable to true so it can be counted for consecutive bonus
            lastCorrect = true;
            // add this correct answer to consecutive total
            if (lastCorrect) {
                consecutiveCorrect ++;
                // add points for correct answer
                incrementScore(CORRECT_POINTS);                
                // bonuses for consecutive correct answers!
                // start feedback selection, show bonus text to give feedback when consecutive count is multiple of 4
                switch (consecutiveCorrect > 0 && consecutiveCorrect % 4) {
                    case 0:
                        bonusText = "You did it!!!  You got the bonus!";
                        //incrementScore(CORRECT_BONUS * 4);                    
                        incrementScore(CORRECT_BONUS * 5 * bonusesReached);
                        bonusesReached++;
                        break;
                    case 1:
                        bonusText = "Great start!  Only 3 more to go for your next bonus!";
                        break;
                    case 2:
                        bonusText = "You're getting there! Only 2 more to go for your next bonus!";
                        break;
                    case 3:
                        bonusText = "You got this!  Only 1 more to go for your next bonus!";
                        break;
                    default:
                        bonusText = "You'll get that bonus yet! Keep going!";
                        break;
                } // end feedback switch
            }  //  end of if lastcorrect
        } else {  // if answer not correct 
            // show explanation to learn correct answer
            explanation.innerHTML = "<br>Explanation: " + currentQuestion.explanation;           
            explanation.classList.remove('hidden');
            // set number of consecutive correct answers back to zero
            consecutiveCorrect = 0;
            bonusText = "Uh Oh, starting over! Don't give up, try again!";
            // set last answer correct to false so it won't be counted for consecutive bonus
            lastCorrect = false;
        }  //  end of if answer is correct
        if (consecutiveCorrect === 0) {
        }
        bonus.innerText = bonusText;
        console.log(" questionCounter: " + questionCounter + '  consecutiveCorrect: ' + consecutiveCorrect );
        
        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout(() => {
            // remove red or green color
            selectedChoice.parentElement.classList.remove(classToApply);
        }, 2500);
        
        nextButton.classList.remove('hidden');
        
        //return window.location.assign('#next-button');        
    });  // end choice event listener
});  // end fetch

incrementScore = (num) => {
    // if hint is used, no score added
    if (!easyMode) {
        score += num;
    }
    easyMode = false;
    scoreText.innerText = score;
};
