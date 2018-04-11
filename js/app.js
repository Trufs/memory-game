
/*
 * -----Preparing the table-----
 */
const listOfCards = ['<i class="fa fa-anchor"></i>', '<i class="fa fa-bicycle"></i>', '<i class="fa fa-bolt"></i>', '<i class="fa fa-bomb"></i>', '<i class="fa fa-cube"></i>', '<i class="fa fa-diamond"></i>', '<i class="fa fa-leaf"></i>', '<i class="fa fa-paper-plane-o"></i>'];
const doubledListOfCards = listOfCards.concat(listOfCards);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	}

	return array;
}

//Shuffle cards and lay them on the table
const cardElements = document.getElementsByClassName('card');

function shuffleCards(){
	const shuffledList = shuffle(doubledListOfCards);
	for (let i =0; i<shuffledList.length; i++) {
	    const oneCard = cardElements[i];
	    oneCard.innerHTML= shuffledList[i];
	}
}

/*
 * -----Preparing the score panel-----
 */

//Star Ranking
const starDisplay = document.querySelector('.stars');
const starWrappers = starDisplay.getElementsByTagName('li');
let rankingStars = '<i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i>';

function removeStar(moveCounter){
	if (moveCounter===10){
		starWrappers[0].remove();
		rankingStars = '<i class="fa fa-star"></i> <i class="fa fa-star"></i>';
	}
	if (moveCounter===15){
		starWrappers[1].remove();
		rankingStars = '<i class="fa fa-star"></i>';
	}
}

//Moves Counter
let moveCounter = 0;
const movesDisplay = document.querySelector('.moves');

function incrementMoves(){
	moveCounter += 1;
	movesDisplay.textContent = moveCounter;
	if (moveCounter === 10 || moveCounter === 15){
		removeStar(moveCounter);
	}
}

//Timer
/*
* Timer based on:
* Basic Count Up from Date and Time
* Author: @mrwigster / trulycode.com
*/

let timeZero, now, difference, mins, secs;

function upTime(countTo) {
	now = new Date();
	countTo = new Date(countTo);
	difference = (now-countTo);

	if (!gameIsFinished){	//now it stops counting when game is won
		mins=Math.floor(((difference%(60*60*1000*24))%(60*60*1000))/(60*1000)*1);
		secs=Math.floor((((difference%(60*60*1000*24))%(60*60*1000))%(60*1000))/1000*1);
	}

	document.getElementById('minutes').firstChild.nodeValue = mins;
	document.getElementById('seconds').firstChild.nodeValue = secs;

	clearTimeout(upTime.to);
	upTime.to=setTimeout(function(){upTime(countTo);}, 1000);
}


/*
 * -----Playing the game-----
 */

let openCards = [];
let pairCounter = 0;
let gameIsFinished = false;

//Event listeners for game functions
const start = document.querySelector('.start');
const startMsg = document.querySelector('.start-content');
const deck = document.querySelector('.deck');
startMsg.addEventListener('click', startTheGame);
deck.addEventListener('click', clickOnCards);

//Event handlers for playing the game
function startTheGame(){
	shuffleCards();
	start.classList.add('hide');
	timeZero = new Date();
	upTime(timeZero);
	gameIsFinished = false;
}

function clickOnCards(event){
	addToList(event.target);
	if(openCards[0] === openCards[1]){
		openCards.pop(event.target);
	} else {
		activeCard(event.target);
	}
}

function hideUnmatchedPair(){
	hideCards(openCards);
	incrementMoves();
}

//Other functions for playing the game

function addToList(card){
	openCards.push(card);
}

function activeCard(card){
	openCard(card);

	if (openCards.length>1){
		if (openCards[0].innerHTML === openCards[1].innerHTML){
			if(openCards[0] !== openCards[1]){  //prevents adding 'matched' class to a card with double clicking
			lockCardsOpen(openCards);
			}
		} 	else {
			deck.addEventListener('click', hideUnmatchedPair);
		}
	}
}

function openCard(card){
	card.classList.add('open','show');
}


function lockCardsOpen(listOfCards){
	for (let i =0;i<listOfCards.length;i++){
		const oneCard=listOfCards[i];
		oneCard.classList.add('match');
	}
	openCards = [];
	pairCounter += 1;
	incrementMoves();
	if (pairCounter === 8){
		gameIsWon();
	}

}

function hideCards(listOfCards){
	for (let i =0;i<listOfCards.length;i++){
		const oneCard=listOfCards[i];
		oneCard.classList.remove('show', 'open', 'match');
	}
	openCards = [];
	deck.removeEventListener('click', hideUnmatchedPair);
}


/*
 * -----Winning-----
 */

const finished = document.querySelector('.message');
const message = document.querySelector('.modal-text');
const timing = document.querySelector('.modal-time');
const ranking = document.querySelector('.ranking');

function gameIsWon(){
	gameIsFinished = true;
	finished.classList.add('modal');
	message.textContent = `You won in ${moveCounter} moves.`;
	ranking.innerHTML = `Your ranking is ${rankingStars}`;
		timing.textContent = `It took you ${mins} minutes and ${secs} seconds.`;
}


/*
 * -----Restarting-----
 */

//Event listeners for restarting
const restart = document.querySelector('.restart');
const restarto = document.querySelector('.restarto');
restart.addEventListener('click', restartFunction);
restarto.addEventListener('click', restartFunction);

//Event handler for restarting
function restartFunction(){
	gameIsFinished = true;
	moveCounter = 0;
	pairCounter = 0;
	movesDisplay.textContent = moveCounter;
	hideCards(cardElements);
	finished.classList.remove('modal');
	resetStars();
	start.classList.remove('hide');
}

//Function restarting star display
function resetStars(){
		starDisplay.innerHTML ='<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
}
