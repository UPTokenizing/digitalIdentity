var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var createRouter = require('./routes/create');
var consult = require('./routes/consult');
var getInfo = require('./routes/getInfo');
var registerUser = require('./routes/registerUser');
var proof = require('./routes/proof');

var app = express();

//global variable
global.contractABIPath = "./smartContract/Users.abi";
global.contractByteCodeSource = "./smartContract/Users.bytecode";
global.blockchainAddress = "ws://172.18.1.2:8546";


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/createUser', createRouter);
app.use('/consultuser', consult);
app.use('/getInfoUser', getInfo);
app.use('/registerUser', registerUser);
app.use('/proofu', proof);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
