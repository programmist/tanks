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
    }

    // Movement Routines
    self.pong = function () {
        self.fireLauncher++;
        if (self.fireLauncher % 10 == 0) {
            Tanks.Sounds.playSound("pongFire");
            self.pong();
        }
    }
    self.wall = function () {
        self.fireLauncher++;
        if (self.fireLauncher % 10 == 0) {
            self.wall();
        }
    }
//    self.fire = function () {
//
//    }
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
Player.prototype.fire = function () {
    var self = this;
    self.fireLauncher++;
    if (self.fireLauncher % 3 == 0) {
        Tanks.Sounds.playSound("player1shoot");

        // Create the sprite and definition
        var bullet = new Sprite();
        bullet.type = "fire";
        bullet.img = Engine.Image.get("player1_fire");
        bullet.x = self.sprite.x;
        bullet.y = self.sprite.y;

        bullet.spriteOriginatedFrom = $.extend({}, self.sprite);
        bullet.fireSpeed = 20;
        bullet.xdir = 0;
        bullet.ydir = 0;
        bullet.x = bullet.spriteOriginatedFrom.x + bullet.spriteOriginatedFrom.xdir;
        bullet.y = bullet.spriteOriginatedFrom.y + bullet.spriteOriginatedFrom.ydir;
        if (bullet.spriteOriginatedFrom.xdir < 0) bullet.xdir = -bullet.fireSpeed;
        if (bullet.spriteOriginatedFrom.xdir > 0) bullet.xdir = bullet.fireSpeed;
        if (bullet.spriteOriginatedFrom.ydir < 0) bullet.ydir = -bullet.fireSpeed;
        if (bullet.spriteOriginatedFrom.ydir > 0) bullet.ydir = bullet.fireSpeed;
        bullet.definition = bullet;


// Key Definitions
        bullet.run = function () {
            console.log("fire!");
            bullet.x += bullet.xdir;
            bullet.y += bullet.ydir;
            if (bullet.x + bullet.width < 0) bullet.flag = -1;
            if (bullet.y + bullet.height < 0) bullet.flag = -1;
            if (bullet.x > Tanks.width) bullet.flag = -1;
            if (bullet.y - bullet.height > Tanks.height) bullet.flag = -1;

            // Detect Collisions
            var checkList = Engine.Sprite.getSpritesWithType(["tank", "wall"]);
            var ignoreList = [bullet.spriteOriginatedFrom];
            var collision = Engine.Sprite.collisionCheckSelected(bullet, checkList, ignoreList);
            if (collision) {
                if (collision.type == "wall") {
                    collision.flag = -1;
                }
                Tanks.Sounds.playSound("hitTank");
                bullet.flag = -1;
            }
        };

        return bullet;
    }
};

/*
 * Fire Pong Definition
 */
Player.prototype.pong = function () {
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

    }

    return sprite;

};

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
