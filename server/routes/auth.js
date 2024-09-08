const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Passport Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URI
}, async function (accessToken, refreshToken, profile, done) {
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName, // Corrected field name
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
    };
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            done(null, user);
        } else {
            user = await User.create(newUser);
            done(null, user);
        }
    } catch (error) {
        console.log(error);
        done(error, null);
    }
}));

// Serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // await the Promise returned by findById
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


// Authentication Routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failure' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard'); // Simplified redirection
    }
);

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.log(err);
            res.send('error');
        } else {
            res.redirect('/');
        }
    });
});

router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
});

module.exports = router;
