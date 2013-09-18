Tanks = new function(){
    var self = this;
    self.localPlayer = null;
    self.opponents = [];
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
//      Engine.Sockets.connect("node-test-box-24433.use1.actionbox.io:3000");
      Engine.Sockets.connect("127.0.0.1:3000");
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

    // Reset Game (init canvas, start the loop)
    self.reset = function(){
        self.createSprites();
        Engine.Canvas.init(self.canvasElement, self.width, self.height);
        Engine.Canvas.start(self.fps);
    };

    self.addListeners = function(){
        Engine.Sockets.addListener("player-enter", function(sprite){
            opp = new Player(sprite.id, "player2");
            opp.sprite.x = sprite.x;
            opp.sprite.y = sprite.y;
            self.opponents[sprite.id] = opp;
        });

        Engine.Sockets.addListener("player-leave", function(sprite){
            opp = self.opponents[sprite.id];
            opp.destroy();
            delete self.opponents[sprite.id];
        });

        Engine.Sockets.addListener("move", function(sprite){
            var _sprite = Engine.Sprite.getByID(sprite.id);
            _sprite.x = sprite.x;
            _sprite.y = sprite.y;
        });

        Engine.Sockets.addListener("fire", function(sprite){
            var _sprite = Engine.Sprite.getByID(sprite.id);
            /*
             *  We need another level of abstraction.  Rather than moving sprites
             *  we should be moving players and delegating the sprite handling to them.
             * Otherwise we're stuck in this position where we need to tell the tank to fire,
             * but have no reference to it.
             */
        });
    };
  
    // Create the sprites for this game
    self.createSprites = function(){
        Engine.Sprite.reset();
        self.localPlayer = new Player(Tanks.connectionID, "player1");
    };
};