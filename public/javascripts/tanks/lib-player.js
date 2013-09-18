function Sprite(id) {
    var self = this;
    self.id = id;
    self.name = "";
    self.height = 0;
    self.width = 0;
    self.x = 0;
    self.y = 0;
    self.xdir = 1;
    self.ydir = 1;
    self.img = false;
    self.flag = 0;
    self.type = "default";
    self.definition = false;

    Engine.Sprite.collection.push(self);  // refactor (more OO)
}

Bullet.prototype = new Sprite();
Bullet.prototype.constructor = Bullet;
function Bullet(startSprite) {
    Sprite.call(this, null);
    var self = this;

    self.type = "fire";
    self.img = Engine.Image.get("player1_fire");
    self.x = startSprite.x;
    self.y = startSprite.y;

    self.spriteOriginatedFrom = $.extend({}, startSprite);
    self.fireSpeed = 20;
    self.xdir = 0;
    self.ydir = 0;
    self.x = self.spriteOriginatedFrom.x + self.spriteOriginatedFrom.xdir;
    self.y = self.spriteOriginatedFrom.y + self.spriteOriginatedFrom.ydir;
    if (self.spriteOriginatedFrom.xdir < 0) self.xdir = -self.fireSpeed;
    if (self.spriteOriginatedFrom.xdir > 0) self.xdir = self.fireSpeed;
    if (self.spriteOriginatedFrom.ydir < 0) self.ydir = -self.fireSpeed;
    if (self.spriteOriginatedFrom.ydir > 0) self.ydir = self.fireSpeed;
    self.definition = self;

    // Key Definitions
    self.run = function () {
        console.log("fire!");
        self.x += self.xdir;
        self.y += self.ydir;
        if (self.x + self.width < 0) self.flag = -1;
        if (self.y + self.height < 0) self.flag = -1;
        if (self.x > Tanks.width) self.flag = -1;
        if (self.y - self.height > Tanks.height) self.flag = -1;

        // Detect Collisions
        var checkList = Engine.Sprite.getSpritesWithType(["tank", "wall"]);
        var ignoreList = [self.spriteOriginatedFrom];
        var collision = Engine.Sprite.collisionCheckSelected(self, checkList, ignoreList);
        if (collision) {
            if (collision.type == "wall") {
                collision.flag = -1;
            }
            Tanks.Sounds.playSound("hitTank");
            self.flag = -1;
        }
    };
}


