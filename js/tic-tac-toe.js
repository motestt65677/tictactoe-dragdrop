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

	// Allow multiple draggable items
	let dragSources = document.querySelectorAll('[draggable="true"]')
	dragSources.forEach(dragSource => {
		dragSource.addEventListener('dragstart', dragStart);
		dragSource.addEventListener('dragend', dragEnd);
	})

	function dragStart (e) {
		this.classList.add('dragging');
		e.dataTransfer.setData('text/plain', e.target.id);
	}
	function dragEnd (e) {
		this.classList.remove('dragging');
	}

	// Allow multiple dropped targets
	let dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]')
	dropTargets.forEach(dropTarget => {
		var mask = findFirstChildWithClass(dropTarget, "mask");
		if(mask){
			mask.addEventListener('dragenter', dragEnter);
			mask.addEventListener('dragover', cancelDefault);
			mask.addEventListener('dragleave', dragLeft);
		}
		dropTarget.addEventListener('dragenter', cancelDefault);
		dropTarget.addEventListener('dragover', cancelDefault);
		dropTarget.addEventListener('dragleave', cancelDefault);
		dropTarget.addEventListener('drop', dropped);

	})

	function findFirstChildWithClass(parentNode, className){
		for(var i=0; i< parentNode.children.length; i++){
			var child = parentNode.children[i];
			if(child.classList.contains(className))
				return child;
		}
	}

	function dragEnter(e){
		e.preventDefault();
		e.stopPropagation();
		e.target.classList.add("hovered");

	}
	function dragLeft(e){
		e.preventDefault();
		e.stopPropagation();
		e.target.classList.remove("hovered");

	}
	// function dragOver(e){

	// }
	function dropped (e) {
		e.preventDefault();
		let drag_drop_container;
		e.target.classList.remove("hovered");
		if(e.target.classList.contains("mask"))
			drag_drop_container = e.target.parentNode;

		let id = e.dataTransfer.getData('text');
		let dragItem = document.getElementById(id);

		// let oldCoinType = 
		if(drag_drop_container.classList.contains("play-ground")){
			let oldCoin = findFirstChildWithClass(drag_drop_container, "dot")
			if(!oldCoin){
				dragItem.setAttribute("draggable", false);
				dragItem.setAttribute("data-coin-used","1");
				drag_drop_container.appendChild(document.querySelector('#' + id));
				doubleSetUp(drag_drop_container.id);
			} else{
				//replace coin
				let newCoinType = dragItem.getAttribute("data-coin-size");
				let oldCoinType = oldCoin.getAttribute("data-coin-size");
				let oldCoinOwner = oldCoin.getAttribute("data-coin-owner");

				if(isLargerCoin(oldCoinType, newCoinType) && Number(oldCoinOwner) != playerTurn){
					drag_drop_container.removeChild(oldCoin);
					drag_drop_container.appendChild(dragItem);
					dragItem.setAttribute("data-coin-used","1");

					doubleSetUp(drag_drop_container.id);
				}
			}
		} 
		this.classList.remove('hover');
	}
	// function dragOver (e) {
	// 	this.classList.add('hover');
	// }
	function isLargerCoin(oldCoin, newCoin){
		let isLarger = false;
		switch (newCoin) {
			case 'large':
				if(oldCoin == "medium" || oldCoin == "small")
					isLarger = true;
				break;
			case 'medium':
				if(oldCoin == "small")
					isLarger = true;
				break;
			default:
				isLarger = false;
		}
		return isLarger
	}

	function dragLeave (e) {
		this.classList.remove('hover');
	}
	function cancelDefault (e) {
		e.preventDefault();
		e.stopPropagation();
		return false
	}


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

	function singleSetUp(selectDiv){
		//selectDiv = event.target.id[5];

		if(gameOver == true){
			return;
		}

		if(checkEmpty(selectDiv, player1State, botState) == true){
			return;
		}

		player1State.push(selectDiv);
		updateBotRemain();

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

	function doubleSetUp(drag_drop_container){
		selectDiv = drag_drop_container[5];

		if(gameOver == true)
			return;
		
		// if(checkEmpty(selectDiv, player1State, player2State) == true){
		// 	return;
		// }
		// console.log(player1State);
		// console.log(player2State);

		if(playerTurn == 1){
			player1State.push(selectDiv);

			//remove coin if cover by a larger piece.
			var index = player2State.indexOf(selectDiv);
			if(index > -1){
				player2State.splice(index, 1);
			}
			//event.target.style.backgroundImage = "url(images/circle.png)";
			gameState.innerHTML = "Player 2's Turn";

			playerTurn = 2;

			if(checkWin(player1State) == true){
				gameOver = true;
				gameState.innerHTML = "Player 1 Wins";
				allCoinDraggableFalse();
				return;
			}
		}else {
			player2State.push(selectDiv);

			//remove coin if cover by a larger piece.
			var index = player1State.indexOf(selectDiv);
			if(index > -1){
				player1State.splice(index, 1);
			}			
			//event.target.style.backgroundImage = "url(images/x.png)";		
			gameState.innerHTML = "Player 1's Turn";						
			playerTurn = 1;
			if(checkWin(player2State) == true){
				gameOver = true;
				gameState.innerHTML = "Player 2 Wins";
				allCoinDraggableFalse();
				return;
			}
		}

		if(checkTie(player1State, player2State) == true){
			gameState.innerHTML = "Tie Game!!";
			gameOver = true;
			return;
		}
		setCoinDraggable(playerTurn);
		
	}
	function setCoinDraggable(player){
		var allCoins = document.getElementsByClassName('dot');
		for(let i = 0; i<allCoins.length; i++){
			var coin = allCoins[i];
			var owner = coin.getAttribute("data-coin-owner");
			var isUsed = coin.getAttribute("data-coin-used");
			if(player == owner && isUsed == "0")
				coin.setAttribute("draggable", true);
			else
				coin.setAttribute("draggable", false);
		}

	}
	function allCoinDraggableFalse(){
		var allCoins = document.getElementsByClassName('dot');
		for(let i = 0; i<allCoins.length; i++){
			var coin = allCoins[i];
			coin.setAttribute("draggable", false);
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


