
function BrickGameView(){
	this.bricksContainerEl = [[]];
	this.svgEl = document.querySelector('svg');

	//audio
	this.audioManager = new AudioManager();
	this.bounce = document.body.querySelector('#ballBounceClip');
	this.magic = document.body.querySelector('#magicClip');
	this.chanceIsLost = document.body.querySelector('#chanceIsLostClip');
	this.gameOver = document.body.querySelector('#gameOverClip');
	this.youWon = document.body.querySelector('#youWonClip');
	this.pause = document.body.querySelector('#pauseClip');
	this.specialBrick = document.body.querySelector('#specialBrickClip');
	

	this.onWallCollisionSound = function(){
		this.audioManager.playClip(this.bounce, 0.4);
	}

	this.playWhenChanceIsLost = function(){
		this.audioManager.playClip(this.chanceIsLost,1);
	}

	this.playWhenGameOver = function(){
		this.audioManager.playClip(this.gameOver,1);
	}
	
	this.playWhenGameIsWon = function(){
		this.audioManager.playClip(this.youWon,1);
	}

	this.playWhenGameIsPaused = function(){
		this.audioManager.playClip(this.pause,1);
	}

	this.leftWallEl = document.querySelector('#leftWall');
	this.rightWallEl = document.querySelector('#rightWall');
	this.topWallEl = document.querySelector('#topWall');
	this.paddleEl = document.querySelector('#paddle');
	this.scoreEl = document.querySelector('#score');
	this.lifeEl = document.querySelector('#life');
	this.timeEl = document.querySelector('#time');
		
	this.init = function(){
		mapSVGToModel(this.leftWallEl, leftWall);
		mapSVGToModel(this.rightWallEl, rightWall);
		mapSVGToModel(this.topWallEl, topWall);
		mapSVGToModel(this.paddleEl, paddle);
		this.generateBricks();
		this.starEl = createStars();
		this.svgEl.appendChild(this.starEl);
		this.ballEl = createBall();
		this.svgEl.appendChild(this.ballEl);
	};

	this.generateBricks = function(){
		var horizontalSpacing = 10;
		var verticalSpacing = 10;
		var initialX = 95;
		var initialY = 80;
		var width = 100;
		var height = 30;
		var gridSize = 6;
		for(var i = 0; i < gridSize; i++){
			var currentY = initialY + (height + verticalSpacing) * i;
			bricksContainer[i] = [];
			this.bricksContainerEl[i] = [];
			for(var j = 0; j < gridSize; j++){
				var currentX = initialX + (width + horizontalSpacing) * j;
				var b = createBrick(currentX, currentY, width, height);
				this.svgEl.appendChild(b);
				this.bricksContainerEl[i][j] = b;
				bricksContainer[i][j] = new Brick(currentX, currentY, width, height);
			}
		}
		this.generateSpecialBricks();
	};

	this.generateSpecialBricks = function(){
		 for(var i = 0; i < numberOfSplBricks; i++){
		      var x = Math.floor(Math.random() * 6);
		      var y = Math.floor(Math.random() * 6);
		      var b = this.bricksContainerEl[x][y];   
		      b.style.fill = "#D593FF";
		      bricksContainer[x][y].type = "special";
		}
	}

	this.destroyBrick = function(i, j, special){
		this.audioManager.playClip(this.bounce, 1);
		this.audioManager.playClip(this.magic, 0.1);
		if(special){
			this.audioManager.playClip(this.specialBrick, 1);
		}
		this.triggerBrickFall(this.bricksContainerEl[i][j]);
	}

	this.triggerBrickFall = function(b){
		//b.style['fill'] = '#D7EBD0';
		b.style.fill = "url(#SadSmile)";
		b.innerHTML = '<animateTransform attributeName="transform" attributeType="XML" type="translate" from="0 0" to="0 ' + (brickFallDestVal) +'" dur="3s" repeatCount="indefinite"/>';
		b.innerHTML += '<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="5 0 0" dur="3s" repeatCount="indefinite"></animateTransform>';
		setTimeout(this.removeBrick, brickFallInterval, b, this);	
	}


	this.removeBrick = function(b, t){
		t.svgEl.removeChild(b);
	}

	this.updatePaddle = function(paddle){
		this.paddleEl.setAttribute('x', paddle.position.x);
		this.paddleEl.setAttribute('y', paddle.position.y);
	};

	this.updateBall = function(ball){
		this.ballEl.setAttribute('cx', ball.position.x);
		this.ballEl.setAttribute('cy', ball.position.y);
	}
	this.updateStars = function(star){
		this.starEl.setAttribute('x', star.position.x);
		this.starEl.setAttribute('y', star.position.y);
		this.starEl.style['display'] = star.display;
	}
	this.updateScore = function(score){
		this.scoreEl.textContent = "Score : " + score;
	}
	this.updateChances = function(chances){
		this.lifeEl.textContent = "* " + chances;
	}
	this.updateTime = function(time){
		this.timeEl.textContent = "Time : " + time + " sec";
	} 
	this.showGameOverScreen = function(){
		this.createMessageScreen("Game Over!");
	}
	this.showStartupScreen = function(){
		this.createMessageScreen("Welcome!");
	}
	this.showPauseScreen = function(){
		this.createMessageScreen("Game Paused!","Press key 'p' to continue");
	}
	this.showLostChanceScreen = function(){
		this.createMessageScreen("Lost chance!");
	}
	this.showWinningScreen = function(){
		this.createMessageScreen("You won!");
	}

	this.createMessageScreen = function(msg,infoMsg){
		infoMsg = infoMsg || "Press enter to continue";
		this.svgEl.appendChild(getMessageBGScreen());
		this.svgEl.appendChild(createMessage(msg));
		this.svgEl.appendChild(createInfoMessage(infoMsg));
	}
	this.disableMessageWindow = function(){
		this.svgEl.removeChild(document.querySelector(".popUpScreen"));
		this.svgEl.removeChild(document.querySelector(".message"));
		this.svgEl.removeChild(document.querySelector(".infoMessage"));
	}
}

