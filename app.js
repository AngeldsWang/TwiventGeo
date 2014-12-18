var express = require('express');
var path = require('path');
var app = express();

var server = app.listen(5000);
console.log("Server is listening on port 5000");

var io = require('socket.io').listen(server);


// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var rtnetwork = require('./routes/rtnetwork');
var geoinfo = require('./routes/geoinfo');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/rtnetwork', rtnetwork.loadpage(io));

app.post('/rtnetwork', rtnetwork.submit);

app.get('/geoinfo', geoinfo.loadpage(io));

app.post('/geoinfo', geoinfo.submit);

// io.sockets.on('connection', function (socket) {
//     socket.emit('news', { hello: 'world' });
//     console.log("server emit");
//     socket.on('my other event', function (data) {
//         console.log(data);
//     });
//     socket.on('my route event', function (data) {
//         console.log(data);
//     });
// });

app.get('/about', function(req, res) {
	res.render('pages/about');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

