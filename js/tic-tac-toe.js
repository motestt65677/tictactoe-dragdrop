	const myDivs = document.getElementsByClassName('play-ground');
	const gameState = document.querySelector('.game-state');
	const resetButton = document.querySelector('.reset');
	const singleButton = document.querySelector('.single');
	const doubleButton = document.querySelector('.double');
	let player1State = [];
	let player2State = [];
	let botState = [];

	let selectDiv = "";
	let playerTurn = 1;
	let gameOver = false;
	let gameMode = "single";

	let botRemainState = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	let botChoice = "";


	singleButton.onclick = function(){
		gameMode = "single";
		pickMode();
	}
	doubleButton.onclick = function(){
		gameMode = "double";
		pickMode();
	}


	resetButton.onclick = reset;

	function pickMode(){
		if (gameMode == "single"){
			reset();
			for(i=0; i<myDivs.length; i++){
				singleButton.style.border = "5px solid white";
				doubleButton.style.border = "";
				myDivs[i].onclick = singleSetUp; 
			}
		}else if(gameMode == "double"){
			reset();
			console.log(gameMode);
			for(i=0; i<myDivs.length; i++){
				myDivs[i].onclick = doubleSetUp; 
				doubleButton.style.border = "5px solid white";
				singleButton.style.border = "";
			}
		}
	}

	function botMove(){
		botChoice = botRemainState[Math.floor(Math.random() * (botRemainState.length))];
		selectDiv = botChoice;	

		updateBotRemain();
		// console.log(botChoice);
		// console.log(botRemainState);

		botState.push(selectDiv);
		myDivs[botChoice-1].style.backgroundImage = "url(images/x.png)";	
		gameState.innerHTML = "Player 1's Turn";						

		if(checkWin(botState) == true){
			gameOver = true;
			gameState.innerHTML = "Player 2 Wins";
			return;
		}	

		if(checkTie(player1State, botState) == true){
			gameState.innerHTML = "Tie Game!!";
			gameOver = true;
			return;
		}	
	}

	function singleSetUp(event){
		selectDiv = event.target.id[5];

		if(gameOver == true){
			return;
		}

		if(checkEmpty(selectDiv, player1State, botState) == true){
			return;
		}

		player1State.push(selectDiv);
		updateBotRemain();
		// console.log(selectDiv);
		// console.log(botRemainState);

		event.target.style.backgroundImage = "url(images/circle.png)";
		gameState.innerHTML = "Player 2's Turn";

		if(checkWin(player1State) == true){
			gameOver = true;
			gameState.innerHTML = "Player 1 Wins";
			return;
		}

		if(checkTie(player1State, botState) == true){
			gameState.innerHTML = "Tie Game!!"
			gameOver = true;
			return;
		}	

		botMove();
	}

	function doubleSetUp(event){
		selectDiv = event.target.id[5];

		if(gameOver == true){
			return;
		}

		if(checkEmpty(selectDiv, player1State, player2State) == true){
			return;
		}

		if(playerTurn == 1){
			player1State.push(selectDiv);
			event.target.style.backgroundImage = "url(images/circle.png)";
			gameState.innerHTML = "Player 2's Turn";
			playerTurn = 2;
			if(checkWin(player1State) == true){
				gameOver = true;
				gameState.innerHTML = "Player 1 Wins";
				return;
			}
		}else {
			player2State.push(selectDiv);			
			event.target.style.backgroundImage = "url(images/x.png)";		
			gameState.innerHTML = "Player 1's Turn";						
			playerTurn = 1;
			if(checkWin(player2State) == true){
				gameOver = true;
				gameState.innerHTML = "Player 2 Wins";
				return;
			}
		}

		if(checkTie(player1State, player2State) == true){
			gameState.innerHTML = "Tie Game!!";
			gameOver = true;
			return;
		}
	}

	function checkEmpty(div, player1, player2){

		if(player1.indexOf(div) > -1 || player2.indexOf(div) > -1){
			return true;	
		}
		return false;
	}

	function checkWin(player){
		if(player.indexOf('1') > -1 && player.indexOf('2') > -1 && player.indexOf('3') > -1){
			return true;
		}else if(player.indexOf('4') > -1 && player.indexOf('5') > -1 && player.indexOf('6') > -1){
			return true;
		}else if(player.indexOf('7') > -1 && player.indexOf('8') > -1 && player.indexOf('9') > -1){
			return true;
		}else if(player.indexOf('1') > -1 && player.indexOf('4') > -1 && player.indexOf('7') > -1){
			return true;
		}else if(player.indexOf('2') > -1 && player.indexOf('5') > -1 && player.indexOf('8') > -1){
			return true;
		}else if(player.indexOf('3') > -1 && player.indexOf('6') > -1 && player.indexOf('9') > -1){
			return true;
		}else if(player.indexOf('1') > -1 && player.indexOf('5') > -1 && player.indexOf('9') > -1){
			return true;
		}else if(player.indexOf('3') > -1 && player.indexOf('5') > -1 && player.indexOf('7') > -1){
			return true;
		}
		return false;
	}

	function checkTie(player1, player2){
		allState = player1.concat(player2);
		if(allState.length == 9){
			return true;
		}		
		return false;
	}

	function reset(event){
		gameState.innerHTML = "Player 1's Turn";
		gameOver = false;
		player1State = [];
		player2State = [];
		selectDiv = "";
		playerTurn = 1;

		botState = [];
		botRemainState = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
		botChoice = "";

		for (i=0; i<myDivs.length; i++){
			myDivs[i].style.backgroundImage = "";
		}
	}

	function updateBotRemain(){
		botRemainState = botRemainState.filter(function(num){
			if(selectDiv != num){
				return num;
			}
		});
	}