//utility functions
function mapSVGToModel(svgEl,model){
	model.position.x = parseInt(svgEl.getAttribute('x'));
	model.position.y = parseInt(svgEl.getAttribute('y'));
	model.dimensions.width = parseInt(svgEl.getAttribute('width'));
	model.dimensions.height = parseInt(svgEl.getAttribute('height'));
}

var brickGameView = new BrickGameView();
brickGameView.init();

function createBall(){
	var ballEl = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	ballEl.setAttribute('id','ball');
	ballEl.setAttribute('cx','425');
	ballEl.setAttribute('cy','500');
	ballEl.setAttribute('r','15');
	ballEl.setAttribute('fill','#D94A5C');

	ball.position.x = parseInt(ballEl.getAttribute('cx'));
	ball.position.y = parseInt(ballEl.getAttribute('cy'));
	ball.radius = parseInt(ballEl.getAttribute('r'));
	ball.velocity = new Vector2(20, -30);

	return ballEl;
}

function createStars(){
	 var starEl = document.createElementNS("http://www.w3.org/2000/svg", 'image');
     starEl.setAttribute('x', 20);
     starEl.setAttribute('y', 20);
     starEl.setAttribute('width', 100);
     starEl.setAttribute('height', 100);
     starEl.setAttribute('id', 'star');
     starEl.setAttribute('class','star');
     starEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "resources/images/star.png");

     star.position.x =  starEl.getAttribute('x');
     star.position.y =  starEl.getAttribute('y');

     return starEl;
}

function createBrick(x, y, width, height){
	var b = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
			//brick = new Rect(x, y, width, height);
			b.setAttribute('x', x);
			b.setAttribute('y', y);
			b.setAttribute('width', width);
			b.setAttribute('height', height);
			b.setAttribute('class','brick');
			b.setAttribute('rx', 20);
			b.setAttribute('ry', 20);
			b.style.fill = "url(#HappySmile)";
	return b;			
}

function getMessageBGScreen(){
	var MessageBGScreen = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	MessageBGScreen.setAttribute('class', 'popUpScreen')
	MessageBGScreen.setAttribute('x', 220);
	MessageBGScreen.setAttribute('y', 170);
	MessageBGScreen.setAttribute('width', 400);
	MessageBGScreen.setAttribute('height', 200);
	return MessageBGScreen;
}

function createMessage(msg){
	var message = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	message.setAttribute('x', 340);
	message.setAttribute('y', 270);
	message.setAttribute('width', 400);
	message.setAttribute('height', 200);
	message.setAttribute('class', "message");
	message.textContent = msg;
	return message;
}

function createInfoMessage(infoMsg){
	var message = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	message.setAttribute('x', 340);
	message.setAttribute('y', 300);
	message.setAttribute('width', 400);
	message.setAttribute('height', 200);
	message.setAttribute('class', "infoMessage");
	message.textContent = infoMsg;
	return message;
}