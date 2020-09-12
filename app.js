var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs')
var app = express();
const authController = require('./controllers/auth');

// view engine setup
const publicDirectory = path.join(__dirname,'./public');
const viewPath = path.join(__dirname,'./views/templates/views');
const viewPathPartials = path.join(__dirname,'./views/templates/partials');
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(viewPathPartials);
app.use(express.static(publicDirectory))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/index', require('./routes/index'));
app.use('/', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/search', require('./routes/search'));


app.get('*', authController.isLoggedIn,(req, res) => {
  if(req.user) {
  res.render('404',{
    title: '404',
    errorMessage: 'Page not found',
    user:req.user
  })
  }else {
    res.redirect("/login");
  }
});


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
port =3001
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
