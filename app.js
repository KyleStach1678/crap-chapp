var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

messages = [];

app.post('/newmessage', function(req, res) {
  console.log(req.body);
  if (req.body) {
    if (req.body["message[user]"] && req.body["message[text]"]) {
      messages.push({user: req.body["message[user]"], text: req.body["message[text]"]});
      console.log({user: req.body["message[user]"], text: req.body["message[text]"]});
    }
  }
  res.json(req.bod);
});

app.get('/getmessages', function(req, res) {
  res.json(messages);
});

module.exports = app;
