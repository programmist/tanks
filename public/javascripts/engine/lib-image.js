GameImage = (function() {
    function GameImage(name, src) {
        var self = this;
        self.name = name;
        self.image = new Image();
        self.loaded = false;

        self.image = new Image();
        self.image.src = src;
        self.image.onload = function(){
            self.image.loaded = true;
        };
        self.image.onerror = function(){
            self.image.loaded = true;
            alert("Image does not exist: \r\n " + img.src);
        };
    }
    GameImage.prototype.destroy = function() {
        var self = this;

    };

    return GameImage;
})();

Engine.Image = new function(){
    var self = this;
    self.collection = {};

    // Gets the image by name
    self.get = function(name){
        var image = collection[name];
        if(image) {
            return image;
        }
        return false;
    };

    // Preloads images that belong in the collection
    self.preLoad = function(images){
        var allImagesLoaded = true;
        if(images){
            for(imgName in images) {
                var imgSrc = images[_key];
                self.collection[imgName] = new GameImage(imgName,imgSrc);
            }
        }
    }
};