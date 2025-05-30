var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var createRouter = require('./routes/create');
var consult = require('./routes/consult');
var consultCertificate = require('./routes/consultCertificate');
var addAchievement = require('./routes/addAchievement');
var numberOfAchievements = require('./routes/numberOfAchievements');

var proof = require('./routes/proof');

var app = express();

//global variable
global.contractABIPath = "./smartContract/ScholarCurriculum.abi";
global.contractByteCodeSource = "./smartContract/ScholarCurriculum.bytecode";
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
app.use('/createCurriculum', createRouter);
app.use('/consultCertificate', consultCertificate);
app.use('/addAchievement',addAchievement);
app.use('/numberOfAchievements',numberOfAchievements);
app.use('/consult', consult);
app.use('/proofsc', proof);

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
