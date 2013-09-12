
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/images', images.list);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var connectionCount = 1;
io.sockets.on('connection', function (socket) {
  socket.emit("connId", {"id": connectionCount++});
     socket.on("move", function(data){
       console.log("Received from tank: " + JSON.stringify(data));
       socket.broadcast.emit(data);
     })
});
