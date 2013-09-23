
var _ = require('lodash');
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

var players = [];

io.sockets.on('connection', function (socket) {

    /*
     * location ping, so that inactive tanks are reported to new players.
     */
    socket.on("ping", function(data){
        console.log("PING - tank located: " + JSON.stringify(data));
        pl = _.find(players, { 'id': data.id });
        pl.x = data.x;
        pl.y = data.y;
        socket.broadcast.emit("ping", data);
    });

    socket.on("move", function(data){
        console.log("MOVE - Received from tank: " + JSON.stringify(data));
        pl = _.find(players, { 'id': data.id });
        pl.x = data.x;
        pl.y = data.y;
        socket.broadcast.emit("move", data);
    });

    socket.on("fire", function(data){
        console.log("FIRE - Received from tank: " + JSON.stringify(data));
        socket.broadcast.emit("fire",data);
    });

    socket.on('player-enter', function(data, fn){
        console.log("NEW PLAYER - Received from tank: " + JSON.stringify(data));
        fn(players); // send list of players and locations
        socket.broadcast.emit("player-enter",data);
        players.push({
            id: data.id,
            x: data.x,
            y: data.y
        });
    });

    socket.on("player-leave", function(data){
        console.log("PLAYER " + data.id + " Leaving the game: " + JSON.stringify(data));
        _.remove(players, function(player) { return player.id == data.id; });
        socket.broadcast.emit("player-leave",data);
    });
});