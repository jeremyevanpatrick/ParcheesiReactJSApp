import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Dice extends React.Component {
  	constructor(props){
    	super(props);
  	}

  	render(){
  		const diceHtml = [];

	  	if(this.props.dice.length > 0){
	  		for(var a=0;a<this.props.dice.length;a++){
	  			
	  			var diceClass = "die die-" + this.props.dice[a].number;
	  			if(!this.props.dice[a].active){
	  				diceClass += " spentDie";
	  			}

	  			diceHtml.push(
	  				<div className={diceClass}>
	  					<span>•</span>
	  					<span>•</span>
	  					<span>•</span>
	  					<span>•</span>
	  					<span>•</span>
	  					<span>•</span>
	  					<b>10</b>
	  					<strong>20</strong>
	  				</div>
  				);
	  		}
	  	}

	  	return diceHtml;
  	}
}

class Token extends React.Component {
  	constructor(props){
    	super(props);
  	}

	handleDragStart(e){
		return false;
	}

  	render(){
		var playerClass = "token player" + this.props.player + "Token";

		let mouseDownCallback = function(){};
		let mouseUpCallback = function(){};
		if(this.props.dice.length>0 && this.props.player == this.props.turn && this.props.human == true){
			mouseDownCallback = this.props.onMouseDownMarker;
			mouseUpCallback = this.props.onMouseUpMarker;
		}

		return (
			<div
				className={playerClass}
	            draggable={false}
	            onDragStart={(e) => this.handleDragStart(e)}
	            onMouseDown={mouseDownCallback}
  				onMouseUp={mouseUpCallback}
  				tokenindex={this.props.tokenindex}
			></div>
		);
	}
}

class Space extends React.Component {
  	constructor(props){
    	super(props);
  	}

  	render(){
		var classString = "space";
		if(this.props.safe){
			classString += " safe";
		}
		if(this.props.showMoves.length > 0 && this.props.showMoves.indexOf(this.props.spaceIndex) != -1){
			classString += " highlightSpace";
		}

		return (
			<div
				positionindex={this.props.spaceIndex}
				className={classString}
			>
				{this.props.renderMarkers(this.props.spaceIndex)}
			</div>
		);
	}
}

class Quadrant extends React.Component {
  	constructor(props){
    	super(props);
  	}

  	renderMarkers(positionIndex){
    	const players = this.props.players.slice();
  		let markersToRender = getMarkersToRender(players, positionIndex);
		const tokenArray = [];
		for(var g=0;g<markersToRender.length;g++){
			tokenArray.push(
				<Token
					turn={this.props.turn}
					dice={players[this.props.turn-1].dice}
					player={markersToRender[g]}
					onMouseDownMarker={this.props.onMouseDownMarker}
      				onMouseUpMarker={this.props.onMouseUpMarker}
      				tokenindex={positionIndex}
      				human={players[this.props.turn-1].human}
				/>
			);
		}
		return tokenArray;
  	}

	renderSpaceGroup(groupType, safeIndex, spaceNumbers) {
		const spaceArray = [];
		for (let i = 0; i < 8; i++) {
			spaceArray.push(
				<Space
					spaceIndex={spaceNumbers[i]}
					safe={(i==safeIndex)}
        			showMoves={this.props.showMoves}
        			renderMarkers={(x) => this.renderMarkers(x)}
					onMouseDownMarker={this.props.onMouseDownMarker}
      				onMouseUpMarker={this.props.onMouseUpMarker}
    			/>
			);
		}

		return (
			<div className={groupType}>
				{spaceArray}
			</div>
		)
	}

