//Map created for validation
var map = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]    
];

// Enemies our player must avoid, send type of the eneby in the parameter
var Enemy = function(type) {
    // Variables applied to each of our instances go here
    var typeSheet = {
        bug: {
            path: 'images/enemy-bug.png',
            speed: 50,
            x: -canvasSchema.blockWidth,
            y: (Math.floor(Math.random()*3)+1)*canvasSchema.blockHeight-30
        },
        rock: {
            path: 'images/Rock.png',
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
    this.status = 1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.status){
        this.x += this.speed*dt+player.score.level;
        if(this.x > canvasSchema.width){
            this.status = 0;
        }
    }
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
    this.status = 0;
    this.sprite = "";
    this.score = {
        points: 0,
        level: 1,
        lifes: 1,
        startTime: new Date(),
        endTime: new Date()
    }
}

Player.prototype.update = function(dt) {
    if(this.score.lifes === 0 && this.status == 1){
        this.status = 2;
        this.score.endTime = new Date();
    }
}

Player.prototype.render = function(){
  if(this.status === 0) {
    this.createMenu();
  }else if(this.status === 1){
    this.gameInfo();
    this.generateEnemies();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }else if(this.status === 2){
    this.gameOver();
  }
}

//Generate enemies depending on the level
Player.prototype.generateEnemies = function() {
    this.lastRender = this.lastRender ? this.lastRender : new Date(),
        interval = 2500/this.score.level;
    if(new Date() - this.lastRender > interval || allEnemies.length === 0) {
        this.lastRender = new Date();
        allEnemies.push(new Enemy("bug"));
    }
}

//Create current game player info
Player.prototype.gameInfo = function (){
    //Create the timer
    var timeDiff = new Date() - this.score.startTime,
        minutesDiff = Math.floor(((timeDiff % 86400000) % 3600000) / 60000),
        secondsDiff = Math.floor((timeDiff/1000)%60);
    minutesDiff = (minutesDiff.toString().length === 1) ? "0"+minutesDiff : minutesDiff;
    secondsDiff = (secondsDiff.toString().length === 1) ? "0"+secondsDiff : secondsDiff;
    ctx.font = "bold 18pt Courier";
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.fillText(minutesDiff+":"+secondsDiff,canvasSchema.blockWidth*5,30);

    //Life Count
    for(var i=0;i<this.score.lifes;i++){
        ctx.drawImage(Resources.get("images/Heart.png"), canvasSchema.blockWidth*4-20-30*i, -5,30,50);
    }

    //Score count
    ctx.fillText("SCORE:"+this.score.points,canvasSchema.blockWidth*1,30);

    //Level 
    ctx.textAlign = "center";
    ctx.fillText("LEVEL "+this.score.level,canvasSchema.blockWidth*2.5,30);
}

//Create and display Game Over results
Player.prototype.gameOver = function() {
    //Overlay
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(canvasSchema.blockWidth*1-50,canvasSchema.blockHeight*2,canvasSchema.blockWidth*3+100,canvasSchema.blockHeight*3);
    //Title
    ctx.font = "bold 18pt Courier";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("GAME OVER",canvasSchema.blockWidth*2.5,canvasSchema.blockHeight*2.5);
    
    //Charactem sprite
    ctx.drawImage(Resources.get(this.sprite), canvasSchema.blockWidth*3, 35+(canvasSchema.blockHeight+100));
}

//Create the menu layout
Player.prototype.createMenu = function() {
  //If character is not selected
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(canvasSchema.blockWidth*1-50,canvasSchema.blockHeight*1,canvasSchema.blockWidth*3+100,canvasSchema.blockHeight*5);
  this.char = [
    'images/char-boy.png',
    'images/char-horn-girl.png',
    'images/char-cat-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ];
  //Create the title of the menu
  ctx.font = "bold 18pt Courier";
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("CHOOSE YOU CHARACTER",canvasSchema.blockWidth*2.5,canvasSchema.blockHeight+40);
  //Create the button
  ctx.fillStyle = "#0084ea";
  ctx.fillRect(canvasSchema.blockWidth*2,canvasSchema.blockHeight*5+15,canvasSchema.blockWidth,35);
  ctx.font = "bold 16pt Courier";
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("START",canvasSchema.blockWidth*2.5,canvasSchema.blockHeight*5+40);
  //Add the character options
  this.char.forEach(function(url,key){
    if(url === player.sprite){
      ctx.drawImage(Resources.get("images/Selector.png"), canvasSchema.blockWidth*(key%3+1), 35+(canvasSchema.blockHeight+10)*(1+Math.floor(key/3)));
    }
    ctx.drawImage(Resources.get(url), canvasSchema.blockWidth*(key%3+1), 35+(canvasSchema.blockHeight+10)*(1+Math.floor(key/3)));
  });
}

//The Click handler of the canvas
Player.prototype.handleClick = function(event) {
  var positionX = event.pageX - this.offsetLeft,
      positionY = event.pageY - canvas.offsetTop - canvasSchema.marginTop;
  if(player.status == 0){
    player.selectChar(positionX,positionY);
  }
}

//Select the clicked character
Player.prototype.selectChar = function(positionX,positionY) {
  //Get he position of the click and the block clicked
  var positionColumn = (Math.floor(positionX/canvasSchema.blockWidth)-1),
      positionRow =(Math.floor(positionY/canvasSchema.blockHeight)-2);
  if(positionX > canvasSchema.blockWidth*2 && positionY > (canvasSchema.blockHeight*5+15 -  canvasSchema.marginTop)) {
    //Start the game
    if(this.sprite != "" && typeof this.sprite != "undefined"){
        this.score.startTime = new Date();
        this.status = 1;
    }
  }else if(positionRow >= 0 && positionColumn >= 0 && positionColumn < 3){
    //Select the character
    var current = positionColumn + 3*positionRow;
    this.sprite = this.char[current];
  }
}

//Move the player
Player.prototype.move = function(key){
  if(this.status == 1){
    switch (key){
        case 'left':
            if(this.x - canvasSchema.blockWidth >= 0){
                this.x -= canvasSchema.blockWidth;
            }
        break;
        case 'right':
            if(this.x + canvasSchema.blockWidth < canvasSchema.width){
                this.x += canvasSchema.blockWidth;
            }
        break;
        case 'up':
            if(this.y - canvasSchema.blockHeight >= -canvasSchema.marginTop){
                this.y -= canvasSchema.blockHeight;
            }
        break;
        case 'down':
            if(this.y + canvasSchema.blockHeight < canvasSchema.blockHeight*(canvasSchema.numRows-1)){
                this.y += canvasSchema.blockHeight;
            }
        break;
    }
  }
}
//Handle the keyboard inputs
Player.prototype.handleInput = function(key) {
  player.move(key);
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
var allEnemies = [];
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
