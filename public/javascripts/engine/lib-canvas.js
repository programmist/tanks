Engine.Canvas = new function(){
  var self = this;
  self.width = 0;
  self.height = 0;
  self.gameTimer = null;

  // Init the Canvas Element
  self.init = function(canvasID, width, height){
    self.width = width;
    self.height = height;
    self.element = $(canvasID);
    self.ctx = self.element[0].getContext("2d");
    self.element.attr("width", width);
    self.element.attr("height", height);
  };

  // Clear out the canvas for new sprites
  self.clearCanvas = function(){
    Engine.Canvas.ctx.clearRect(0, 0, Engine.Canvas.width, Engine.Canvas.width);
  }

  // Render all sprites  -  http://i.qkme.me/3vqnm6.jpg
  self.render = function(){
      self.clearCanvas();
      for(_index in Engine.Sprite.collection){
          var obj = Engine.Sprite.collection[_index];
          if(obj.definition) obj.definition.run();
          if(obj.x+obj.width < 0) obj.flag = -1;
          if(obj.x > self.width) obj.flag = -1;
          if(obj.y+obj.height < 0) obj.flag = -1;
          if(obj.y > self.height) obj.flag = -1;
          switch(obj.flag){
            case 0: Engine.Canvas.ctx.drawImage(obj.img, obj.x, obj.y); break;
            case -1: Engine.Sprite.remove(obj); break;
          }
      }
  };

  // Placeholder to be extended by game functionality
  self.loop = function(){ };

  // Start it
  self.start = function(fps){
    if(fps == undefined) fps = 60;
    if(self.gameTimer == null){
      self.gameTimer = setInterval(function(){
        self.loop();
      }, 1000/fps);
    }
  };

  // Stop it
  self.stop = function(){
    if(self.gameTimer) clearInterval(self.gameTimer);
  }

}