	render(){
		var i = this.props.quadIndex;

		if(i % 2 == 0){
			if(i == 4){
				//Home

			  	var menuClass = "centerMenu playerTurn" + this.props.turn;
			  	
			  	const homeSpaces = [];
			  	if(this.props.gameState == 0 || this.props.gameState == 1){
				  	for(var h=0; h<this.props.players.length;h++){
				  		
				  		var classString = "playerHome playerHome";
				  		var e = this.props.players[h].enters;
				  		classString += (e==38 ? "Bottom" : (e==55 ? "Right" : (e==4 ? "Top" : "Left")));//e==21

			  			var posIndex = ((this.props.players[h].player * (-1)) - 10);

						if(this.props.showMoves.length > 0 && this.props.showMoves.indexOf(posIndex) != -1){
							classString += " highlightSpace";
						}

			  			homeSpaces.push(
			  				<div
								className={classString}
								positionindex={posIndex}
	      					>
	      						{this.renderMarkers(posIndex)}
	  						</div>
			  			);
				  	}
			  	}

			  	let mainLabelText = "";
			  	var centerBtnHtml = null;
			  	let lowerAreaHtml = null;

			  	if(this.props.gameState == -1){

			  		//pre menu
			  		menuClass += " preMenu";

			  		mainLabelText = "Parcheesi";

			  		let rollBtnClass = "disableBtn";
			  		let activePlayerCount = 0;
			  		for(var x=0; x < this.props.players.length; x++){
			  			if(this.props.players[x].human != null){
			  				activePlayerCount++;
			  			}
			  		}
			  		//only start game if there are at least 2 players
			  		if(activePlayerCount > 1){
			  			rollBtnClass = "";
			  		}

			  		centerBtnHtml = (
			  			<div
							id="rollBtn"
							className={rollBtnClass}
							onClick={this.props.onClickStartGame}
						>
							Start Game
						</div>
			  		);
					
					const playerTrHtml = [];
			  		for(let a=1; a<=4;a++){
			  			
			  			let pId = "p_" + a;
			  			let cpu = "cpu_" + a;
			  			let off = "off_" + a;
			  			let pc = "pc_" + a;
						
						let checked1 = "";
			  			let checked2 = "";
			  			let checked3 = "";

			  			if(this.props.players[a-1].human == null){
			  				checked1 = "checked";
			  			}else if(!this.props.players[a-1].human){
			  				checked2 = "checked";
			  			}else if(this.props.players[a-1].human){
			  				checked3 = "checked";
			  			}

			  			playerTrHtml.push(
							<tr>
								<td>Player {a}</td>
								<td>
									<div className="switch-toggle switch-3 switch-candy">
										<input id={pId} name={pc} type="radio" defaultChecked={checked3} onChange={this.props.onChangeConfigurePlayer} />
										<label htmlFor={pId}>
											P{a}
										</label>
										<input id={cpu} name={pc} type="radio" defaultChecked={checked2} onChange={this.props.onChangeConfigurePlayer} />
										<label htmlFor={cpu}>
											CPU
										</label>
										<input id={off} name={pc} type="radio" defaultChecked={checked1} onChange={this.props.onChangeConfigurePlayer} />
										<label htmlFor={off}>
											OFF
										</label>
									</div>
								</td>
							</tr>
		  				);
			  		}

					lowerAreaHtml = (
						<table>
							<tbody>
								{playerTrHtml}
							</tbody>
						</table>
					);

			  	}else if(this.props.gameState == 0){

			  		//game is started
			  		mainLabelText = "Player " + this.props.turn;

					let dice = this.props.players[this.props.turn-1].dice;
				  	let rollBtnClass = (this.props.players[this.props.turn-1].human != true || (dice.length > 0 && (dice[0].active || dice[1].active))) ? "disableBtn" : "";

				  	if(this.props.turnComplete){
				  		centerBtnHtml = (
				  			<div
								id="rollBtn"
								className={rollBtnClass}
								onClick={this.props.onClickEndTurn}
							>
								End Turn
							</div>
				  		);
				  	}else{
				  		centerBtnHtml = (
				  			<div
								id="rollBtn"
								className={rollBtnClass}
								onClick={this.props.onClickRollDice}
							>
								Roll Dice
							</div>
				  		);
				  	}

				  	lowerAreaHtml = (
						<Dice dice={dice} />
			  		);

			  	}else if(this.props.gameState == 1){
			  		
			  		//game is completed
			  		mainLabelText = <div>Game<br/>Completed</div>;
			  		
			  	}

				return (
					<div className="quadrant home">
    					{homeSpaces}
    					<div className="innerHome">
	    					<div className={menuClass}>
	    						<div className="playerTurn">
	    							{mainLabelText}
	    						</div>
	    						<div className="btnArea">
									{centerBtnHtml}
								</div>
								<div className="diceArea">
									{lowerAreaHtml}
								</div>
							</div>
						</div>
    				</div>
				);
			}else{
				
				//Start
				let playerStartClass = "outerCircle player" + this.props.player + "Start";
				let playerStartLabel = (this.props.players[this.props.player-1].human != null && (this.props.gameState == 0 || this.props.gameState == 1)) ? "Player " + this.props.player : "";
				let positionIndex = this.props.player * (-1);

				let markersHtml = null;
				if(this.props.gameState == 0 || this.props.gameState == 1){
					markersHtml = this.renderMarkers(positionIndex);
				}

				return (
					<div className="quadrant start">
						<span className={playerStartClass}>
							<span className="innerCircle">
								<div className="startName">{playerStartLabel}</div>
								<div
									className="startPosition"
        							positionindex={positionIndex}
								>
									{markersHtml}
								</div>
							</span>
						</span>
					</div>
				);
			}
		}else{
			//Spaces
		  	var groupType = (i==1||i==7) ? "file-v" : "row-h";
		  	var a = (i==1||i==3);//4-0-4

		  	var spaceNumbers1 = new Array(8);
		  	var spaceNumbers2 = new Array(8);
		  	var spaceNumbers3 = new Array(8);
		  	if(i==1){
		  		//top
		  		spaceNumbers1 = [0,1,2,3,4,5,6,7];
		  		spaceNumbers2 = [67,167,267,367,467,567,667,767];
		  		spaceNumbers3 = [66,65,64,63,62,61,60,59];
		  	}else if(i==3){
		  		//left
		  		spaceNumbers1 = [15,14,13,12,11,10,9,8];
		  		spaceNumbers2 = [16,116,216,316,416,516,616,716];
		  		spaceNumbers3 = [17,18,19,20,21,22,23,24];
		  	}else if(i==5){
		  		//right
		  		spaceNumbers1 = [58,57,56,55,54,53,52,51];
		  		spaceNumbers2 = [750,650,550,450,350,250,150,50];
		  		spaceNumbers3 = [42,43,44,45,46,47,48,49];
		  	}else if(i==7){
		  		//bottom
		  		spaceNumbers1 = [25,26,27,28,29,30,31,32];
		  		spaceNumbers2 = [733,633,533,433,333,233,133,33];
		  		spaceNumbers3 = [41,40,39,38,37,36,35,34];
		  	}

		  	return (
		  		<div className="quadrant">
		        	{this.renderSpaceGroup(groupType,a?4:3,spaceNumbers1)}
		        	{this.renderSpaceGroup(groupType+" ramp",a?0:7,spaceNumbers2)}
		        	{this.renderSpaceGroup(groupType,a?4:3,spaceNumbers3)}
		        </div>
			);
		}
	}
}

