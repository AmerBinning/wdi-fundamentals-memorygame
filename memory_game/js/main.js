var cards = [
	{
		suitRank: "heartQueen",
		rank: "queen",
		suit: "hearts",
		cardImage: "memory_game/images/queen-of-hearts.png"
	},
	{
		suitRank: "diamondQueen",
		rank: "queen",
		suit: "diamonds",
		cardImage: "memory_game/images/queen-of-diamonds.png"
	},
	{
		suitRank: "heartKing",
		rank: "king",
		suit: "hearts",
		cardImage: "memory_game/images/king-of-hearts.png"
	},
	{
		suitRank: "diamondKing",
		rank: "king",
		suit: "diamonds",
		cardImage: "memory_game/images/king-of-diamonds.png"
	}

];
var cardsInPlay = [];
var gameStarted = false;
var playerScore = 0;
var boardSize = 16;
var bestRecord = 0;
var index = 0;
var timer = new stopwatch('timer');
var announceElement = document.querySelector('.announcement');
var bestRecordEle = document.querySelector('.highestRecord');


var formatT = function(num) {
	var h, m, s, ms;
	var strTime = '\'' + num + '\'';

	function pad(number, size) {
	    var s = "0000" + String(number)
	    return s.substr(s.length - size)
	}

	h = Math.floor( num / (60 * 60 * 1000) );
	m = Math.floor( num / (60 * 1000) % 60);
	s = Math.floor( num / 1000 % 60 );
	ms = num % 1000 / 10
	return pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 2)
}

var checkForMatch = function(){

	if(cardsInPlay[index+1]===undefined ||
		cardsInPlay[index+3]===undefined) {
		return;
	}

	var scoreElement = document.querySelector('.score');
	var cardElement;
	var timeOutID;
	var milSec = 500;
	var firstCardID = '[data-id=\"' + cardsInPlay[index] + '\"]';
	var secondCardID = '[data-id=\"' + cardsInPlay[index+2] + '\"]';

    if (cardsInPlay[index+1] === cardsInPlay[index+3]) {
    	announceElement.textContent = "You found a match!";
    	timeOutID = setTimeout(eraseAnnounce, milSec);
    	playerScore++;
    	scoreElement.innerHTML =  "You Score: " + playerScore;
    	index = index + 4;

    	if(playerScore*2 === boardSize) {
    		timer.stop();
    		clearTimeout(timeOutID);
    		if(timer.currentTime() < bestRecord || bestRecord === 0) {
    			bestRecord = timer.currentTime();
    			alert("New Record! " + formatT(bestRecord));
    		}
    		bestRecordEle.textContent = "Best Record: " + formatT(bestRecord);
    		announceElement.textContent = "Good Game!";
    	}
    } else {

    	announceElement.textContent = "Sorry, try again.";
    	timeOutID = setTimeout(eraseAnnounce, milSec);
    	setTimeout(faceDown, milSec, firstCardID);
    	setTimeout(faceDown, milSec, secondCardID);
    	for(var i = 0; i<4; i++) {
      		cardsInPlay.pop();
      	}
    }
    function eraseAnnounce(){
    	announceElement.textContent = " ";
    }
    function faceDown(id) {
    	cardElement = document.querySelector(id);
    	cardElement.setAttribute('src', "memory_game/images/back.png");
    }
};

var flipCard = function(){
	var cardId = this.getAttribute('data-id');
	var cardType = this.getAttribute('data-card-type');
	
	for(var i = 0; i < cardsInPlay.length; i ++) {
		if(cardId === cardsInPlay[i] || cardId === cardsInPlay[i+2]){
			return;
		}
	}
	
	cardsInPlay.push(cardId, cards[cardType].suitRank);
	this.setAttribute('src',cards[cardType].cardImage);

	checkForMatch();
};


var createBoard = function() {
	var boardElement = document.getElementById('game-board');
	var newElement;
	var randomIndex = randomInt(4);
	var j = 0;
	for (var i =0; i < boardSize; i++) {
		newElement = document.createElement('img');
		newElement.setAttribute('src',"memory_game/images/back.png");
		if(i%4 === 0) {
			randomIndex = randomInt(4);
			j = 0;
		}
		newElement.setAttribute('data-card-type', randomIndex[j]);
		newElement.setAttribute('data-id', i);
		newElement.addEventListener('click', flipCard);
		boardElement.appendChild(newElement);
		j++;
	}
};


var startGame = function() {
	if (gameStarted) {
		return;
	}
	gameStarted = true;
	timer.start();
	createBoard();
}

var resetGame = function() {
	var childs = document.getElementById('game-board').childNodes;
	var scoreElement = document.querySelector('.score');
	var k = childs.length;
	for (var i=0; i < k; i++){
		childs[0].remove();
	}
	for (var i = cardsInPlay.length - 1; i >= 0; i--) {
		cardsInPlay.pop();
	}
	index = 0 ;
	playerScore = 0;
	gameStarted = false;
	timer.reset();
	announceElement.innerHTML = " ";
	scoreElement.innerHTML =  "Your Score: " + playerScore;
};

var startButton = document.getElementById('startGame');
startButton.addEventListener('click', startGame);

var resetButton = document.getElementById('resetGame');
resetButton.addEventListener('click', resetGame);
