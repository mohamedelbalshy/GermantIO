const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../config/passport');
const User = require('../models/user');
const _ = require('lodash');

router.route('/signup')
    .get((req, res, next)=>{
        res.render('signup', { message: req.flash('errors') });
    })
    .post((req, res, next)=>{
        User.findOne({ email: req.body.email}, (err, existingUser)=>{
            if(err)
                return console.log(err);
            if(existingUser){
                req.flash('errors', 'Account with that email address already exists.');
                return res.redirect('/signup');
            } else{
                var user = new User();
                user.name = req.body.username;
                user.email = req.body.email;
                user.password = req.body.password;
                user.save((err)=>{
                    if(err)
                        return next(err);
                    req.logIn(user, (err)=>{
                        if(err) return next(err);
                        res.redirect('/');
                    })
                })
            }
        })
    });

router.route('/login')
    .get((req, res, next)=>{
        if (req.user) return res.redirect('/');
        res.render('login', { message: req.flash('loginMessage') });
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/', 
        failureRedirect: '/login',
        failureFlash: true 
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;

    