class Board extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
  	const quadArray = [];
	for (let i = 0; i < 3; i++) {
  		const boardRow = [];
		for (let j = 0 + (3*i); j < 3 + (3*i); j++) {
			boardRow.push(
				<Quadrant
					gameState={this.props.gameState}
					turn={this.props.turn}
					quadIndex={j}
					player={j==0?3:(j==2)?2:(j==6)?4:1}
					onClickRollDice={this.props.onClickRollDice}
					onMouseDownMarker={this.props.onMouseDownMarker}
	          		onMouseUpMarker={this.props.onMouseUpMarker}
	          		onChangeConfigurePlayer={this.props.onChangeConfigurePlayer}
	          		onClickStartGame={this.props.onClickStartGame}
					onClickEndTurn={this.props.onClickEndTurn}
					turnComplete={this.props.turnComplete}
					showMoves={this.props.showMoves}
					players={this.props.players}
				/>
			);
		}
		quadArray.push(<div className="boardRow">{boardRow}</div>);
	}

    return (
	  <div id="board">
	  	{quadArray}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    	gameState: -1,//-1=premenu; 0=started; 1=completed;
    	turn: 1,
    	turnComplete: false,
    	doubles: 0,
    	showMoves: [],
    	players: [
    		{
    			human: true,
    			player: 1,
    			enters: 38,
    			markers: [-1,-1,-1,-1],
    			dice: [],
    			finished: false,
    			blockades: []
    		},
    		{
    			human: false,
    			player: 2,
    			enters: 55,
    			markers: [-2,-2,-2,-2],
    			dice: [],
    			finished: false,
    			blockades: []
    		},
    		{
    			human: false,
    			player: 3,
    			enters: 4,
    			markers: [-3,-3,-3,-3],
    			dice: [],
    			finished: false,
    			blockades: []
    		},
    		{
    			human: false,
    			player: 4,
    			enters: 21,
    			markers: [-4,-4,-4,-4],
    			dice: [],
    			finished: false,
    			blockades: []
    		}
    	]
    };

    this.moveMarker = function(start, end){
		//update data model
	  	const players = this.state.players.slice();
	  	for(var p=0; p<players.length; p++){
	  		for(var r=0; r<players[p].markers.length; r++){
	  			if(players[p].markers[r] == start){
	  				players[p].markers[r] = end;
	  				break;
	  			}
	  		}
	  	}

		this.setState({
			players: players
		});

    };

    this.addBonusMove = function(distance){
	  	const players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

    	players[turn-1].dice.push({
			number: distance,
			active: true
		});

		this.setState({
			players: players
		});

    };

    this.rollDice = function(callback){

	  	const players = this.state.players.slice();
	  	const turn = Object.assign(this.state.turn);
	  	let player = players[turn-1];

	  	let anyActiveDice = false;
	  	for(var a=0; a<player.dice.length; a++){
	  		if(player.dice[a].active){
	  			anyActiveDice = true;
	  		}
	  	}

	  	if(player.dice.length == 0 || (!anyActiveDice && this.state.doubles > 0)){
	  		player.dice = [
	  			{
	  				number: Math.floor(Math.random() * 6) + 1,
	  				active: true
	  			},
	  			{
	  				number: Math.floor(Math.random() * 6) + 1,
	  				active: true
	  			}
	  		];

	  		//render dice roll before proceeding
	  		this.setState({
	  			players: players
	  		}, function(){

	  			var isThreeDoubles = false;

		  		//check for 3 doubles
		  		var doubles = Object.assign(this.state.doubles);
		  		if(player.dice[0].number == player.dice[1].number){
		  			if(doubles == 2){
		  				//move furthest marker back to Start
		  				var mPos = getMostAdvancedPosition(player);
		  				if(mPos != null){

		  					this.moveMarker(mPos, (player.player * (-1)));

						}

		  				doubles = 0;
		  				isThreeDoubles = true;

		  			}else{
		  				doubles++;
		  			}
		  		}else{
		  			doubles = 0;
		  		}

		  		this.setState({
		  			doubles: doubles
		  		});

			  	if(isThreeDoubles || (!hasAnyValidMoves(players, turn) && player.dice[0].number != player.dice[1].number)){
			  		
			  		//no valid moves, show end turn button
				  	this.disableAllDice();
			  		this.setState({
			  			turnComplete: true
			  		});

			  	}else if(!hasAnyValidMoves(players, turn) && player.dice[0].number == player.dice[1].number){
			  		
			  		//no valid moves on a double, set both dice to disabled without ending turn
				  	this.disableAllDice();

			  	}

			  	//otherwise, wait for next valid move

	  			callback();

	  		}.bind(this));

	  	}else{
	  		callback();
	  	}
  		
    };

    this.disableAllDice = function(){
	  	const players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

		players[turn-1].dice[0].active = false;
	  	players[turn-1].dice[1].active = false;

		//if there is a bonus die
		if(typeof players[turn-1].dice[2] != "undefined"){
			players[turn-1].dice[2].active = false;
		}
		if(typeof players[turn-1].dice[3] != "undefined"){
			players[turn-1].dice[3].active = false;
		}

		this.setState({
			players: players
		});

    };

    this.manageBlockades = function(){

    	const players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

	  	//manage blockades
  		var processedBlockades = [];
		var x = players[turn-1].markers.length;
		while (x--) {

			var y = players[turn-1].markers.length;
			while (y--) {
	  			//if two different markers are on the same space, but not Start or Home
			    if( x!=y &&
			    	[-1,-2,-3,-4,-11,-12,-13,-14].indexOf(players[turn-1].markers[x]) == -1 &&
	  				players[turn-1].markers[x] == players[turn-1].markers[y] &&
	  				processedBlockades.indexOf(players[turn-1].markers[x]) == -1
				){
					//check if the current blockade already exists in the list from the previous turn
					var existingBlockadeIndex = null;
					var z = players[turn-1].blockades.length;
					while (z--) {
						if(players[turn-1].blockades[z].position == players[turn-1].markers[x]){
							existingBlockadeIndex = z;
						}
					}

					if(existingBlockadeIndex != null){
						players[turn-1].blockades[existingBlockadeIndex].duration += 1;
					}else{
						players[turn-1].blockades.push({
							position: players[turn-1].markers[x],
	  						duration: 1
						});
					}

					//add to temp list so it is not processed twice
	  				processedBlockades.push(players[turn-1].markers[x]);
	  			}
	  		}

		}

	  	//remove blockades that no longer exist
		var x = players[turn-1].blockades.length;
		while (x--) {
			
			var stillExists = false;
			var y = processedBlockades.length;
			while (y--) {
				if(processedBlockades[y] == players[turn-1].blockades[x].position){
					stillExists = true;
				}
			}

			if(!stillExists){
				players[turn-1].blockades.splice(x, 1);
			}

		}

	  	//blockade not broken after 3 turns
		var x = players[turn-1].blockades.length;
		while (x--) {
			if(players[turn-1].blockades[x].duration > 3){
				
				//move 1 of the markers back to Start
	  			var start = players[turn-1].blockades[x].position;
	  			var end = (players[turn-1].player * (-1));

		  		for(var r=0; r<players[turn-1].markers.length; r++){
		  			if(players[turn-1].markers[r] == start){
		  				players[turn-1].markers[r] = end;
		  				break;
		  			}
		  		}

				//remove from blockades
				players[turn-1].blockades.splice(x, 1);

			}
		}

  		this.setState({
			players: players
		});

    };

    this.endTurn = function(){
    	const players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

	  	//clear dice for current player
	  	players[turn-1].dice = [];

	  	this.manageBlockades();

	  	var playersComplete = 0;
	  	while(true){
	  		
	  		//advance turn to next player
		  	turn = (turn == players.length) ? 1 : turn + 1;

	  		//check if new current player is finished, or not active
		  	if(players[turn-1].finished || players[turn-1].human == null){
		  		playersComplete++;
		  	}else{
		  		//exit on the first player that still has markers on the board
		  		break;
		  	}

	  		if(playersComplete == players.length){

	  			//ALL PLAYERS COMPLETED
				this.setState({
					gameState: 1,
					players: players
				});

	  			return;
	  		}

	  	}

		this.setState({
			turn: turn,
			turnComplete: false,
			players: players
		}, function(){

			//if next turn is a CPU player, run AI
			if(players[turn-1].human == false){

				this.startAiTurn();

			}

		});

    };

    this.startAiTurn = function(){

    	this.performAiRollAction(function(){

    		let players = this.state.players.slice();
		  	let turn = Object.assign(this.state.turn);

		  	//roll again if a double
		  	if(players[turn-1].dice[0].number == players[turn-1].dice[1].number){

				this.performAiRollAction(function(){

					players = this.state.players.slice();

					//roll again if a second double
					if(players[turn-1].dice[0].number == players[turn-1].dice[1].number){
						
						this.performAiRollAction(function(){

							this.endTurn();

						}.bind(this));

					}else{
				  		this.endTurn();
				  	}

				}.bind(this));

		  	}else{
		  		this.endTurn();
		  	}

    	}.bind(this));

    };

    this.performAiRollAction = function(callback){

    	//roll dice
    	this.rollDice(function(){

			this.afterMoveCallback(function(){

				this.disableAllDice();

				callback();

		  	}.bind(this));

		}.bind(this));

    };

    this.afterMoveCallback = function(callback){

		//pause for 0.5 second before each move
    	setTimeout(function(){

	    	const players = this.state.players.slice();
		  	let turn = Object.assign(this.state.turn);

	    	if(hasAnyValidMoves(players, turn)){

    			this.loopOverActions(function(){
    				
    				//hide highlights after each move
    				this.setState({
				  		showMoves: []
				  	}, function(){

			  			callback();

				  	});

	    		}.bind(this));

	    	}else{
	    		callback();
	    	}

    	}.bind(this), 500);

    };

    this.loopOverActions = function(callback){

    	this.breakBlockade(function(foundMove){

			if(!foundMove){

				this.captureEnemy(function(foundMove){

					if(!foundMove){

						this.moveUnsafeToSafe(function(foundMove){

							if(!foundMove){

								this.moveOutOfStart(function(foundMove){

									if(!foundMove){

										this.moveIntoHome(function(foundMove){

											if(!foundMove){

												this.moveToSafeSpace(function(foundMove){

													if(!foundMove){

														this.moveAwayFromNearbyEnemy(function(foundMove){

															if(!foundMove){

																this.moveBehindNearestEnemy(function(foundMove){

																	if(!foundMove){
										    		
																		this.moveMostAdvanced(function(foundMove){

																			//no remaining valid moves
																			if(!foundMove){

																				callback();

																			}else{
																				this.afterMoveCallback(callback);
																			}
																		}.bind(this));
																	}else{
																		this.afterMoveCallback(callback);
																	}
																}.bind(this));
															}else{
																this.afterMoveCallback(callback);
															}
														}.bind(this));
													}else{
														this.afterMoveCallback(callback);
													}
												}.bind(this));
											}else{
												this.afterMoveCallback(callback);
											}
										}.bind(this));
									}else{
										this.afterMoveCallback(callback);
									}
								}.bind(this));
							}else{
								this.afterMoveCallback(callback);
							}
						}.bind(this));
					}else{
						this.afterMoveCallback(callback);
					}
				}.bind(this));
			}else{
				this.afterMoveCallback(callback);
			}
		}.bind(this));

    };

    this.moveAiMarker = function(start, end, players, turn, cmdName){

    	console.log("CPU Player " + turn + ": " + cmdName);

	  	this.setState({
	  		showMoves: [end]
	  	}, function(){

	  		setTimeout(function(){

	  			//move marker to destination
		    	for(var r=0; r<players[turn-1].markers.length; r++){
		  			if(players[turn-1].markers[r] == start){
		  				players[turn-1].markers[r] = end;
		  				break;
		  			}
		  		}

				//set used die (or dice) as disabled
				var moveDistance = getDistance(start, end, players[turn-1].enters);
				var usedDiceIndices = findUsedDice(players[turn-1].dice, moveDistance);
				for(var d=0; d<usedDiceIndices.length;d++){
					players[turn-1].dice[usedDiceIndices[d]].active = false;
				}
				
				//check if the player has completed all markers
				var anyMarkersStillOnBoard = false;
				for(var z=0;z<players[turn-1].markers.length;z++){
					if([-11,-12,-13,-14].indexOf(players[turn-1].markers[z]) == -1){
						anyMarkersStillOnBoard = true;
					}
				}
				if(!anyMarkersStillOnBoard){
					players[turn-1].finished = true;
				}

				this.setState({
					players: players
				});

			}.bind(this), 500);

		});

    };

    this.breakBlockade = function(callback){

	  	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

    	//check if any markers have a duration of 3, if so try to move one
    	var blockadePosition = null;
    	for(var x=0;x<players[turn-1].blockades.length;x++){

    		if(players[turn-1].blockades[x].duration == 3){

    			blockadePosition = players[turn-1].blockades[x].position;
    			break;

    		}

    	}

    	if(blockadePosition != null){

    		var validMovesForMarker = getPossiblePositions(blockadePosition, players, turn);

    		if(validMovesForMarker.length > 0){

	    		for(var x=0; x<validMovesForMarker.length;x++){
	    			
	    			//remove blockade before passing players to move function
	    			var y = players[turn-1].blockades.length;
	    			while(y--){

	    				if(players[turn-1].blockades[y].position == blockadePosition){

	    					players[turn-1].blockades.splice(x, 1);

	    					break;

	    				}

	    			}

	    			this.moveAiMarker(blockadePosition, validMovesForMarker[x], players, turn, 'breakBlockade');
	    			
	    			break;

	    		}
				
				callback(true);
				return;
			}

    	}

		callback(false);
		return;
    };

    this.captureEnemy = function(callback){

	  	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

	  	let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}

  		//capture enemy
	  	for(var c=0; c<validMovesArray.length;c++){
		  	for(var a=0;a<players.length;a++){
				if(a != turn - 1){
					for(var b=0; b<players[a].markers.length; b++){
						var enemyMarkerPos = players[a].markers[b];
						if(validMovesArray[c].indexOf(enemyMarkerPos) != -1){

							//move enemy back to Start
	  						this.moveMarker(enemyMarkerPos, (players[a].player * (-1)));

	  						var playerMarkerPos = players[turn-1].markers[c];

	  						this.moveAiMarker(playerMarkerPos, enemyMarkerPos, players, turn, 'captureEnemy');

							this.addBonusMove(20);

							callback(true);

							return;

						}
					}
				}
		  	}

	  	}

		callback(false);
		return;
    };

    this.moveUnsafeToSafe = function(callback){

    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

	  	let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}

	  	var safePositions = getSafePositionsForTurn(players, turn);

  		//move from unsafe to safe space
	  	for(var c=0; c<validMovesArray.length;c++){

  			//if any marker is not on a safe space
  			if(safePositions.indexOf(players[turn-1].markers[c]) == -1){

	  			for(var b=0; b<safePositions.length; b++){

	  				//and a safe space is a valid move for that marker
		  			if(validMovesArray[c].indexOf(safePositions[b]) != -1){

  						var safeDestination = safePositions[b];

  						this.moveAiMarker(players[turn-1].markers[c], safeDestination, players, turn, 'moveUnsafeToSafe');

						callback(true);
						return;

		  			}else{

		  				//or if any team marker position is a valid move for another marker
	  					for(var a=0; a<players[turn-1].markers.length; a++){
	  						
	  						if(a!=c && validMovesArray[c].indexOf(players[turn-1].markers[a]) != -1){
	  							
	  							var safeDestination = players[turn-1].markers[a];

								this.moveAiMarker(players[turn-1].markers[c], safeDestination, players, turn, 'moveUnsafeToSafe');

								callback(true);
								return;

	  						}

	  					}

		  			}

	  			}

	  		}
	  		
	  	}

		callback(false);
		return;
    };

    this.moveOutOfStart = function(callback){

    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

	  	let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}

    	//move out of Start
	  	for(var c=0; c<validMovesArray.length;c++){

	  		let playerEnterPos = players[turn-1].enters;
	  		if(validMovesArray[c].indexOf(playerEnterPos) != -1){

	  			var playerMarkerPos = players[turn-1].markers[c];

				this.moveAiMarker(playerMarkerPos, playerEnterPos, players, turn, 'moveOutOfStart');

				callback(true);
				return;

	  		}

	  	}

		callback(false);
		return;
    };

    this.moveIntoHome = function(callback){

    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);
		
		let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}
    	
    	//move into Home
	  	for(var c=0; c<validMovesArray.length;c++){

	  		let playerHomePos = (turn * (-1)) - 10;
	  		if(validMovesArray[c].indexOf(playerHomePos) != -1){

	  			var playerMarkerPos = players[turn-1].markers[c];

				this.moveAiMarker(playerMarkerPos, playerHomePos, players, turn, 'moveIntoHome');

    			this.addBonusMove(10);

				callback(true);

				return;

	  		}

	  	}

		callback(false);
		return;
    };

    this.moveToSafeSpace = function(callback){

    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);

	  	let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}

	  	var safePositions = getSafePositionsForTurn(players, turn);

  		//move from any space to a safe space
	  	for(var c=0; c<validMovesArray.length;c++){

  			for(var b=0; b<safePositions.length; b++){

  				//if a ramp space or safe space is a valid move for a marker
	  			if(validMovesArray[c].indexOf(safePositions[b]) != -1){

					var safeDestination = safePositions[b];

					this.moveAiMarker(players[turn-1].markers[c], safeDestination, players, turn, 'moveToSafeSpace');

					callback(true);
					return;

	  			}else{
	  				//or if any team marker position is a valid move for another marker
  					for(var a=0; a<players[turn-1].markers.length; a++){
  						
  						if(a!=c && validMovesArray[c].indexOf(players[turn-1].markers[a]) != -1){
  							
  							var safeDestination = players[turn-1].markers[a];

							this.moveAiMarker(players[turn-1].markers[c], safeDestination, players, turn, 'moveToSafeSpace');

							callback(true);
							return;

  						}

  					}

	  			}

  			}
	  		
	  	}

		callback(false);
		return;
    };

    this.moveAwayFromNearbyEnemy = function(callback){
    	
    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);
		
	  	var safePositions = getSafePositionsForTurn(players, turn);

		let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		//only get valid moves for markers that are not safe
	  		if(safePositions.indexOf(m) == -1 && [-11,-12,-13,-14].indexOf(m) == -1){

	  			var markerHasEnemyBehind = false;

	  			for(var y=0;y<players.length;y++){
	  				if(players[y].player != turn){
	  					//for each enemy marker
	  					for(var z=0;z<players[y].markers.length;z++){

	  						//check if the enemy marker has a player marker within 10 spaces
	  						var enemyMarkerPos = players[y].markers[z];
	  						for(var s=0;s<10;s++){
	  							
	  							enemyMarkerPos = manageIncrement(enemyMarkerPos, players[y].enters);

	  							if(enemyMarkerPos == m){

	  								markerHasEnemyBehind = true;

	  							}

	  						}

	  					}
	  				}

	  			}

	  			if(markerHasEnemyBehind){
	  				validMovesArray.push(getPossiblePositions(m, players, turn));
	  			}else{
		  			validMovesArray.push([]);
		  		}

	  		}else{
	  			validMovesArray.push([]);
	  		}

	  	}
    	
    	//move away from nearby enemy
	  	for(var c=0; c<validMovesArray.length;c++){

	  		if(validMovesArray[c].length > 0){

  				var playerMarkerPos = players[turn-1].markers[c];

				this.moveAiMarker(playerMarkerPos, validMovesArray[c][0], players, turn, 'moveAwayFromNearbyEnemy');

				callback(true);
				return;

			}

	  	}

		callback(false);
		return;

    };

    this.moveBehindNearestEnemy = function(callback){
    	
    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);
		
		let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}

	  	//get player marker indices where there are enemies ahead
	  	var markersWithEnemyAhead = [];
	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var playerMarkerPos = players[turn-1].markers[x];
			for(var s=0;s<10;s++){
				
				var hasEnemyAhead = false;

				playerMarkerPos = manageIncrement(playerMarkerPos, players[turn-1].enters);

				//if the next space exists
				if(playerMarkerPos != null){
					
					//for each enemy player
					for(var y=0; y<players.length;y++){

						if(players[turn-1].player != players[y].player){

							//for each enemy marker
							for(var z=0; z<players[y].markers.length;z++){

								var enemyMarkerPos = players[y].markers[z];

								//if the enemy is in the path and it is the first enemy found in the path
								if(playerMarkerPos == enemyMarkerPos && !hasEnemyAhead){

									markersWithEnemyAhead.push(x);

									var a = validMovesArray[x].length;
									while(a--){

										var distToDest = getDistance(players[turn-1].markers[x], validMovesArray[x][a], players[turn-1].enters);
										var distToEnemy = getDistance(players[turn-1].markers[x], enemyMarkerPos, players[turn-1].enters);

										//remove any destination from valid moves where there is an enemy in the path
										if(distToDest > distToEnemy){
											validMovesArray[x].splice(a, 1);
										}

									}

									hasEnemyAhead = true;

								}

							}

						}

					}

				}else{

					//if no space exists ahead, skip to next marker
					break;

				}

			}

		}

		//make the first valid move of a marker with enemies ahead that does not require moving past an enemy
		for(var a=0;a<markersWithEnemyAhead.length;a++){

			var markerIndex = markersWithEnemyAhead[a];
			var validMovesForMarker = validMovesArray[markerIndex];
			for(var b=0; b<validMovesForMarker.length;b++){

				var destPos = validMovesForMarker[b];
				var playerMarkerPos = players[turn-1].markers[markerIndex];

				this.moveAiMarker(playerMarkerPos, destPos, players, turn, 'moveBehindNearestEnemy');

				callback(true);
				return;

			}
			
		}
		
		callback(false);
		return;

    };

    this.moveMostAdvanced = function(callback){

    	let players = this.state.players.slice();
	  	let turn = Object.assign(this.state.turn);
		
		let validMovesArray = [];

	  	for(var x=0; x<players[turn-1].markers.length;x++){

	  		var m = players[turn-1].markers[x];
	  		validMovesArray.push(getPossiblePositions(m, players, turn));
	  		
	  	}

	  	var orderedMarkerIndices = [];
	  	var mostAdvancedIndex = null;

	  	for(var n=0; n<players[turn-1].markers.length;n++){

		  	var longestDistance = -900;
		  	for(var m=0; m<players[turn-1].markers.length;m++){
		  		
		  		//only get distance of marker that is beyond the enter position
		  		var distanceFromStart = -1;
		  		if(players[turn-1].markers[m] == players[turn-1].enters){
		  			distanceFromStart = 0;
		  		}else if([-1,-2,-3,-4].indexOf(players[turn-1].markers[m]) == -1){
		  			distanceFromStart = getDistance(players[turn-1].enters, players[turn-1].markers[m], players[turn-1].enters);
		  		}
		  		
		  		if(orderedMarkerIndices.indexOf(m) == -1 && longestDistance < distanceFromStart){
					longestDistance = distanceFromStart;
					mostAdvancedIndex = m;
		  		}
		  	}
	  		orderedMarkerIndices.push(mostAdvancedIndex);

		}

		for(var m=0; m<orderedMarkerIndices.length;m++){

			var orderedMarkerPos = players[turn-1].markers[orderedMarkerIndices[m]];
			var validMovesForOrderedMarker = validMovesArray[orderedMarkerIndices[m]];

			for(var n=0; n<validMovesForOrderedMarker.length; n++){

				this.moveAiMarker(orderedMarkerPos, validMovesForOrderedMarker[n], players, turn, 'moveMostAdvanced');

				callback(true);
				return;

			}

	  	}

		callback(false);
		return;
    };

  }

  handleChangeConfigurePlayer(e){

		let inputName = e.target.id.split('_');

		let human = inputName[0] == 'p' ? true : (inputName[0] == 'cpu' ? false : null);
		let pIndex = parseInt(inputName[1]) - 1;

	  	const players = this.state.players.slice();
	  	players[pIndex].human = human;

		this.setState({
			players: players
		});

  }

  handleClickStartGame(e){
		
		//find the first player and set the turn
		const players = this.state.players.slice();

		let activePlayerCount = 0;
		for(var x=0; x<players.length;x++){
			if(players[x].human != null){
				activePlayerCount++;
			}
		}

		//only start game if there are at least 2 players
		if(activePlayerCount > 1){

			let turn = Object.assign(this.state.turn) - 1;

			//set game to start
			this.setState({
				gameState: 0
			});

		  	while(true){
		  		
		  		//advance turn to next player
			  	turn = (turn == players.length) ? 1 : turn + 1;

		  		//set the next active player as the current turn
			  	if(players[turn-1].human != null){
			  		break;
			  	}

		  	}

		  	//start first turn
			this.setState({
				turn: turn,
				turnComplete: false
			}, function(){

				if(players[turn-1].human == false){

					this.startAiTurn();

				}

			});
		}
	  	
  }

  	handleClickEndTurn(e){
		this.endTurn();
  	}

  	handleClickRollDice(e){
  		this.rollDice(function(){

  		});
  	}

  	//move clicked marker out of the origin space and center under the mouse
    handleMouseDownMarker(event){
  		const markerElement = ReactDOM.findDOMNode(event.target);

  		//get the distance between the marker and the mouse
	    let shiftX = event.clientX - markerElement.getBoundingClientRect().left;
	    let shiftY = event.clientY - markerElement.getBoundingClientRect().top;

	    //get the distance between the marker and its parent
	    let distInsideX = markerElement.getBoundingClientRect().left - markerElement.parentNode.getBoundingClientRect().left;
	    let distInsideY = markerElement.getBoundingClientRect().top - markerElement.parentNode.getBoundingClientRect().top;

	    //set the marker to its equivalent position using absolute positioning inside its parent
	    var markerStyle = markerElement.currentStyle || window.getComputedStyle(markerElement);
    	markerElement.style.left = distInsideX - parseInt(markerStyle.marginLeft) + 'px';
    	markerElement.style.top = distInsideY - parseInt(markerStyle.marginTop) + 'px';
	    markerElement.style.position = 'absolute';
	    markerElement.style.zIndex = 5000;
	    markerElement.parentNode.style.zIndex = 5000;
	    markerElement.closest('.quadrant').style.zIndex = 5000;

    	//continually center marker under the mouse as it moves
    	document.onmousemove = function(e){
			//get the distance between the parent and the mouse
	    	let mouseX = e.clientX - markerElement.parentNode.getBoundingClientRect().left;
	    	let mouseY = e.clientY - markerElement.parentNode.getBoundingClientRect().top;

	    	//move the marker to the same position as the mouse, relative to its parent
	    	var markerStyle = markerElement.currentStyle || window.getComputedStyle(markerElement);
			markerElement.style.left = mouseX - (markerElement.getBoundingClientRect().width / 2) - parseInt(markerStyle.marginLeft) + 'px';
			markerElement.style.top = mouseY - (markerElement.getBoundingClientRect().height / 2) - parseInt(markerStyle.marginTop) + 'px';
    	}
    }

    //stop the move listener, and drop the marker into the destination space or back in the origin space
	handleMouseUpMarker(event){
  		document.onmousemove = null;

  		const markerElement = ReactDOM.findDOMNode(event.target);

  		//tokenindex is the last recorded position of the token
    	const originPosition = parseInt(markerElement.getAttribute('tokenindex'));
		let players = this.state.players.slice();
		const turn = Object.assign(this.state.turn);

        let validMoves = getPossiblePositions(originPosition, players, turn);

	    //capture the element below the marker
	    markerElement.style.visibility = "hidden";
	    let belowElement = document.elementFromPoint(event.clientX, event.clientY);
	    markerElement.style.visibility = null;

	    if (belowElement != null){

	    	let destinationElement = belowElement.closest('.space, .playerHome');
	    	if(destinationElement != null){

			    let destinationPosition = parseInt(destinationElement.getAttribute('positionindex'));

			    //if space is a valid move
			    if(validMoves.indexOf(destinationPosition) != -1){

					for(var u=0;u<players.length; u++){
			    		//if not the current player
			    		if(players[u].player != turn){
					    	for(var w=0;w<players[u].markers.length; w++){
					    		//if enemy marker is on destination space
						  		if(players[u].markers[w] == destinationPosition){
						  			//send enemy marker back to Start
						  			this.moveMarker(destinationPosition, (players[u].player * (-1)));
						  			this.addBonusMove(20);
						  			break;
						  		}
						  	}
					  	}
					}

		        	//move marker element into destination space
		  			this.moveMarker(originPosition, destinationPosition);
					markerElement.style.position = null;
					markerElement.style.zIndex = null;
				    markerElement.style.left = null;
				    markerElement.style.top = null;
	    			markerElement.parentNode.style.zIndex = null;
	    			markerElement.closest('.quadrant').style.zIndex = null;

				  	players = this.state.players.slice();

					//set used die (or dice) as disabled
		  			var moveDistance = getDistance(originPosition, destinationPosition, players[turn-1].enters);
		  			var usedDiceIndices = findUsedDice(players[turn-1].dice, moveDistance);
		  			for(var b=0; b<usedDiceIndices.length;b++){
						players[turn-1].dice[usedDiceIndices[b]].active = false;
		  			}

					this.setState({
						players: players
					});

					//if marker made it to Home
					if((players[turn-1].player * (-1)) - 10 == destinationPosition){
						this.addBonusMove(10);

						//check if the player has completed all markers
						var anyMarkersStillOnBoard = false;
						players = this.state.players.slice();
						for(var z=0;z<players[turn-1].markers.length;z++){
							if([-11,-12,-13,-14].indexOf(players[turn-1].markers[z]) == -1){
								anyMarkersStillOnBoard = true;
							}
						}
						if(!anyMarkersStillOnBoard){
							players[turn-1].finished = true;
							this.setState({
								players: players
							});
						}
		  			}

		  			//if there are no valid moves and it was NOT a double
				  	players = this.state.players.slice();
		  			if(!hasAnyValidMoves(players, turn) &&
		  				players[turn-1].dice[0].number != players[turn-1].dice[1].number){

		  				//clear dice and end turn
		  				this.disableAllDice();
				  		this.setState({
				  			turnComplete: true
				  		});

		  			}else if(!hasAnyValidMoves(players, turn) &&
		  				players[turn-1].dice[0].number == players[turn-1].dice[1].number){
		  				
		  				//if there are no valid moves and it WAS a double
		  				//clear dice without ending turn
		  				this.disableAllDice();

		  			}

		  			//otherwise, wait for next valid move
			  		this.setState({
			  			showMoves: []
			  		});

			  		return;
			    }
	    	}
	    }

	    //invalid move, remove movement styles and show valid moves
    	this.setState({
  			showMoves: validMoves
  		});

    	markerElement.style.position = null;
    	markerElement.style.zIndex = null;
        markerElement.style.left = null;
        markerElement.style.top = null;
		markerElement.parentNode.style.zIndex = null;
		markerElement.closest('.quadrant').style.zIndex = null;

	}

    render() {
	    return (
	    	<div id="boardContainer">
	          <Board
	          	gameState={this.state.gameState}
	          	turn={this.state.turn}
	          	onMouseDownMarker={(e) => this.handleMouseDownMarker(e)}
	          	onMouseUpMarker={(e) => this.handleMouseUpMarker(e)}
	          	onClickStartGame={(e) => this.handleClickStartGame(e)}
	          	onChangeConfigurePlayer={(e) => this.handleChangeConfigurePlayer(e)}
	          	onClickRollDice={(e) => this.handleClickRollDice(e)}
	          	onClickEndTurn={(e) => this.handleClickEndTurn(e)}
	          	turnComplete={this.state.turnComplete}
	          	showMoves={this.state.showMoves}
	          	players={this.state.players}
	          />
          </div>
	    );
    }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function hasAnyValidMoves(players, turn){
	const player = players[turn-1];
	var anyMoves = false;

	//check for legal moves
	for(var t=0; t<player.markers.length; t++){
		var positionArray = getPossiblePositions(player.markers[t], players, turn);

		if(positionArray.length > 0){
			anyMoves = true;
		}
	}
	return anyMoves;
}

