Tanks.Sounds = new function(){
  var self = this;
  self.loader = null;
  self.soundList = [];
  self.soundQueue = [];
  self.loadSounds = function(sounds, callback){
    self.soundList = sounds;
    var soundArray = []
    for(_index in sounds){
      var obj = sounds[_index];
      for(key in obj){
        soundArray.push(obj[key]);
      }
    }
    alert("This game might crash, but no worries, it's not optimized yet, nor near ready!");
    self.loader = html5Preloader.apply(this, soundArray);
    self.loader.on('finish', callback);
  }
  self.playSound = function(sound){
    for(_index in self.soundList){
      var obj = self.soundList[_index];
      for(key in obj){
        if(key == sound){
          var item = {
            name: key,
            src: new Audio(obj[key])
          }
          item.src.play();
          self.soundQueue.push(item);
          return true;
        }
      }
    }
    return false;
  }
}