function Player(id) {
    var self = this;
    self.id = id;
    self.playerDefaultSpeed = 1;
    self.playerSpeed = self.playerDefaultSpeed;
    self.playerTurboSpeed = 10;
    self.fireLauncher = 0;
    self.sprite = new Sprite(id);

    self.sprite.type = "tank";
    self.sprite.definition = this;
    self.sprite.img = window.Engine.Image.get("player1_up");

    self.run = function () {
        if (Engine.Keys.pressing("up")) self.moveUp();
        if (Engine.Keys.pressing("down")) self.moveDown();
        if (Engine.Keys.pressing("left")) self.moveLeft();
        if (Engine.Keys.pressing("right")) self.moveRight();
        if (Engine.Keys.pressing("shift")) self.turbo();
        if (Engine.Keys.depressing("shift")) self.noTurbo();
        if (Engine.Keys.pressing("spacebar")) self.fire();
        if (Engine.Keys.pressing("w")) self.wall();
        if (Engine.Keys.pressing("p")) self.pong();
    };

    self.wall = function () {
        self.fireLauncher++;
        if (self.fireLauncher % 10 == 0) {
            self.wall();
        }
    }
    Player.prototype.fire = function () {
        var self = this;
        self.fireLauncher++;
        if (self.fireLauncher % 5 == 0) {
            Tanks.Sounds.playSound("player1shoot");

            // Create the sprite and definition
            var bullet = new Bullet(self.sprite);
            return bullet;
        }
    };
    Player.prototype.pong = function () {
        self.fireLauncher++;
        if (self.fireLauncher % 10 == 0) {
            Tanks.Sounds.playSound("pongFire");
            var self = this;
            self.spriteOriginatedFrom = $.extend({}, self.sprite);
            self.fireSpeed = 10;
            self.x = self.spriteOriginatedFrom.x + self.spriteOriginatedFrom.width;
            self.y = self.spriteOriginatedFrom.y + self.spriteOriginatedFrom.height;
            self.xdir = 1 * self.fireSpeed;
            self.ydir = 1 * self.fireSpeed;
            if (self.spriteOriginatedFrom.xdir < 0) self.xdir = -1 * self.fireSpeed;
            if (self.spriteOriginatedFrom.xdir > 0) self.xdir = 1 * self.fireSpeed;
            if (self.spriteOriginatedFrom.ydir < 0) self.ydir = -1 * self.fireSpeed;
            if (self.spriteOriginatedFrom.ydir > 0) self.ydir = 1 * self.fireSpeed;

            // Create the sprite and definition
            var sprite = new Sprite();
            sprite.type = "fire";
            sprite.definition = this;
            sprite.img = Engine.Image.get("player1_fire");
            sprite.x = self.x;
            sprite.y = self.y;

            // Key Definitions
            self.run = function () {
                sprite.x += self.xdir;
                sprite.y += self.ydir;
                if (sprite.x >= Tanks.width) self.xdir = -self.xdir;
                if (sprite.x < 0) self.xdir = -self.xdir;
                if (sprite.y >= Tanks.height - sprite.height) self.ydir = -self.ydir;
                if (sprite.y < 0) self.ydir = -self.ydir;

                // Detect Collisions
                var checkList = Engine.Sprite.getSpritesWithType(["tank", "wall"]);
                var ignoreList = [self.spriteOriginatedFrom];
                var collision = Engine.Sprite.collisionCheckSelected(sprite, checkList, ignoreList);
                if (collision) {
                    if (collision.type == "wall") {
                        collision.flag = -1;
                    }
                    sprite.flag = -1;
                }

            };
            return sprite;
        }
    };
    self.turbo = function () {
        self.playerSpeed = self.playerTurboSpeed;
    }
    self.noTurbo = function () {
        self.playerSpeed = self.playerDefaultSpeed;
    }
    self.moveLeft = function () {
        Engine.Sprite.useImage("player1_left", self.sprite);
        self.sprite.xdir = -self.playerSpeed;
        self.sprite.ydir = 0;
        self.sprite.x -= self.playerSpeed;
        if (Engine.Sprite.collisionCheckAll(self.sprite)) self.sprite.x += self.playerSpeed;

        self.move();
    }
    self.moveRight = function () {
        Engine.Sprite.useImage("player1_right", self.sprite);
        self.sprite.xdir = self.playerSpeed;
        self.sprite.ydir = 0;
        self.sprite.x += self.playerSpeed;
        if (Engine.Sprite.collisionCheckAll(self.sprite)) self.sprite.x -= self.playerSpeed;

        self.move();
    }
    self.moveUp = function () {
        Engine.Sprite.useImage("player1_up", self.sprite);
        self.sprite.ydir = -self.playerSpeed;
        self.sprite.xdir = 0;
        self.sprite.y -= self.playerSpeed;
        if (Engine.Sprite.collisionCheckAll(self.sprite)) self.sprite.y += self.playerSpeed;

        self.move();
    }
    self.moveDown = function () {
        Engine.Sprite.useImage("player1_down", self.sprite);
        self.sprite.ydir = self.playerSpeed;
        self.sprite.xdir = 0;
        self.sprite.y += self.playerSpeed;
        if (Engine.Sprite.collisionCheckAll(self.sprite)) self.sprite.y -= self.playerSpeed;

        self.move();
    }
}
Player.prototype.move = function () {
    var self = this;
    Engine.Sockets.emit("move", {
        id: self.sprite.id,
        x: self.sprite.x,
        y: self.sprite.y
    });
};

/*
 * Fire Definitions
 */


/*
 * Fire Pong Definition
 */


/*
 * WallBlock(test) Definitions
 */
Player.prototype.wall = function (spriteTriggeredFrom) {
    var self = this;
    self.spriteOriginatedFrom = $.extend({}, spriteTriggeredFrom);
    self.fireSpeed = 20;
    self.x = self.spriteOriginatedFrom.x + self.spriteOriginatedFrom.width;
    self.y = self.spriteOriginatedFrom.y + self.spriteOriginatedFrom.height;

// Create the sprite and definition
    var sprite = window.Engine.Sprite.create();
    sprite.type = "wall";
    sprite.definition = this;
    Engine.Sprite.useImage("wall", sprite);
    sprite.x = self.x;
    sprite.y = self.y;

// Key Definitions
    self.run = function () {

    }

    return sprite;

};