function isSpaceBlocked(space, players){

  	var blocked = false;
  	//for each player
  	for(var x=0;x<players.length;x++){
  		var onSpace = 0;
  		//count the number of markers on the space
  		for(var y=0;y<players[x].markers.length;y++){
	  		if(players[x].markers[y] == space){
				onSpace++;
	  		}
  		}
  		//if there are two markers, the space is blocked
  		if(onSpace == 2){
  			blocked = true;
  		}
  	}

  	return blocked;
}

function manageIncrement(x, enterPos){
	if(x == null){
		return x;
	}
  	if(x==67){
  		if(enterPos == 4){
  			//increment up ramp
  			return x + 100;
  		}else {
  			//increment back to 0
  			return 0;
  		}
  	} else if((x==16 && enterPos==21) || (x==33 && enterPos==38) || (x==50 && enterPos==55) || (x > 67 && x < 716)){
  		//increment up non-looping ramps
  		return x + 100;
  	}else if(x==716){
  		//increment into Home
  		return -14;
  	}else if(x==733){
  		//increment into Home
  		return -11;
  	}else if(x==750){
  		//increment into Home
  		return -12;
  	}else if(x==767){
  		//increment into Home
  		return -13;
  	}else if([-11,-12,-13,-14].indexOf(x) != -1){
  		//already incremented to Home
  		return null;
  	}else if([-1,-2,-3,-4].indexOf(x) != -1){
  		//at Start
  		return enterPos;
  	}else{
  		//regular increment
  		return x + 1;
  	}
}

