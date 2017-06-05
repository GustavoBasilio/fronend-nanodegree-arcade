// Enemies our player must avoid, send type of the eneby in the parameter
var Enemy = function(type) {
    // Variables applied to each of our instances go here
    var typeSheet = {
        bug: {
            path: 'images/enemy-bug.png',
            speed: 50,
            x: 0,
            y: (Math.floor(Math.random()*3)+1)*canvasSchema.blockHeight-30
        },
        rock: {
            path: 'images/enemy-bug.png',
            speed: 0,
            x: (Math.floor(Math.random()*5))*canvasSchema.blockWidth,
            y: (Math.floor(Math.random()*3)+1)*canvasSchema.blockHeight-30
        }
    };
    this.type = type;
    this.x = typeSheet[this.type].x;
    this.y = typeSheet[this.type].y;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = typeSheet[this.type].path;
    this.speed = typeSheet[this.type].speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = canvasSchema.blockWidth * 2;
    this.y = canvasSchema.blockHeight * 5 - 30;
    this.sprite = "images/char-boy.png";
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    switch (key){
        case 'left':
            if(player.x - canvasSchema.blockWidth >= 0){
                player.x -= canvasSchema.blockWidth;
            }
        break;
        case 'right':
            if(player.x + canvasSchema.blockWidth < canvasSchema.width){
                player.x += canvasSchema.blockWidth;
            }
        break;
        case 'up':
            if(player.y - canvasSchema.blockHeight >= -canvasSchema.marginTop){
                player.y -= canvasSchema.blockHeight;
            }
        break;
        case 'down':
            if(player.y + canvasSchema.blockHeight < canvasSchema.blockHeight*(canvasSchema.numRows-1)){
                player.y += canvasSchema.blockHeight;
            }
        break;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var canvasSchema = {
    width: 505,
    height: 606,
    blockWidth: 101,
    blockHeight: 83,
    marginTop: 50,
    numRows: 6,
    numCols: 5
}
var allEnemies = [new Enemy("bug"),new Enemy("rock")];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
