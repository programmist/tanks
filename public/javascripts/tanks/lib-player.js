__hasProp = {}.hasOwnProperty;
__extends = function (child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

Sprite = (function() {
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
    Sprite.prototype.destroy = function() {
        Engine.Sprite.remove(self);
    };

    return Sprite;
})();

Bullet = (function(_super) {
    __extends(Bullet, _super);

    function Bullet(startSprite) {
        _ref = Bullet.__super__.constructor.apply(this, startSprite);
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
        return _ref;
    }
    return Bullet;
})(Sprite);

Player = (function() {
    function Player(id, imageId) {
        var self = this;
        self.id = id;
        self.imgId = imageId;
        self.playerDefaultSpeed = 1;
        self.playerSpeed = self.playerDefaultSpeed;
        self.playerTurboSpeed = 10;
        self.fireLauncher = 0;
        self.sprite = new Sprite(id);

        self.sprite.type = "tank";
        self.sprite.definition = this;
        self.sprite.img = window.Engine.Image.get(self.imgId+"_up");

        self.wall = function () {
            self.fireLauncher++;
            if (self.fireLauncher % 10 == 0) {
                self.wall();
            }
        };

        Player.prototype.fire = function () {
            var self = this;
            self.fireLauncher++;
            if (self.fireLauncher % 5 == 0) {
                Tanks.Sounds.playSound("player1shoot");

                // Create the sprite and definition
                var bullet = new Bullet(self.sprite);
                return bullet;
            }
            Engine.Sockets.emit("fire", {
                id: self.sprite.id,
                x: self.sprite.x,
                y: self.sprite.y
            });
        };
        self.turbo = function () {
            self.playerSpeed = self.playerTurboSpeed;
        };
        self.noTurbo = function () {
            self.playerSpeed = self.playerDefaultSpeed;
        };
    }

    Player.prototype.run = function () {
        var self = this;
        if (Engine.Keys.pressing("up")) self.move("up");
        if (Engine.Keys.pressing("down")) self.move("down");
        if (Engine.Keys.pressing("left")) self.move("left");
        if (Engine.Keys.pressing("right")) self.move("right");
        if (Engine.Keys.pressing("shift")) self.turbo();
        if (Engine.Keys.depressing("shift")) self.noTurbo();
        if (Engine.Keys.pressing("spacebar")) self.fire();
        if (Engine.Keys.pressing("w")) self.wall();
    };

    Player.prototype.move = function (direction) {
        var self = this;
        Engine.Sprite.useImage(self.imgId+"_"+ direction, self.sprite);
        xmod = 0;
        ymod = 0;
        switch(direction) {
            case "up":
                ymod = -1;
                break;
            case "down":
                ymod = 1;
                break;
            case "left":
                xmod = -1;
                break;
            case "right":
                xmod = 1;
                break;
        }
        self.sprite.ydir = ymod * self.playerSpeed;
        self.sprite.xdir = xmod * self.playerSpeed;

        if(xmod != 0) {
            if (Engine.Sprite.collisionCheckAll(self.sprite)) self.sprite.x -= xmod * self.playerSpeed;
            self.sprite.x += xmod * self.playerSpeed;
        } else if (ymod != 0) {
            self.sprite.y += ymod * self.playerSpeed;
            if (Engine.Sprite.collisionCheckAll(self.sprite)) self.sprite.y -= ymod * self.playerSpeed;
        }
        console.log("tank " + self.id + " move: " + direction)
        Engine.Sockets.emit("move", {
            id: self.sprite.id,
            x: self.sprite.x,
            y: self.sprite.y,
            cmd: direction
        });
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

        };
        return sprite;
    };

    Player.prototype.destroy = function() {
        self.sprite.destroy();
    };

    return Player;
})();

Opponent = (function(_super) {
    __extends(Opponent, _super);

    function Opponent(id, imageId) {
        _ref = Opponent.__super__.constructor.apply(this, id, imageId);
        return _ref;
    }

    Opponent.prototype.run = function() {
        console.log("opponent run: " + id)
    };
    return Opponent;
    
})(Player);