function getDestination(start, moves, enterPos){
  	for(var x=0;x<moves;x++){
  		start = manageIncrement(start, enterPos);
  	}
  	return start;
}

function isPathBlocked(start, end, enterPos, players){
  	//advance through each space in the move path
	while(start != end){
		if(start == null){
			return true;
		}
		//increment before checking in case the start space is from a blocked space
		start = manageIncrement(start, enterPos);
		if([-11,-12,-13,-14].indexOf(start) != -1){
			//the Home space is never blocked
			return false;
		}
		if(isSpaceBlocked(start, players)){
  			//exit if a blocked space is found in path
  			return true;
  		}
  	}
  	return false;
}

function getPossiblePositions(startPos, players, turn){

  	var player = players[turn-1];
  	var possiblePositions = [];

	if([-1,-2,-3,-4].indexOf(startPos) != -1){
		//marker is at Start
		if(isSpaceBlocked(player.enters, players)){
			return [];
		}else{
			if((!player.dice[0].active || player.dice[0].number != 5) &&
				(!player.dice[1].active || player.dice[1].number != 5)){
				//if no 5 is rolled
				return [];
			}else{
				//only use one 5 to enter if it is a double
				let fiveUsedToEnter = false;
				for(var x=0;x<player.dice.length;x++){
					if(player.dice[x].active){
						if(player.dice[x].number == 5 && !fiveUsedToEnter){
							fiveUsedToEnter = true;
							possiblePositions.push(player.enters);
						}else{
							var dest = player.enters + player.dice[x].number;
							if(!isPathBlocked(player.enters, dest, player.enters, players)){
								possiblePositions.push(dest);
							}
						}
					}
				}
			}
		}
	}else if([-11,-12,-13,-14].indexOf(startPos) != -1){
		//marker has reached Home
		return [];
	}else{
		//somewhere on the board
		const dice = player.dice.slice();
		let diceMoves = [];

		//get an array of active dice (max 2)
		for(var x=0; x<dice.length; x++){
			if(dice[x].active){
				diceMoves.push(dice[x]);
			}
		}

		if(diceMoves.length > 1){
			diceMoves.push({
				number: diceMoves[0].number + diceMoves[1].number,
				active: true
			});
		}

		for(var a=0;a<diceMoves.length;a++){
			if(diceMoves[a].active){
				var dest = getDestination(startPos, diceMoves[a].number, player.enters);
				if(dest != null && !isPathBlocked(startPos, dest, player.enters, players)){
					possiblePositions.push(dest);
				}
			}
		}
	}

	//out of all possiblePositions, remove safe spaces that have enemy markers
	var b = possiblePositions.length;
	while (b--) {
		//if the destination is a safe space, but not the player's Start space
		if(possiblePositions[b] != player.enters && [4,11,16,21,28,33,38,45,50,55,62,67].indexOf(possiblePositions[b]) != -1){
			//for each enemy player
			for(var c=0;c<players.length;c++){
				if(players[c].player != turn){
					//for each enemy marker
					for(var d=0; d < players[c].markers.length;d++){
						//if a marker is on the destination
						if(players[c].markers[d] == possiblePositions[b]){
							//remove from possible positions
							possiblePositions.splice(b, 1);
						}
					}
				}
			}
		}
	}

	return possiblePositions;
}

