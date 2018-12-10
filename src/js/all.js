/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
    var resourceCache = {};
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather than
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

"use strict";

// my highscore is 8 at width of 5 columns tho...
// 16 on 10 columns
var scoreBoardDOM = document.getElementById('scoreboard');
var highScoreDOM = document.getElementById('highscore');
var currentLevelDOM = document.getElementById('current-level');
var canvasWidth = 909;
var canvasHeight = 772;
var startingPositionX = canvasWidth / 2 - 52.5;
var numberOfEnemies = 6;
var minEnemySpeed = 60;
var maxEnemySpeed = 200;
var currentLevel = 1;
var highScore = 0; // Enemies our player must avoid

var Enemy = function Enemy(y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = random(0, canvasWidth); // horizontal location

  this.y = y; // vertical location

  this.speed = random(minEnemySpeed, maxEnemySpeed); //random speed between certain mubers that increae per round
}; // Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks


Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  speed = this.speed * dt;
  this.x = this.x + speed;

  if (this.x > canvasWidth + 50) {
    this.x = -100;
  }
}; // Draw the enemy on the screen, required method for game


Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}; // Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


var Player = function Player(y) {
  this.sprite = 'images/Rock.png';
  this.moveDistanceY = 83;
  this.moveDistanceX = 101;
  this.x = startingPositionX;
  this.y = y;
};

Player.prototype.update = function () {
  // constantly check for collisions between enemy and current player
  // by looping through all the enemies and seeing if they are touching 
  // current player
  enemies.forEach(function (enemy) {
    if (currentPlayer.x - 41 < enemy.x + 47 && currentPlayer.y == enemy.y && currentPlayer.x + 41 > enemy.x - 41) {
      // reset everything if there is a collision
      currentPlayer.x = startingPositionX;
      currentPlayer.y = 561;
      maxEnemySpeed = 200;
      minEnemySpeed = 60;
      resetEnemies(); // if new high score then set that as new highscore

      if (currentLevel > highScore) {
        highScore = currentLevel;
        highScoreDOM.innerHTML = "High Score: ".concat(highScore);
      } // reset current level to 1


      currentLevel = 1;
      currentLevelDOM.innerHTML = "Level: ".concat(currentLevel);
    }
  });
}; // draws image where it should be


Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}; // control character with allowed input keys


Player.prototype.handleInput = function (key) {
  if (key === 'up') {
    this.y = this.y - this.moveDistanceY;
  }

  if (key === 'down') {
    // check if character is not already all the way at the bottom
    if (this.y + this.moveDistanceY < 571) {
      this.y = this.y + this.moveDistanceY;
    }
  }

  if (key === 'left') {
    // check if character is not already all the way left
    if (this.x - this.moveDistanceX > -25) {
      this.x = this.x - this.moveDistanceX;
    }
  }

  if (key === 'right') {
    // check if character is not already all the way right
    if (this.x + this.moveDistanceX < canvasWidth - 50) {
      this.x = this.x + this.moveDistanceX;
    }
  } // if player wins/enters portal then reset player and enemies


  if (this.y < 0) {
    // give enemies a higher min and max speed
    minEnemySpeed = minEnemySpeed + 25;
    maxEnemySpeed = maxEnemySpeed + 50; // puts player back at start

    this.x = startingPositionX;
    this.y = 561;
    resetEnemies(); // go to next level... or at least set current level to 2

    currentLevel++;
    currentLevelDOM.innerHTML = "Level: ".concat(currentLevel);
  }
}; // Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var enemies = [];
var yPosition = 63;

for (i = 0; i < numberOfEnemies; i++) {
  enemies.push(new Enemy(yPosition));
  yPosition = yPosition + 83;
}

var player = new Player(561);
var currentPlayer = player; // This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keydown', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
}); // my random function which gives me a random number between the min and the max

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min) + min);
  return num;
} // loop through all enemies and reset there location and speed


function resetEnemies() {
  enemies.forEach(function (enemy) {
    // new random speed within min and max speed
    enemy.speed = random(minEnemySpeed, maxEnemySpeed); // give enemy a random location across their row

    enemy.x = random(-50, canvasWidth);
  });
}
/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        allEnemies = enemies,
        player = currentPlayer;

    canvas.width = 909;
    canvas.height = 772;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block1.png',   // Top row is water
                'images/stone-block1.png',   // Row 1 of 3 of stone
                'images/stone-block1.png',   // Row 2 of 3 of stone
                'images/stone-block1.png',   // Row 3 of 3 of stone
                'images/stone-block1.png',   // Row 1 of 2 of grass
                'images/stone-block1.png',   // Row 1 of 2 of grass
                'images/stone-block1.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 8,
            numCols = 9,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        currentLevel = 1;
        currentLevelDOM.innerHTML = `Level: ${currentLevel}`;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block1.png',
        'images/water-block1.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Rock.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
