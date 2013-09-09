Engine.Keys = new function(){
  var self = this;
  self.keysDown = {};

  // Add the listeners for key events
  self.init = function(){
    addEventListener("keydown", function (e){
      self.keysDown[e.keyCode] = 1;
    }, false);
    addEventListener("keyup", function (e){
      self.keysDown[e.keyCode] = 0;
    }, false);
  };

  // Get key from value
  self.getKey = function(key){
    var keyCode = -1;
    key = key.toLowerCase();
    switch(key){
      case "up": keyCode = 38; break;
      case "down": keyCode = 40; break;
      case "left": keyCode = 37; break;
      case "right": keyCode = 39; break;
      case "shift": keyCode = 16; break;
      case "spacebar": keyCode = 32; break;
      case "p": keyCode = 80; break;
      case "w": keyCode = 87; break;
    }
    if(keyCode == -1) return false;
    return keyCode;
  }

  // Check if pressing a certain key ("up" as an exmaple)
  self.pressing = function(key){
    keyCode = self.getKey(key);
    if(keyCode == -1) return false;
    if(self.keysDown[keyCode] == 1) return true;
    return false;
  };

  // Just a depressing function :(
  self.depressing = function(key){
    keyCode = self.getKey(key);
    if(keyCode == -1) return false;
    if(self.keysDown[keyCode] == 0) return true;
    return false;
  }

  self.init();

}