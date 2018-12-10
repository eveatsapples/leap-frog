// my highscore is 8 at width of 5 columns tho...
// 16 on 10 columns

const scoreBoardDOM = document.getElementById('scoreboard');
const highScoreDOM = document.getElementById('highscore');
const currentLevelDOM = document.getElementById('current-level');

const canvasWidth = 909;
const canvasHeight = 772;
const startingPositionX = canvasWidth/2 - 52.5;

let numberOfEnemies = 6;
let minEnemySpeed = 60;
let maxEnemySpeed = 200;

let currentLevel = 1;
let highScore = 0;

// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = random(0, canvasWidth); // horizontal location
    this.y = y // vertical location
    this.speed = random(minEnemySpeed, maxEnemySpeed);//random speed between certain mubers that increae per round
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    speed = this.speed * dt;
    this.x = this.x + speed;
    if(this.x > (canvasWidth + 50)) {
        this.x = -100;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
const Player = function(y) {
    this.sprite = 'images/Rock.png';
    this.moveDistanceY = 83;
    this.moveDistanceX = 101;
    this.x = startingPositionX;
    this.y = y;
}

Player.prototype.update = function() {
    // constantly check for collisions between enemy and current player
    // by looping through all the enemies and seeing if they are touching 
    // current player
    enemies.forEach(function(enemy) {
        if((currentPlayer.x - 41 < enemy.x + 47) && (currentPlayer.y == enemy.y) && (currentPlayer.x + 41 > enemy.x - 41)) {
            
            // reset everything if there is a collision
            currentPlayer.x = startingPositionX;
            currentPlayer.y = 561;
            maxEnemySpeed = 200;
            minEnemySpeed = 60;
            
            resetEnemies();
            
            // if new high score then set that as new highscore
            if(currentLevel > highScore) {
                highScore = currentLevel;
                highScoreDOM.innerHTML = `High Score: ${highScore}`;
            }
            
            // reset current level to 1
            currentLevel = 1;
            currentLevelDOM.innerHTML = `Level: ${currentLevel}`;

        }
    });
}

// draws image where it should be
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}

// control character with allowed input keys
Player.prototype.handleInput = function(key) {
    
    if(key === 'up') {
        this.y = this.y - this.moveDistanceY;
    }

    if(key === 'down') {
        // check if character is not already all the way at the bottom
        if(this.y + this.moveDistanceY < 571) {
            this.y = this.y + this.moveDistanceY
        }
    }

    if(key === 'left') {
        // check if character is not already all the way left
        if(this.x - this.moveDistanceX > -25) {
            this.x = this.x - this.moveDistanceX
        }
    }

    if(key === 'right') {
        // check if character is not already all the way right
        if(this.x + this.moveDistanceX < (canvasWidth - 50)) {
            this.x = this.x + this.moveDistanceX;
        }
    }
    
    // if player wins/enters portal then reset player and enemies
    if (this.y < 0) {
        // give enemies a higher min and max speed
        minEnemySpeed = minEnemySpeed + 25;
        maxEnemySpeed = maxEnemySpeed + 50;

        // puts player back at start
        this.x = startingPositionX;
        this.y = 561;
        resetEnemies();

        // go to next level... or at least set current level to 2
        currentLevel++;
        currentLevelDOM.innerHTML = `Level: ${currentLevel}`;
        
    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let enemies = [];
let yPosition = 63;
for(i = 0; i < numberOfEnemies; i++) {
    enemies.push(new Enemy(yPosition));
    yPosition = yPosition + 83;
}

const player = new Player(561); 
let currentPlayer = player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// my random function which gives me a random number between the min and the max
function random(min, max) {
    var num = Math.floor(Math.random() * (max - min) + min);
    return num;
}


// loop through all enemies and reset there location and speed
function resetEnemies() {
    enemies.forEach(function(enemy) {
        // new random speed within min and max speed
        enemy.speed = random(minEnemySpeed, maxEnemySpeed);
        // give enemy a random location across their row
        enemy.x = random(-50, canvasWidth);
    });
}
