/* Game Class */
// Create a constructor to store the game variables
var Game = function () {
    this.gameOver = false;
    this.gameWin = false;
};

// Enemy constructor
var Enemy = function (x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Enemy position
    this.x = x;
    this.y = y;

    // Speed multiplier for enemy using random number between 1 & 5
    this.multiplier = Math.floor((Math.random() * 5) + 1);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    // Set the position of the enemy based on dt and speed multiplier
    this.x = this.x + 101 * dt * this.multiplier;

    // Check for collision with the player
    if (this.y == player.y && (this.x > player.x - 20 && this.x < player.x + 20)) {

        // player has encountered an enemy and loses a life
        player.lives--;
        document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + player.lives;

        // Check if player has any lives
        if (player.lives === 0) {
            // Player has no lives, hence game over image is shown
            game.gameOver = true;

        } else {
            // Player has lives, check if player is holding a gem
            if (player.hold === true) {
                // Player is holding a gem, so find out which one and reset it to the original position
                allGem[player.gemIdx].reset();

            }

            // Reset the player to original position
            player.reset();
        }
    }
    // If the enemy goes off the board, reset game
    if (this.x > 750) {
        this.reset();
    }
};


// Reset the enemy to the left of the board with a new y position
// and a new speed multiplier
Enemy.prototype.reset = function () {
    this.x = -200;
    var yV = [220, 140, 60];
    this.y = yV[Math.floor((Math.random() * 3))];
    this.multiplier = Math.floor((Math.random() * 6) + 1);

};

// Render the enemy to the canvas
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/*
 * My Player Class
 */

