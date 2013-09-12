Engine.Sprite = new function(){
    var self = this;
    self.counter = 0;
    self.collection = [];

    // Clears out the sprites
    self.reset = function(){
        self.collection = [];
    };
  
    // Gets a sprite by its id
    self.getByID = function(id){
      for(_index in self.collection){
            var obj = self.collection[_index];
            if(obj.id == id) return obj;
        }
        return false;
    }

    // Gets a sprite by its name
    self.get = function(name){
        for(_index in self.collection){
            var obj = self.collection[_index];
            if(obj.name == name) return obj;
        }
        return false;
    };

    // Get Sprites containing a particular type
    self.getSpritesWithType = function(checkList){
        var list = []
        for(_index in self.collection){
            var obj = self.collection[_index];
            if($.inArray(obj.type, checkList) > -1) list.push(obj);
        }
        return list;
    }

    // Check if sprite collided with another Sprite
    self.collisionCheckAll = function(sprite, ignoreList){
       var ignore = false;
       var obj;
        for(_index in self.collection){
            ignore = false;
            obj = self.collection[_index];

            // Ignore the original sprite 
            if(obj.id == sprite.id) continue;

            // Ignore what's in the ignore list
            if(ignoreList != undefined){
                for(_ignoreIndex in ignoreList){
                    if(ignoreList[_ignoreIndex].id == obj.id){ 
                        ignore = true;
                        break;
                    }
                }
            }
            if(ignore) continue;

            // Check for collision
            if(self.collisionCheck(obj,sprite)) return obj;
        }
        return false;
    }

    // Check if sprite collided with another Sprite
    self.collisionCheckSelected = function(sprite, checkList, ignoreList){
       var check = false;
       var ignore = false;
       var obj;
        for(_index in self.collection){
            check = false;
            ignore = false;
            obj = self.collection[_index];

            // Ignore the original sprite 
            if(obj.id == sprite.id) continue;

            // Check only what's in the checkList
            for(_checkListIndex in checkList){
                if(checkList[_checkListIndex].id == obj.id){ 
                    check = true;
                    break;
                }
            }
            if(!check) continue;

            // Ignore what's in the ignore list
            if(ignoreList != undefined){
                for(_ignoreIndex in ignoreList){
                    if(ignoreList[_ignoreIndex].id == obj.id){ 
                        ignore = true;
                        break;
                    }
                }
            }
            if(ignore) continue;

            if(self.collisionCheck(obj,sprite)) return obj;
        }
        return false;
    }

    // Classic Square Collision Check
    self.collisionCheck = function(sprite,sprite2){
        if(sprite.x+sprite.width > sprite2.x) {
            if(sprite.x < sprite2.x+sprite2.width) {
                if(sprite.y+sprite.height > sprite2.y) {
                    if(sprite.y < sprite2.y+sprite2.height) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Create a new Sprite
    self.create = function(obj){
        self.counter++;
        var info = {
            id: self.counter,
            name: "",
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            xdir: 1,
            ydir: 1,
            img: false,
            flag: 0,
            type: "default",
            definition: false
        };
        info = $.extend(info,obj);
        self.collection.push(info);
        return self.collection[self.collection.length-1];
    };

    // Inhert properties from image
    self.useImage = function(img, sprite){
        var image = Engine.Image.get(img);
        sprite.height = image.height;
        sprite.width = image.width;
        sprite.img = image;
    }

    // Remove a sprite
    self.remove = function(sprite){
        for(_index in self.collection){
            var obj = self.collection[_index];
            if(obj == sprite){
                self.collection.splice(_index, 1);
                return true;
            }
        }
        return false;
    };
}