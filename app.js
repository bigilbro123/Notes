require('dotenv').config();
const methodOverride = require('method-override');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const http = require('http');
const app = express();
const port = process.env.PORT || 5000;

const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');

// Connect to the database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'))
// Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 }, // 1 hour in milliseconds
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
const route = require('./server/routes/index');
const routes = require('./server/routes/dashboard');
const route_auto = require('./server/routes/auth');

app.use('/', route);
app.use('/', route_auto);
app.use('/', routes);

// 404 handler
app.get('*', (req, res) => {
    res.status(404).render('404');
});

// Start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
