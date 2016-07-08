'use strict';

const PORT = process.env.PORT || 8000;

let express = require('express');
let path = require('path');
let http = require('http');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let app = express();
let server = http.createServer(app);

let io = require('socket.io')(server);

let connections = 0;

io.on('connection', function(socket) {
  // triggered when a new client connects
  // socket is the connection to that client

  console.log('Socket connected.');
  console.log(`Clients connected: ${++connections}`);

  socket.on('disconnect', function() {
    console.log('Disconnect');
    console.log(`Clients connected: ${--connections}`);
  });

  socket.on('sendMessage', function(data) {
    console.log(data);
    io.emit('newMessage', data.message);
  })

});

server.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///// ROUTERS /////

app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.render('index', {title: 'Simple Socket Chat'});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});
