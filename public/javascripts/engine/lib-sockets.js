Engine.Sockets = new function(){
  var self = this;
  self.socket = null;
  self.connect = function(ip){
    self.socket = io.connect(ip);
  };
  self.addListener = function(name, callback){
    self.socket.on(name, callback);
  };
  self.emit = function(name, data){
    self.socket.emit(name, data);
  }
};