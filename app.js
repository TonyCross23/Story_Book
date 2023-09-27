const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStroe = require("connect-mongo");
const exp = require('constants');
const connectDb = require('./config/db');
const socket = require('socket.io');

// load env config
dotenv.config({path : './config/config.env'});

// connect to mongodb
connectDb();

const app = express();


// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// user condection logging
if(process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'))
};


// passport 
require('./config/passport') (passport);

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStroe.create({
        mongoUrl: process.env.MONGO_STORE_URL
      })
  }));

  // handlebars helper
const {   
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,} = require('./helpers/hbs');

// handelbar
app.engine('.hbs', engine({ helpers : {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
},
defaultLayout : 'main',
extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('views', './views');

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// static folder 
app.use(express.static(path.join(__dirname,'public')))

// global var
app.use(function(req,res,next) {
    res.locals.user = req.user ||null
    next();
});

// method over ride
app.use(methodOverride(function (req,res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

// routers
app.use('/',require('./router/router'));
app.use('/auth',require('./router/auth'));
app.use('/stories', require('./router/stories'));
app.use('/chat',require('./router/socket'));


// port
PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on port : ${PORT}`);  
})