// Player constructor
var Player = function (x, y) {

    // Set the player to the boy image
    this.sprite = "images/char-boy.png";

    // Player location
    this.x = x;
    this.y = y;

    // Give the player 5 lives at game start
    this.lives = 5;

    // Store original position of the player for resetting
    this.xo = x;
    this.yo = y;

    // Set variables related to the gems
    this.hold = false; // player not holding gem
    this.color = undefined; // color of gem held

    // Setting index when player holds a gem in the allGem array
    this.gemIdx = undefined;

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

Player.prototype.handleInput = function (dir) {

    // Change the player's position based on the user keyboard input
    if (dir == 'up') {
        this.y = this.y - 80;
    } else if (dir == 'down') {
        this.y = this.y + 80;
    } else if (dir == 'left') {
        this.x = this.x - 101;
    } else if (dir == 'right') {
        this.x = this.x + 101;
    }

    // Check the position of the player
    if (this.x < 0) {
        // Player is off to the left side of the board, move the player
        // back to zero
        this.x = 0;

    } else if (this.x > 606) {
        // Player is off to the right side of the board, move the player
        // back to the right-most square (606)
        this.x = 606;

    } else if (this.y > 404) {
        // Player is off the bottom of the board
        // Reset player & gem (if the player is holding one)
        if (player.hold === true) {
            allGem[player.gemIdx].reset();
        }
        this.reset();

    } else if (this.y <= -20 && this.x > 0 && this.x < 606) {
        // Player has made it to the top colored blocks
        // Check to see if the block is the right color for the gem
        // If it is, put the gem on the block
        if (this.hold === true) {
            if (this.color === 'red' && this.x === 101) {
                allGem[0].x = 101;
                allGem[0].y = 35;
            } else if (this.color === 'orange' && this.x === 202) {
                allGem[1].x = 202;
                allGem[1].y = 35;
            } else if (this.color === 'green' && this.x === 303) {
                allGem[2].x = 303;
                allGem[2].y = 35;
            } else if (this.color === 'blue' && this.x === 404) {
                allGem[3].x = 404;
                allGem[3].y = 35;
            } else if (this.color === 'purple' && this.x === 505) {
                allGem[4].x = 505;
                allGem[4].y = 35;
            } else {

                // Gem did not match the color, so reset the gem
                allGem[player.gemIdx].reset();
            }
        }

        // Check to see if the player has won the game
        var win = true;
        for (var w = 0; w < winPositions.length; w++) {
            if (allGem[w].x === winPositions[w][0] && allGem[w].y === winPositions[w][1]) {
                // Gem is in the winning position, do nothing
            } else {
                // Set the win flag to false
                win = false;
            }
        }

        // If the player has won, display the game winning image
        if (win) {
            game.gameWin = true;
        }

        // Reset the player to his original location & image
        this.reset();

    } else if (this.y <= -20 && (this.x === 0 || this.x === 606)) {
        // Player made it to one of the two water blocks

        // Check to see if the player is holding a gem
        if (player.hold === true) {
            // Player is holding a gem, so find out which gem and
            // reset it to its original position
            allGem[player.gemIdx].reset();
        }

        // Lose a life and reset the player
        this.lives--;
        if (this.lives === 0) {
            // Player has no more lives left, show the game over image
            game.gameOver = true;
        } else {
            // Player still has lives left so update the lives and reset the player
            document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + this.lives;
            this.reset();
        }
    }
};

// Reset the player to his original position & image
Player.prototype.reset = function () {
    // Reset the player to the original position
    this.x = this.xo;
    this.y = this.yo;

    // Reset the image
    this.sprite = 'images/char-boy.png';

    // Reset the defauts for holding gem
    this.hold = false;
    this.color = undefined;
    this.gemIdx = undefined;
};

// Update the player's position
Player.prototype.update = function () {
    this.x = this.x;
    this.y = this.y;
};

// Render the player to the canvas
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * GEM CLASS
 */

// Create the Gem constructor
var Gem = function (color, x, y) {

    // Set the color of the gem
    this.color = color;
    // Set the image based on the color
    this.sprite = 'images/gem-' + color + '.png';

    // Set the starting position of the gem
    this.x = x;
    this.y = y;

    // Set the original position of the gem
    // This does not change throughout one game
    this.xo = x;
    this.yo = y;
};

// Reset the gem to its original position
Gem.prototype.reset = function () {
    this.x = this.xo;
    this.y = this.yo;
};

// Updates the gem's location if the player picks it up
Gem.prototype.update = function () {
    if (this.y === player.y + 65 && this.x === player.x && player.hold === false) {

        // Change the player's sprite to be the boy 'holding' the correct color gem
        player.sprite = 'images/char-boy-' + this.color + '-gem.png';

        player.hold = true; // player is now holding a gem
        player.color = this.color; // player's color matches the gem's color
        player.gemIdx = gemIndex(this.color); // Index of currently held gem in allGem

        // Move the gem sprite to off of the grid so it isn't visible
        this.x = -100;
        this.y = -100;
    }
};

// Renders the gem to the canvas
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * FUNCTIONS
 */

// Determine the index of a gem in the allGem array
// based on the color of the gem
var gemIndex = function (color) {
    if (color === 'red') {
        return 0;
    } else if (color === 'orange') {
        return 1;
    } else if (color === 'green') {
        return 2;
    } else if (color === 'blue') {
        return 3;
    } else if (color === 'purple') {
        return 4;
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*
 * INSTANTIATE OBJECTS
 */

// -- Instantiate the enemies --

// Create the allEnemies array, which will hold all of the
// enemy objects
var allEnemies = [];
// Set a varaiable for the possible y values
var yV = [220, 140, 60];

// Create the separate enemy instances
for (var i = 0; i < 5; i++) {

    // Set a starting x-position based on a random value
    var x = Math.floor((Math.random() * -1000) + 1);

    // Set a starting y-position based on a random selection
    // of the 3 possible values
    var y = yV[Math.floor(Math.random() * 3)];

    // Create the new enemy object
    var enemy = new Enemy(x, y);

    // Push the enemy into the array
    allEnemies.push(enemy);
}

// -- Instantiate the player --
var player = new Player(303, 380);

// -- Instantiate the Gem --

// Set up the possible colors, x-values, and y-values
var colors = ['red', 'orange', 'green', 'blue', 'purple'];
var xV = [0, 101, 202, 303, 404, 505, 606];
var yVGem = [285, 205, 125];

// Create a variable for all the possible xy locations
// This will be used to ensure only one gem occupies
// each possible spot
var xyLocations = [];

// Look through the x & y values and push each location pair
// into the xyLocations array
for (var l = 0; l < xV.length; l++) {
    for (var n = 0; n < yVGem.length; n++) {
        xyLocations.push([xV[l], yVGem[n]]);

    }
}

// Create the allKitties array, which will hold all of the
// gem objects
var allGem = [];

// Create the separate gem instances
for (var j = 0; j < 5; j++) {

    // Select a random starting location for the gem
    var index = Math.floor(Math.random() * (21 - j));
    var xy = xyLocations[index];
    var x = xy[0];
    var y = xy[1];

    // Create the new gem object
    var gem = new Gem(colors[j], x, y);

    // Push the new gem into the array
    allGem.push(gem);

    // Remove the xy pair from the array
    xyLocations.splice(index, 1);
}

// Set up the winning positions of the gem
var winPositions = [
    [101, 35],
    [202, 35],
    [303, 35],
    [404, 35],
    [505, 35]
];

// -- Instantiate the game --
var game = new Game();
