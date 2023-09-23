const express = require('express');
const passport = require('passport');
const router = express.Router();

// login with google
router.get('/google', passport.authenticate('google', {scope : ['profile'] } ));

// auth with google callback
router.get('/google/callback',passport.authenticate('google', { failureRedirect : '/' }),(req,res) => {
    res.redirect('/stories');
} )

// logout
router.get('/logout',(req,res,next) => {
    req.logout((error) => {
        if(error) {return next(error)}
        res.redirect('/')
    })
})

module.exports = router;