// See http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes 

Tanks.SpriteDefinition = new function(){
  var self = this;

  /*
   * Player 1 Definitions
   */
  self.player1 = function(){
    var obj = this;
    obj.playerDefaultSpeed = 1;
    obj.playerSpeed = obj.playerDefaultSpeed;
    obj.playerTurboSpeed = 10;
    obj.fireLauncher = 0;

    // Create the sprite and definition
    var sprite = window.Engine.Sprite.create();
    sprite.type = "tank";
    sprite.definition = this;
    sprite.img = window.Engine.Image.get("player1_up");

    // Key Definitions
    obj.run = function(){
      if(Engine.Keys.pressing("up")) obj.moveUp();
      if(Engine.Keys.pressing("down")) obj.moveDown();
      if(Engine.Keys.pressing("left")) obj.moveLeft();
      if(Engine.Keys.pressing("right")) obj.moveRight();
      if(Engine.Keys.pressing("shift")) obj.turbo();
      if(Engine.Keys.depressing("shift")) obj.noTurbo();
      if(Engine.Keys.pressing("spacebar")) obj.fire();
      if(Engine.Keys.pressing("w")) obj.wall();
      if(Engine.Keys.pressing("p")) obj.pong();
    }

    // Movement Routines
    obj.pong = function(){
      obj.fireLauncher++;
      if(obj.fireLauncher % 10 == 0){
        Tanks.Sounds.playSound("pongFire");
        new Tanks.SpriteDefinition.pong(sprite);
      }
    }
    obj.wall = function(){
      obj.fireLauncher++;
      if(obj.fireLauncher % 10 == 0){
        new Tanks.SpriteDefinition.wall(sprite);
      }
    }
    obj.fire = function(){
      obj.fireLauncher++;
      if(obj.fireLauncher % 5 == 0){
        Tanks.Sounds.playSound("player1shoot");
        new Tanks.SpriteDefinition.fire(sprite);
      }
    }
    obj.turbo = function(){
      obj.playerSpeed = obj.playerTurboSpeed;
    }
    obj.noTurbo = function(){
      obj.playerSpeed = obj.playerDefaultSpeed;
    }
    obj.moveLeft = function(){
      Engine.Sprite.useImage("player1_left", sprite);
      sprite.xdir = -obj.playerSpeed;
      sprite.ydir = 0;
      sprite.x-= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.x+= obj.playerSpeed;
    }
    obj.moveRight = function(){
      Engine.Sprite.useImage("player1_right", sprite);
      sprite.xdir = obj.playerSpeed;
      sprite.ydir = 0;
      sprite.x+= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.x-= obj.playerSpeed;
    }
    obj.moveUp = function(){
      Engine.Sprite.useImage("player1_up", sprite);
      sprite.ydir = -obj.playerSpeed;
      sprite.xdir = 0;
      sprite.y-= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.y+= obj.playerSpeed;
    }
    obj.moveDown = function(){
      Engine.Sprite.useImage("player1_down", sprite);
      sprite.ydir = obj.playerSpeed;
      sprite.xdir = 0;
      sprite.y+= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.y-= obj.playerSpeed;
    }

    return sprite;

  }

  /*
   * Player 2 Definitions
   */
  self.player2 = function(){
    var obj = this;
    obj.playerDefaultSpeed = 1;
    obj.playerSpeed = obj.playerDefaultSpeed;
    obj.playerTurboSpeed = 10;
    obj.fireLauncher = 0;

    // Create the sprite and definition
    var sprite = window.Engine.Sprite.create();
    sprite.type = "tank";
    sprite.definition = this;
    sprite.img = window.Engine.Image.get("player2_up");
    sprite.x = 800-32;
    sprite.y = 200;

    // Key Definitions
    obj.run = function(){
      if(Engine.Keys.pressing("down")) obj.moveUp();
      if(Engine.Keys.pressing("up")) obj.moveDown();
      if(Engine.Keys.pressing("right")) obj.moveLeft();
      if(Engine.Keys.pressing("left")) obj.moveRight();
      if(Engine.Keys.pressing("shift")) obj.turbo();
      if(Engine.Keys.depressing("shift")) obj.noTurbo();
      if(Engine.Keys.pressing("spacebar")) obj.fire();
    }

    // Movement Routines
    obj.fire = function(){
      obj.fireLauncher++;
      if(obj.fireLauncher % 10 == 0){
        Tanks.Sounds.playSound("player2shoot");
        new Tanks.SpriteDefinition.fire(sprite);
      }
    }
    obj.turbo = function(){
      obj.playerSpeed = obj.playerTurboSpeed;
    }
    obj.noTurbo = function(){
      obj.playerSpeed = obj.playerDefaultSpeed;
    }
    obj.moveLeft = function(){
      Engine.Sprite.useImage("player2_left", sprite);
      sprite.xdir = -obj.playerSpeed;
      sprite.ydir = 0;
      sprite.x-= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.x+= obj.playerSpeed;
    }
    obj.moveRight = function(){
      Engine.Sprite.useImage("player2_right", sprite);
      sprite.xdir = obj.playerSpeed;
      sprite.ydir = 0;
      sprite.x+= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.x-= obj.playerSpeed;
    }
    obj.moveUp = function(){
      Engine.Sprite.useImage("player2_up", sprite);
      sprite.ydir = -obj.playerSpeed;
      sprite.xdir = 0;
      sprite.y-= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.y+= obj.playerSpeed;
    }
    obj.moveDown = function(){
      Engine.Sprite.useImage("player2_down", sprite);
      sprite.ydir = obj.playerSpeed;
      sprite.xdir = 0;
      sprite.y+= obj.playerSpeed;
      if(Engine.Sprite.collisionCheckAll(sprite)) sprite.y-= obj.playerSpeed;
    }

    return sprite;

  }

  /*
   * Fire Definitions
   */
  self.fire = function(spriteTriggeredFrom){
    var obj = this;
    obj.spriteOriginatedFrom = $.extend({}, spriteTriggeredFrom);
    obj.fireSpeed = 20;
    obj.xdir = 0;
    obj.ydir = 0;
    obj.x = obj.spriteOriginatedFrom.x+obj.spriteOriginatedFrom.xdir;
    obj.y = obj.spriteOriginatedFrom.y+obj.spriteOriginatedFrom.ydir;
    if(obj.spriteOriginatedFrom.xdir < 0) obj.xdir = -obj.fireSpeed;
    if(obj.spriteOriginatedFrom.xdir > 0) obj.xdir = obj.fireSpeed;
    if(obj.spriteOriginatedFrom.ydir < 0) obj.ydir = -obj.fireSpeed;
    if(obj.spriteOriginatedFrom.ydir > 0) obj.ydir = obj.fireSpeed;

    // Create the sprite and definition
    var sprite = window.Engine.Sprite.create();
    sprite.type = "fire";
    sprite.definition = this;
    Engine.Sprite.useImage("player1_fire", sprite);
    sprite.x = obj.x;
    sprite.y = obj.y;

    // Key Definitions
    obj.run = function(){
      sprite.x+=obj.xdir;
      sprite.y+=obj.ydir;
      if(sprite.x+sprite.width < 0) sprite.flag = -1;
      if(sprite.y+sprite.height < 0) sprite.flag = -1;
      if(sprite.x > Tanks.width) sprite.flag = -1;
      if(sprite.y-sprite.height > Tanks.height) sprite.flag = -1;

      // Detect Collisions
      var checkList = Engine.Sprite.getSpritesWithType(["tank","wall"]);
      var ignoreList = [obj.spriteOriginatedFrom];
      var collision = Engine.Sprite.collisionCheckSelected(sprite, checkList, ignoreList);
      if(collision){
        if(collision.type == "wall"){
          collision.flag = -1;
        }
        Tanks.Sounds.playSound("hitTank");
        sprite.flag = -1;
      }

    }

    return sprite;

  }

  /*
   * Fire Pong Definition
   */
  self.pong = function(spriteTriggeredFrom){
    var obj = this;
    obj.spriteOriginatedFrom = $.extend({}, spriteTriggeredFrom);
    obj.fireSpeed = 10;
    obj.x = obj.spriteOriginatedFrom.x+obj.spriteOriginatedFrom.width;
    obj.y = obj.spriteOriginatedFrom.y+obj.spriteOriginatedFrom.height;
    obj.xdir = 1*obj.fireSpeed;
    obj.ydir = 1*obj.fireSpeed;
    if(obj.spriteOriginatedFrom.xdir < 0) obj.xdir = -1*obj.fireSpeed;
    if(obj.spriteOriginatedFrom.xdir > 0) obj.xdir = 1*obj.fireSpeed;
    if(obj.spriteOriginatedFrom.ydir < 0) obj.ydir = -1*obj.fireSpeed;
    if(obj.spriteOriginatedFrom.ydir > 0) obj.ydir = 1*obj.fireSpeed;

    // Create the sprite and definition
    var sprite = window.Engine.Sprite.create();
    sprite.type = "fire";
    sprite.definition = this;
    Engine.Sprite.useImage("player1_fire", sprite);
    sprite.x = obj.x;
    sprite.y = obj.y;

    // Key Definitions
    obj.run = function(){
      sprite.x+=obj.xdir;
      sprite.y+=obj.ydir;
      if(sprite.x >= Tanks.width) obj.xdir=-obj.xdir;
      if(sprite.x < 0) obj.xdir=-obj.xdir;
      if(sprite.y >= Tanks.height-sprite.height) obj.ydir=-obj.ydir;
      if(sprite.y < 0) obj.ydir=-obj.ydir;

      // Detect Collisions
      var checkList = Engine.Sprite.getSpritesWithType(["tank","wall"]);
      var ignoreList = [obj.spriteOriginatedFrom];
      var collision = Engine.Sprite.collisionCheckSelected(sprite, checkList, ignoreList);
      if(collision){
        if(collision.type == "wall"){
          collision.flag = -1;
        }
        sprite.flag = -1;
      }

    }

    return sprite;

  }

  /*
   * WallBlock(test) Definitions
   */
  self.wall = function(spriteTriggeredFrom){
    var obj = this;
    obj.spriteOriginatedFrom = $.extend({}, spriteTriggeredFrom);
    obj.fireSpeed = 20;
    obj.x = obj.spriteOriginatedFrom.x+obj.spriteOriginatedFrom.width;
    obj.y = obj.spriteOriginatedFrom.y+obj.spriteOriginatedFrom.height;

    // Create the sprite and definition
    var sprite = window.Engine.Sprite.create();
    sprite.type = "wall";
    sprite.definition = this;
    Engine.Sprite.useImage("wall", sprite);
    sprite.x = obj.x;
    sprite.y = obj.y;

    // Key Definitions
    obj.run = function(){

    }

    return sprite;

  }

}