Engine.Image = new function(){
    var self = this;
    self.collection = [];

    // Creates a new Image with a name and source
    self.create = function(name,src){
        var item = {
            "name": name,
            "image": self.newImage(),
            "loaded": false
        };
        item.image.src = src;
        self.collection.push(item);
    };

    self.newImage = function() {
        img = new Image();
        img.onload = function(){
            img.loaded = true;
        };
        img.onerror = function(){
            img.loaded = true;
            alert("Image does not exist: \r\n " + img.src);
        };
        return img;
    };

    // Gets the image by name
    self.get = function(name){
        for(_index in self.collection){
            var obj = self.collection[_index];
            if(obj.name == name) return obj.image;
        }
        return false;
    };

    // Preloads images that belong in the collection
    self.preLoad = function(images){
        var allImagesLoaded = true;
        if(images){
            for(_index in images){
                var obj = images[_index];
                for(_key in obj) self.create(_key, obj[_key]);
            }
        }
    }
};