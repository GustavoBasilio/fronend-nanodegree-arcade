
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
        if (this.speed > 0){
          this.x += this.speed*dt+player.score.level;
        }
        if(this.x > canvasSchema.width){
            this.status = 0;
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemies our player must avoid, send type of the eneby in the parameter
var Gem = function(type) {
    var typeSheet = {
        blue: {
            path: 'images/Gem Blue.png',
            value: 5,
            speed: 0,
            x: (Math.floor(Math.random()*5))*canvasSchema.blockWidth,
            y: (Math.floor(Math.random()*3)+2)*canvasSchema.blockHeight-30
        },
        green: {
            path: 'images/Gem Green.png',
            value: 20,
            speed: 0,
            x: (Math.floor(Math.random()*5))*canvasSchema.blockWidth,
            y: (Math.floor(Math.random()*3)+2)*canvasSchema.blockHeight-30
        },
        orange: {
            path: 'images/Gem Orange.png',
            value: 50,
            speed: 0,
            x: (Math.floor(Math.random()*5))*canvasSchema.blockWidth,
            y: (Math.floor(Math.random()*3)+2)*canvasSchema.blockHeight-30
        }
    };
    this.type = type;
    this.value = typeSheet[this.type].value;
    this.x = typeSheet[this.type].x;
    this.y = typeSheet[this.type].y;
    this.sprite = typeSheet[this.type].path;
    this.speed = typeSheet[this.type].speed;
    this.status = 1;
};


Gem.prototype.update = function  (){

}

Gem.prototype.render = function  (){
    ctx.drawImage(Resources.get(this.sprite), this.x+20, this.y-20,60,80);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = canvasSchema.blockWidth * 2;
    this.y = canvasSchema.blockHeight * 5 - 30;
    this.status = 0;
    this.char = [
        'images/char-boy.png',
        'images/char-horn-girl.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    this.sprite = this.char[0];
    this.score = {
        points: 0,
        level: 1,
        lifes: 3,
        startTime: new Date(),
        endTime: new Date()
    }
}

Player.prototype.update = function(dt) {
    if(this.score.lifes === 0 && this.status == 1){
        this.status = 2;
        this.score.endTime = new Date();
    }
    if(this.status == 1 && this.y == -30 ){
        this.x = new Player().x;
        this.y = new Player().y;
        this.score.points += 10;
        this.score.level += 1;
        allGems = [];
        allEnemies = allEnemies.filter((enemy) => {
          if(enemy.type == "rock") return false;
          return true;
        });
        var rarity = [
          {name: "blue",weigth:10},
          {name: "green",weigth:5+player.score.level},
          {name: "orange",weigth:1+Math.ceil(player.score.level*1.5)}
        ], arrayOds = [];
        rarity.map((gem) => {
          for(var i = 0;i<gem.weigth;i++){
            arrayOds.push(gem.name);
          }
        });
        for (var i = 0; i < Math.floor(Math.random()*2)+1; i++) {
          type = arrayOds[Math.floor(Math.random()*(arrayOds.length))];
          allGems.push(new Gem(type));
        }
        for (var i = 0; i < Math.floor(Math.random()*2)+1; i++) {
          allEnemies.push(new Enemy("rock"));
        }
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

//Transform milliseconds in minutes diference string
Player.prototype.visibleTime = function(interval) {
  var minutesDiff = Math.floor(((interval % 86400000) % 3600000) / 60000),
      secondsDiff = Math.floor((interval/1000)%60);
  minutesDiff = (minutesDiff.toString().length === 1) ? "0"+minutesDiff : minutesDiff;
  secondsDiff = (secondsDiff.toString().length === 1) ? "0"+secondsDiff : secondsDiff;
  return minutesDiff+":"+secondsDiff;
}

//Create current game player info
Player.prototype.gameInfo = function (){
    //Create the timer
    var timeDiff = new Date() - this.score.startTime;
    ctx.font = "bold 18pt Courier";
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.fillText(this.visibleTime(timeDiff),canvasSchema.blockWidth*5,30);

    //Life Count
    for(var i=0;i<this.score.lifes;i++){
        ctx.drawImage(Resources.get("images/Heart.png"), canvasSchema.blockWidth*4-20-30*i, -5,30,50);
    }

    //Score count
    ctx.textAlign = "left";
    ctx.fillText("SCORE:"+this.score.points,0,30);

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

    ctx.font = "bold 16pt Courier";
    ctx.textAlign = "left";
    var time = this.score.endTime - this.score.startTime;
    //Estrelas
    var stars = Math.ceil(this.score.points/(time/1000));
    for(var i = 0; i <= stars; i++) {
        if(i<5) {
            ctx.drawImage(Resources.get("images/Star.png"), canvasSchema.blockWidth-25+50*i, canvasSchema.blockHeight*2+40,50,80);
        }
    }
    //Game Info
    ctx.fillText("Tempo: "+this.visibleTime(time),canvasSchema.blockWidth-10,canvasSchema.blockHeight*3.5+15);
    ctx.fillText("Pontos: "+this.score.points,canvasSchema.blockWidth-10,canvasSchema.blockHeight*3.5+40);


    //Create the button
    ctx.fillStyle = "#0084ea";
    ctx.fillRect(canvasSchema.blockWidth*2-10,canvasSchema.blockHeight*4+30,canvasSchema.blockWidth+20,35);
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("NEW GAME",canvasSchema.blockWidth*2.5,canvasSchema.blockHeight*4+55);

    //Charactem sprite
    ctx.drawImage(Resources.get(this.sprite), canvasSchema.blockWidth*3, 35+(canvasSchema.blockHeight+80));
}

//Create the menu layout
Player.prototype.createMenu = function() {
  //If character is not selected
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(canvasSchema.blockWidth*1-50,canvasSchema.blockHeight*1,canvasSchema.blockWidth*3+100,canvasSchema.blockHeight*5);
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
      positionY = event.pageY - this.offsetTop - canvasSchema.marginTop;
  if(player.status == 0){
    player.selectChar(positionX,positionY);
  }else if(player.status == 2) {
    if(positionX > canvasSchema.blockWidth*2 && positionX < canvasSchema.blockWidth*3 && positionY > (canvasSchema.blockHeight*3+30)){
      player = new Player();
      allEnemies = [];
      allGems = [];
    }
  }
}

//Select the clicked character
Player.prototype.selectChar = function(positionX,positionY) {
  //Get he position of the click and the block clicked
  var positionColumn = (Math.floor(positionX/canvasSchema.blockWidth)-1),
      positionRow =(Math.floor(positionY/canvasSchema.blockHeight)-2);
  if(positionX > canvasSchema.blockWidth*2 && positionX < canvasSchema.blockWidth*3 && positionY > (canvasSchema.blockHeight*5+15 -  canvasSchema.marginTop) && positionY < (canvasSchema.blockHeight*+40 -  canvasSchema.marginTop)) {
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

//Move the player
Player.prototype.moveSelection = function(key){
    var sprite = this.sprite,
        currentChar = 0;
    this.char.forEach((item,index) => {
        if(sprite === item){
            currentChar = index;
        }
    });
    switch (key){
        case 'left':
            if(currentChar%3 != 0){
               this.sprite = this.char[currentChar-1];
            }
        break;
        case 'right':
            if(currentChar != 2 && currentChar != this.char.length-1){
               this.sprite = this.char[currentChar+1];
            }
        break;
        case 'up':
            if(currentChar >= 3){
               this.sprite = this.char[currentChar-3];
            }
        break;
        case 'down':
            if(currentChar < 2){
               this.sprite = this.char[currentChar+3];
            }
        break;
        case 'enter':
            if(this.sprite != "") {
                this.status = 1;
            }
        break;
    }
}

//Handle the keyboard inputs
Player.prototype.handleInput = function(key) {
  if(player.status == 1){
      player.move(key);
  }else if(player.status == 0){
      player.moveSelection(key);
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
var allEnemies = [],
    allGems = [];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
