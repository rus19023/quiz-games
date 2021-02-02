const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
console.log("end.js line 5, mostRecentScore: " + mostRecentScore);

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
console.log("highScores: " + highScores);

const MAX_HIGH_SCORES = 10;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    //debugger;
    console.log("end.js line 24, score: " + score);
    highScores.push(score);
    console.log("end.js line 26, highScores: " + highScores);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('index.html');
};
