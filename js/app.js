/*
 * Create a list that holds all of your cards
 */
const listOfCards = ['<i class="fa fa-anchor"></i>', '<i class="fa fa-bicycle"></i>', '<i class="fa fa-bolt"></i>', '<i class="fa fa-bomb"></i>', '<i class="fa fa-cube"></i>', '<i class="fa fa-diamond"></i>', '<i class="fa fa-leaf"></i>', '<i class="fa fa-paper-plane-o"></i>', '<i class="fa fa-anchor"></i>', '<i class="fa fa-bicycle"></i>', '<i class="fa fa-bolt"></i>', '<i class="fa fa-bomb"></i>', '<i class="fa fa-cube"></i>', '<i class="fa fa-diamond"></i>', '<i class="fa fa-leaf"></i>', '<i class="fa fa-paper-plane-o"></i>'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const cardElements = document.getElementsByClassName('card');

function shuffleCards(){
	 const shuffledList = shuffle(listOfCards);
	 for (let i =0; i<shuffledList.length; i++) {
	 	const oneCard = cardElements[i];
		oneCard.innerHTML=shuffledList[i];
	}
}
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 	  + add star rating: starts with 3 stars, goes down after x moves

 	  + add a reset table functionality
 	  + add a timer
 	  - other problem: user should be blocked from opening third card before closing down the first two (if they're unmatched). perhaps changing dblclick to click could prevent this
 	  -
 */
shuffleCards();
let openCards = [];
let moveCounter = 0;
let pairCounter = 0;
const movesDisplay = document.querySelector('.moves');
const star = document.getElementsByClassName('fa-star');


function removeStar(moveCounter){
	if (moveCounter===10){
		star[0].remove();
	}
	if (moveCounter===15){
		star[1].remove();
	}
}

function incrementMoves(){
	moveCounter += 1;
	movesDisplay.textContent = moveCounter;

	removeStar(moveCounter);  //perhaps it would be better to check nb of moves here rather than in removeStar
}

function openCard(card){
	card.classList.add('open','show');
}

function addToList(card){
	openCards.push(card);
}

function lockCardsOpen(listOfCards){

	for (let i =0;i<listOfCards.length;i++){
		const oneCard=listOfCards[i];
		oneCard.classList.add('match');
	}

	openCards = [];

	pairCounter += 1;
	if (pairCounter === 8){
		alert(`Congrats! You won in ${moveCounter} moves.`);
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

function activeCard(card){
	openCard(card);

	if (openCards.length>1){

		if (openCards[0].innerHTML === openCards[1].innerHTML){
			if(openCards[0] !== openCards[1]){  //prevents adding 'matched' class to a card with double clicking
			lockCardsOpen(openCards);
			}
		}
		else {
			deck.addEventListener('click', hideUnmatchedPair);
		}
	}
}

const deck = document.querySelector('.deck');
deck.addEventListener('click', respondToTheClick);
const restart = document.querySelector('.restart')
restart.addEventListener('click', restartFunction);

//functions to handle Events
function respondToTheClick(event){
	addToList(event.target);
	if(openCards[0] === openCards[1]){
		openCards.pop(event.target);
	}
	else{
		activeCard(event.target);
	}
}

function hideUnmatchedPair(){
	hideCards(openCards);
	incrementMoves();
}

function restartFunction(){
	moveCounter = 0;
	pairCounter = 0;
	movesDisplay.textContent = moveCounter;
	hideCards(cardElements);
	shuffleCards();
	//TODO: reset stars
}
