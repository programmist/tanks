Engine.Image = new function(){
    var self = this;
    self.collection = [];

    // Creates a new Image with a name and source
    self.create = function(name,src){
        var item = {
            "name": name,
            "image": new Image(),
            "loaded": false
        };
        item.image.src = src;
        self.collection.push(item);
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
    self.preLoad = function(images, callback){
        var allImagesLoaded = true;
        if(images){
            for(_index in images){
                var obj = images[_index];
                for(_key in obj) self.create(_key, obj[_key]);
            }
            return self.preLoad(false, callback);
        }
        for(_index in self.collection){
            var obj = self.collection[_index];
            if(obj.loaded == false){
                allImagesLoaded = false;
                if(obj.image.onload == null){
                    self.loadImage(obj, callback);
                }
            }
        }
        if(allImagesLoaded){ 
            return callback.call();
        }
    }

    self.loadImage = function(obj, callback){
        obj.image.onload = function(){
            obj.loaded = true;
            self.preLoad(false, callback);
        }
        obj.image.onerror = function(){
            obj.loaded = true;
            alert("Image does not exist: \r\n " + obj.image.src);
            self.preLoad(false, callback);
        }
    }
}