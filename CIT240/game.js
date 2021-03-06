// TODO:  allow and check for number of correct answers to be selected
// TODO:  push selected plural answers to array, then check against correct answer array?
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const hud = document.getElementById('hud');
const game = document.getElementById('game');
const nextButton = document.getElementById('next-button');
var jsonFile = document.getElementById('chooseGame').value;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let bonusText = "Go get your name on the leaderboard!";
let bonus = document.getElementById('bonus-text');
let bonusesReached = 1;
let numAnswers = 0;
// my added variables for bonus and grade score
//let totalCorrect = 0;
let consecutiveCorrect = 0;
let lastCorrect = false;
let jsonFile = document.getElementById('chooseGame').value;
//CONSTANTS
const CORRECT_BONUS = 100;
const CORRECT_POINTS = 10;
const MAX_QUESTIONS = 40;

startGame = () => {
    selectGame();
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    //localStorage.clear();
};
//debugger;

let questions = [];

selectGame = () => {
    //debugger;
    jsonFile = document.getElementById('chooseGame').value;
}
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
        return res.json();
    })
    .then((loadedQuestions) => {
        /*function getResult(filterBy, objList) {
            return objList.type.filter(function(obj) {
                return obj.queries.some(function(item) {
                    return item.indexOf(filterBy) >= 0;
                });
           });
        }
        getResult(gameChoice, loadedQuestions);*/
        questions = loadedQuestions.data.map((loadedQuestion) => { 
            /*loadedQuestions.results.filter(function (a) {
                return a.type.includes(gameChoice);
            });  */                         
            //console.log("filtered: " + JSON.stringify(filtered));
            
               // if (gameChoice.lower().includes('exam')) {
                 //   if ( gameChoice.lower().includes('exam2') {
                        const formattedQuestion = {
                            question: loadedQuestion.question + " <br><br> (From Section " + loadedQuestion.section + " Question # " + loadedQuestion.qnum +")",
                            explanation: loadedQuestion.explanation,
                            exam: loadedQuestion.difficulty,
                            quiz: loadedQuestion.type,
                            week: loadedQuestion.category,
                            section: loadedQuestion.section,
                            correct: loadedQuestion.correct_answer,
                            qnum: loadedQuestion.qnum  
                        };
                  //  }
                //}               
          
            //loadedQuestions.results.filter(a => a.type === "QUIZ4");
            /*Object.filter = (obj, predicate) => 
                Object.assign(...Object.keys(obj)
                    .filter( key => predicate(obj[key]) )
                    .map( key => ({ [key]: obj[key] }) ) );
            var filtered = Object.filter(loadedQuestions, type => type.includes(gameChoice)); 
            console.log(filtered);*/

            /* const filteredByKey = Object.fromEntries(
                Object.entries(loadedQuestions).filter(([key, gameChoice]) => key === 'type') )
            console.log('filteredByKey: ' + JSON.stringify(filteredByKey)); */

            //console.log(Object.values(questions).filter(result => result.type.includes(gameChoice)));
            //console.log("formattedQuestion: " + JSON.stringify(formattedQuestion));
            // use the question if the category is correct
            
            // set variable for correct answer
            correctAnswer = loadedQuestion.correct_answer;
            //  console.log("correctAnswer " + correctAnswer);
            if (loadedQuestion.correct_answer.includes('True') || correctAnswer.includes('False')) {
                numAnswers = 2;
            } else {
                numAnswers = 4;
            }
            questions = loadedQuestions;
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * numAnswers) + 1;
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
    // if number of questions is maxed out, save score and end game
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
    // Randomly choose one of the questions left in the list
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    //console.log("currentQuestion.quiz: " + currentQuestion.quiz.trim());
    //console.log("gameChoice: " + gameChoice.trim());
    // if question category != gameChoice, skip this question, else display it
    //console.log("currentQuestion.quiz.includes(gameChoice) " + currentQuestion.quiz.includes(gameChoice));
    // if question not in correct category
        // Display the question
        //console.log("finally, I get this part!");
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
}; 
// process answer choice click
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
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
            // set last answer correct variable to true so it can be counted for consecutive bonus
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
                    case 2:
                        bonusText = "Great start!  Only 3 more to go for your next bonus!";
                        break;
                    case 3:
                        bonusText = "You're getting there! Only 2 more to go for your next bonus!";
                        break;
                    case 4:
                        bonusText = "You got this!  Only 1 more to go for your next bonus!";
                        break;
                    default:
                        bonusText = "You'll get that bonus yet! Keep going!";
                        break;
                } // end feedback switch            
            explanation.innerHTML = "";    
            }  //  end of if lastcorrect
        } else {  // if correct
            explanation.innerHTML = "<br>Explanation: " + currentQuestion.explanation;
            // set number of consecutive correct answers back to zero
            consecutiveCorrect = 0;
            // set last answer correct to false so it won't be counted for consecutive bonus
            lastCorrect = false;
        }
        if (consecutiveCorrect === 0) {
            bonusText = "Uh Oh, starting over! Don't give up, try again!";
        }
        bonus.innerText = bonusText;
        console.log(" questionCounter: " + questionCounter + '  consecutiveCorrect: ' + consecutiveCorrect );
        //grade = totalCorrect/questionCounter;
        //incrementScore(grade);
        //debugger;
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            // remove red or green color
            selectedChoice.parentElement.classList.remove(classToApply);
        }, 1200);
        nextButton.classList.remove('hidden');
        //return window.location.assign('#next-button');        
    });
});  // end 

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
