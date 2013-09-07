var width = 1280;
var height = 700;

function Game(canvasId, width, height) {
    this.canvas = $(canvasId);
    this.ctx = this.canvas[0].getContext("2d");
    this.canvas.attr("width", width);
    this.canvas.attr("height", height);

    // Score
    this.ctx.fillStyle = "rgb(250, 250, 250)";
    this.ctx.font = "24px Helvetica";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    // refactor this so that each Player sets it's own location on reset.
    this.reset = function () {
        hero.reset();
    };

    this.drawImage = function (img, x, y) {
        this.ctx.drawImage(img.image, x, y);
    };

    this.drawPlayer = function (player) {
        this.drawImage(player.img, player.x, player.y);
    }
}

function Player(pps, x, y, img) {
    var player = this;
    this.speed = pps;
    this.normalSpeed = pps;
    this.turbo = pps * 6;
    this.x = x;
    this.y = y;
    this.img = new GameImage(img);

    this.reset = function () {
        this.x = x;
        this.y = y;
    };

    function Move(type, action) {
        this.image = new Image();
        this.image.src = "images/p1_" + type + ".gif";
        this.action = action;

        this.execute = function () {
            this.action();
        }
    }

    this.moves = {};
    this.moves.up = new Move("up", function () {
        player.y -= player.speed * window.modifier;
    });
    this.moves.down = new Move("down", function () {
        player.y += player.speed * window.modifier;
    });
    this.moves.left = new Move("left", function () {
        player.x -= player.speed * window.modifier;
    });
    this.moves.right = new Move("right", function () {
        player.x += player.speed * window.modifier;
    });

    this.go = function (where) {
        if (16 in keysDown) { // Player holding shift
            this.speed = this.turbo;
        } else {
            this.speed = this.normalSpeed;
        }
        var move = this.moves[where];
        if (this.img.image.src.indexOf(move.image.src) < 0) {
            this.img.image = move.image;
        }
        move.execute();
    }
}

function GameImage(src) {
    var parent = this;
    this.ready = false;
    this.image = new Image();
    this.image.onload = function () {
        parent.ready = true;
    };
    this.image.src = src;
}

var game = new Game("#tank-canvas", width, height);
var bgImage = new GameImage("images/background.jpg");

// Game objects
var players = [];
var hero = new Player(100, 100, 150, "images/p1_up.gif");
players.push(hero);

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function () {
    if (38 in keysDown) { // Player holding up
        hero.go("up");
    }
    if (40 in keysDown) { // Player holding down
        hero.go("down");
    }
    if (37 in keysDown) { // Player holding left
        hero.go("left");
    }
    if (39 in keysDown) { // Player holding right
        hero.go("right");
    }
};

// Draw everything
var render = function () {
    if (bgImage.ready) {
        game.drawImage(bgImage, 0, 0);
    }
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.img.ready) {
            game.drawPlayer(player);
        }
    }
};

// The main game loop
var main = function () {
    window.now = Date.now();
    window.delta = now - then;
    window.modifier = delta / 1000;

    update();
    render();

    window.then = window.now;
};


// Let's play this game!
game.reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/