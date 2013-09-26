Tanks.Sounds = new function(){
    var self = this;
    self.loader = null;
    self.sounds = [];
    self.soundQueue = [];
    self.loadSounds = function(sounds){
        self.sounds = sounds;
        var soundArray = _.values(sounds);
        self.loader = html5Preloader.apply(this, soundArray);
        self.loader.on('finish', callback);
    }
    self.playSound = function(soundKey){
        var sound = self.sounds[soundKey]
        if(sound) {
            var item = {
                name: key,
                src: new Audio(obj[key])
            }
            item.src.play();
            self.soundQueue.push(item);
            return true;
        }
        return false;
    }
}