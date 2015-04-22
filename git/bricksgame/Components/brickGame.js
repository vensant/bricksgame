document.addEventListener("DOMContentLoaded", function(event) { 
	
	game = new Game();
	game.initialState = new GameState(score, life, time, paddle, ball);
	//alert("Press enter to start the Game!");
	brickGameView.showStartupScreen();
});

document.addEventListener("keydown",checkForControls, false);

function timer(){
	if(!game.paused){
		seconds++;
		brickGameView.updateTime(seconds);
	}
	if(isGameStarted)
		setTimeout(timer, 1000);
}

function checkForControls(event){
	//console.log("being called");
	switch(event.keyCode){
		case 37 :
		    movePaddle('left');
		    
		   break;
	   case 39 : 
		   movePaddle('right');
	   		break;
	   case 80 :
		   game.pause(!game.paused);
		   if(!game.paused){
		   		brickGameView.disableMessageWindow();
		   }
		   else
		   	brickGameView.showPauseScreen();
		   break;
	   case 13 : 
	   		if(!game.paused)
	   			brickGameView.disableMessageWindow();
	   		if(!isGameStarted){
	   			isGameStarted = true;
		   		moveBall();
		   		timer();
		   	}
		   	if(isGameOver)
		   		game.restart();
	   		break;
	}
}

function displayStars(x, y){
	star.position.x = x;
	star.position.y = y;
	star.display = "block";
	brickGameView.updateStars(star);
	setTimeout(disableStars,starDisplayInterval);
}
function disableStars(){
	star.display = "none";
	brickGameView.updateStars(star);
}

function movePaddle(direction){
	if(!game.paused && isGameStarted){
		switch (direction){
		case 'left':
			paddle.position.x -= paddleSpeed;
			paddle.position.x = clamp(paddle.position.x, 80, 760);
			brickGameView.updatePaddle(paddle);
			break;
			
		case 'right':
			paddle.position.x += paddleSpeed;
			paddle.position.x = clamp(paddle.position.x, 80, 630);
			brickGameView.updatePaddle(paddle);
			break;
		}		
	}
}

function clamp(val, min, max){
	max = max || 630;
	min = min || 80;
    return Math.max(min, Math.min(max, val))
}

function moveBall(){
	if(!game.paused){
		ball.position.x = ball.position.x+ball.velocity.x;
		ball.position.y = ball.position.y+ball.velocity.y;
		ball.position.x = clamp(ball.position.x, minX, maxX);
		ball.position.y = clamp(ball.position.y, minY, maxY);
		brickGameView.updateBall(ball);
		checkCollisionWithWalls(ball.position.x, ball.position.y, ball.radius, "#leftWall",leftWall);
		checkCollisionWithWalls(ball.position.x, ball.position.y, ball.radius, "#topWall",topWall);
		checkCollisionWithWalls(ball.position.x, ball.position.y, ball.radius, "#rightWall",rightWall);
		checkCollisionWithWalls(ball.position.x, ball.position.y, ball.radius, "#paddle",paddle);
		checkCollisionWithBrick(ball.position.x, ball.position.y, ball.radius);
		checkGameOver();
	}
	if(isGameStarted)
		setTimeout(moveBall, frameRate);

}

function checkGameOver(){
	if(deadBrickCount == gridSize * gridSize){				
		brickGameView.playWhenGameIsWon();
		brickGameView.showWinningScreen();
		isGameOver = true;
		isGameStarted = false;
		return;
	}
	var ballcY = ball.position.y;
	var paddleY = paddle.position.y;
	var paddleHeight = paddle.dimensions.height;
	if(ballcY >= paddleY + paddleHeight){
		chances--;
		brickGameView.updateChances(chances);
		if(chances <= 0){
			brickGameView.playWhenGameOver();
			brickGameView.showGameOverScreen();
			isGameOver = true;
			isGameStarted = false;
		}
		else{
			brickGameView.playWhenChanceIsLost();
			brickGameView.showLostChanceScreen();
			game.resetBallAndPaddle(paddle,ball);
			isGameStarted = false;
		}
	}
}

function checkCollisionWithWalls(ballcx,ballcy,ballRadius,wallID,wall){
	var recX = wall.position.x;
	var recY = wall.position.y;
	var recWidth = wall.dimensions.width;
	var recHeight = wall.dimensions.height;
	var isXTrue = (ballcx + 2 * ballRadius  > recX && ballcx  - 2 * ballRadius <= recX + recWidth);
	var isYTrue = (ballcy  + 2 * ballRadius > recY && ballcy - 2 * ballRadius <= recY + recHeight);
	if( isXTrue && isYTrue){
		brickGameView.onWallCollisionSound();
		switch(wallID){
			case "#leftWall" :
				ball.velocity.x = Math.abs(ball.velocity.x);
				break;
			case "#rightWall" :
				ball.velocity.x = -Math.abs(ball.velocity.x);
			break;
			case "#topWall" :
				ball.velocity.y = Math.abs(ball.velocity.y);
			break;
			case "#paddle" :
				var randomVar = Math.random();
				var xRandom = clamp(randomVar* 30, 20, 30);
				if(xRandom > 0.5)
					xRandom =  ball.velocity.x > 0 ? -xRandom : xRandom;
				else
					xRandom =  ball.velocity.x < 0 ? -xRandom : xRandom;
				ball.velocity.x = xRandom;
				ball.velocity.y = -clamp(Math.random() * 30, 20 , 30);
			break;
		}
	}
}
//will parse through all the bricks and check if any one is colliding with ball
function checkCollisionWithBrick(ballcx,ballcy,ballRadius){
	var bricksAlive = 0;
	for(var i = 0; i < gridSize; i++){
		for(var j = 0; j < gridSize; j++){
			if(!bricksContainer[i][j].isDead){
				bricksAlive++;
				var  recX = bricksContainer[i][j].position.x;
				var  recY = bricksContainer[i][j].position.y;
				var  recWidth = bricksContainer[i][j].dimensions.width;
				var  recHeight = bricksContainer[i][j].dimensions.height;
				var isXTrue = (ballcx + ballRadius  > recX && ballcx  - ballRadius <= recX + recWidth);
				var isYTrue = (ballcy  + ballRadius > recY && ballcy - ballRadius <= recY + recHeight);
				if( isXTrue && isYTrue){
					brickGameView.destroyBrick(i, j, bricksContainer[i][j].type == "special");
					bricksContainer[i][j].destroy();
					var points = 10;
					if(bricksContainer[i][j].type == "special")
						points = 30;
					score += points;
					displayStars(bricksContainer[i][j].position.x, bricksContainer[i][j].position.y);
					brickGameView.updateScore(score);
					ball.velocity.y = - ball.velocity.y;
					deadBrickCount++;
				}
			}
		}
	}
}