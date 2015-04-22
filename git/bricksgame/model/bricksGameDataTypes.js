
function Rect(x,y,width,height){
	this.position = {
		x : x || 0,
		y : y || 0
	};
	this.dimensions = {
		width : width || 0,
		height : height || 0
	};
}

function Vector2(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

function Circle(cx, cy,r){
	this.position = new Vector2(cx,cy);
	this.radius = r || 0;
}

//ball extends circle and have additional propery named velocity
function Ball(){
	this.velocity = new Vector2();
}
Ball.prototype = new Circle();

function Star(){
	this.position = new Vector2();
	this.display = "none";
}


function Brick(){
	Rect.apply(this, arguments);
	this.type = "normal";
	this.isDead = false;
	this.destroy = function(){
		this.isDead = true;
		//callback();
	}
}
Brick.prototype = new Rect();


function AudioManager(){
	this.playClip =  function(clip,volume){
		clip.volume = volume || 0.6;
		if(!clip.paused){
			clip.pause();
			clip.currentTime = 0;
		}
		clip.play();
	}
}

function GameState(score, life, time, paddle, ball){
		this.score = score;
		this.life = life,
		this.time = time,
		this.ballPosition = {
				x : ball.position.x,
				y : ball.position.y
		};
		this.paddlePosition = {
				x : paddle.position.x,
				y : paddle.position.y
		};
}

function Game(){
	this.initialState;
	this.paused = false;
}

Game.prototype.pause = function(paused){
	brickGameView.playWhenGameIsPaused();
	this.paused = paused;
}
Game.prototype.restart = function(){
	location.reload();
}

Game.prototype.resetBallAndPaddle = function(paddle, ball){
	ball.position.x = game.initialState.ballPosition.x;
	ball.position.y = game.initialState.ballPosition.y;
	brickGameView.updateBall(ball);
	ball.velocity = new Vector2(ballVelocity.x , ballVelocity.y);

	paddle.position.x = game.initialState.paddlePosition.x;
	paddle.position.y = game.initialState.paddlePosition.y;

	brickGameView.updatePaddle(paddle);
}

var leftWall = new Rect();
var rightWall = new Rect();
var topWall = new Rect();
var paddle = new Rect();
var ball = new Ball();
var star = new Star();
var bricksContainer = [[]];
var score = 0;
var seconds = 0;
//var bricks = [[]];
var chances = 3;
//var lifeEl;
var game;
//var numberOfSplBricks = 4;
//var svgEl;
//var paddle;
var paddleSpeed = 40;
//var ball;


//bounding box for ball
var maxX = 800;
var minX = 80;
var maxY = 610;
var minY = 70;
var frameRate = 100;
var ballVelocity = new Vector2(20, -30);
var gridSize = 6;
var isGameStarted = false;
var isGameOver = false;
var deadBrickCount = 0;

//for stars display
//var starEl;
var starDisplayInterval = 500;//in milli-seconds
var brickFallInterval = 1000;
var brickFallDestVal = 200;//in px/frame
var numberOfSplBricks = 4;