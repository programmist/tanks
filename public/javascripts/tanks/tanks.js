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
        var init = $.Deferred();
        init.then(function() {
            Engine.Image.preLoad(Tanks.images);
        }).then(function() {
            Tanks.Sounds.loadSounds(Tanks.sounds);
        }).then(function(){
            self.addListeners();
        });
        init.resolve();
    };

    // Reset Game (init canvas, start the loop)
    self.reset = function(){
        Engine.Sprite.reset();
        self.newPlayer();
        Engine.Canvas.init(self.canvasElement, self.width, self.height);
        Engine.Canvas.start(self.fps);
    };

    self.endGame = function() {
        Engine.Sockets.emit("player-leave", {
            id: self.localPlayer.id
        });
        self.localPlayer.destroy();
        self.localPlayer = null;
        for(var opp in self.opponents) {
            self.opponents[opp].destroy();
            delete self.opponents[opp];
        }
        self.opponents = [];
    };

    self.addListeners = function(){
        Engine.Sockets.addListener("player-enter", function(event){
            if (self.connectionID == event.id) return;
            opp = new Opponent(event.id, "player2");
            opp.sprite.x = event.x;
            opp.sprite.y = event.y;
            self.opponents[event.id] = opp;
        });

        Engine.Sockets.addListener("player-leave", function(event){
            if (self.connectionID == event.id) return;
            opp = self.opponents[event.id];
            opp.destroy();
            delete self.opponents[event.id];
        });

        Engine.Sockets.addListener("move", function(event){
            if (self.connectionID == event.id) return;
            opp = self.opponents[event.id];
            opp.sprite.x = event.x;
            opp.sprite.y = event.y;
            opp.move(event.cmd);
        });

        Engine.Sockets.addListener("fire", function(event){
            if (self.connectionID == event.id) return;
            opp = self.opponents[event.id];
            opp.fire();
        });
    };

    self.newPlayer = function() {
        if(self.localPlayer) {
            Engine.Sockets.emit("player-leave", {
                id: self.localPlayer.id,
                x: self.localPlayer.sprite.x,
                y: self.localPlayer.sprite.y
            });
        }

        self.connectionID = Math.round(Math.random() * 1000000000000);
        self.localPlayer = new Player(Tanks.connectionID, "player1");

        Engine.Sockets.emit("player-enter", {
            id: self.localPlayer.id,
            x: self.localPlayer.sprite.x,
            y: self.localPlayer.sprite.y
        }, function(opponents) {
            for(var i in opponents) {
                o = opponents[i];
                if(!self.opponents[o.id]) {
                    opp = new Opponent(o.id, "player2");
                    opp.sprite.x = o.x;
                    opp.sprite.y = o.y;
                    self.opponents[o.id] = opp;
                }
            }
        });
    };
};