function getMostAdvancedPosition(player){
  	var space = null;
  	var distanceFromStart = 0;
	for(var z=0;z<player.markers.length;z++){
		//skip markers at Start and Home
		if([-11,-12,-13,-14].indexOf(player.markers[z]) == -1 && [-1,-2,-3,-4].indexOf(player.markers[z]) == -1){
			var curDistance = getDistance(player.enters, player.markers[z], player.enters);
			if(distanceFromStart < curDistance){
				distanceFromStart = curDistance;
				//get the space of the marker that is the greatest distance from start
				space = player.markers[z];
			}
		}
	}

	return space;
}

function getDistance(start, end, enterPos){
  	var distance = 0;
  	while(start != end){
  		var fromPosition = start;
		start = manageIncrement(start, enterPos);
		if([-1,-2,-3,-4].indexOf(fromPosition) != -1){
			//count 5 dice space when entering
			distance += 5;
		}else{
			//count 1 dice space
			distance++;
		}
  	}
  	return distance;
}

function findUsedDice(dice, moveDistance){

	for(var b=0; b<dice.length;b++){
		if(dice[b].active && dice[b].number == moveDistance){
			//if one die equals the move
			return [b];
		}
	}
	
	for(var b=0; b<dice.length;b++){
		if(dice[b].active){
			for(var c=0; c<dice.length;c++){
				if(b != c && dice[c].active && (dice[b].number + dice[c].number) == moveDistance){
					//if two dice equal the move
					return [b,c];
				}
			}
		}
	}

	return [];
}

