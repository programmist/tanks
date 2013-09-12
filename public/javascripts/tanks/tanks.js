Tanks = new function(){
    var self = this;
    self.connectionID = 0;
    self.canvasElement = $("#tank-canvas");
    self.width = 800;
    self.height = 500;
    self.fps = 60;
    self.images = [{
        "player1_up":       "images/p1_up.gif",
        "player1_right":    "images/p1_right.gif",
        "player1_down":     "images/p1_down.gif",
        "player1_left":     "images/p1_left.gif",
        "player2_up":       "images/p2_up.gif",
        "player2_right":    "images/p2_right.gif",
        "player2_down":     "images/p2_down.gif",
        "player2_left":     "images/p2_left.gif",
        "player1_fire":     "images/p1_fire.gif",
        "player2_fire":     "images/p2_fire.gif",
        "wall":             "images/wall.gif"
    }];
    self.sounds = [{
        "player1shoot":     "sounds/p1_fire.mp3",
        "player2shoot":     "sounds/p2_fire.mp3",
        "hitTank":          "sounds/explosion-1.mp3",
        "p1tankMove":       "sounds/tankmove.mp3",
        "p2tankMove":       "sounds/tankmove.mp3",
        "pongFire":         "sounds/pong-fire.mp3",
        "crash":            "sounds/crash.mp3"
    }];

    self.init = function() {
      Engine.Sockets.connect("node-test-box-24433.use1.actionbox.io:3000");
      Engine.Sockets.addListener("connId", function(data){
        self.connectionID = data.id;
        var init = $.Deferred();
        init.then(function() { 
          Engine.Image.preLoad(Tanks.images);
        }).then(function() {
          Tanks.Sounds.loadSounds(Tanks.sounds);
        }).then(function() {
          Tanks.reset();
          Tanks.addListeners();
        });
        init.resolve();    
      });
    };
  
    self.addListeners = function(){
      Engine.Sockets.addListener("move", function(sprite){
        if(sprite.connectionID == self.connectionID) return;
        var _sprite = Engine.Sprite.getByID(sprite.id);
        _sprite.x = sprite.x;
        _sprite.y = sprite.y;
      });
    }

    // Reset Game (init canvas, start the loop)
    self.reset = function(){
        self.createSprites();
        Engine.Canvas.loop = self.gameLoop;
        Engine.Canvas.init(self.canvasElement, self.width, self.height);
        Engine.Canvas.start(self.fps);
    };
  
    // Create the sprites for this game
    self.createSprites = function(){
        Engine.Sprite.reset();
        new Tanks.SpriteDefinition.player1();
    };
  
    // Main Game Loop
    self.gameLoop = function(){
        Engine.Canvas.render();
    };
  
}