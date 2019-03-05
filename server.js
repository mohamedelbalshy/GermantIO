const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('express-flash');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');


const config = require('./config/secret');

mongoose.connect(config.database, { useNewUrlParser: true },(err)=>{
    if(err)
    return console.log(err);
    console.log('Database connected');
});

const sessionStore = new MongoStore({ url: config.database, autoReconnect: true });

const app = express();


const sessionMiddleware = session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret || process.env.SECRET,
    store: sessionStore
});

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

const userRoutes = require('./routes/user');
const mainRoutes = require('./routes/main');
app.use(mainRoutes);
app.use(userRoutes);


app.listen(config.port, (err)=>{
    if (err) console.log(err);
    console.log('Server running on port ', config.port);
})