function getMarkersToRender(players, spacePosition){
	let markersToRender = [];
	for(var x=0; x < players.length; x++){
		//prevent rendering markers for inactive players
		if(players[x].human != null){
			for(var y=0; y < players[x].markers.length; y++){
				if(players[x].markers[y] == spacePosition){
					markersToRender.push(players[x].player);
				}
			}
		}
	}
	return markersToRender;
}


function getSafePositionsForTurn(players, turn){

  	const safePositions = [4,11,16,21,28,33,38,45,50,55,62,67,-1,-2,-3,-4];

  	for(var y=0;y<players.length;y++){
  		//for each enemy player
  		if(players[y].player != turn){
		  	for(var z=0;z<players[y].markers.length;z++){
		  		//if the player has a marker at Start
		  		if([-1,-2,-3,-4].indexOf(players[y].markers[z]) != -1){
		  			//remove the enter space from safe spaces
		  			var indexToRemove = safePositions.indexOf(players[y].enters);
		  			if(indexToRemove != -1){
		  				safePositions.splice(indexToRemove, 1);
		  			}
		  		}
		  	}
	  	}
	}

  	const ramps = [
  		[67,167,267,367,467,567,667,767],
  		[16,116,216,316,416,516,616,716],
  		[33,133,233,333,433,533,633,733],
  		[50,150,250,350,450,550,650,750]
  	];

  	//add each ramp position for the current player
  	for(var x=0;x<ramps[turn-1].length;x++){
  		safePositions.push(ramps[turn-1][x]);
  	}

	return safePositions;
}
