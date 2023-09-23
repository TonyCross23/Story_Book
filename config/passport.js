const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport =require('passport');
const mongoose = require('mongoose');
const User = require('../model/User');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : '/auth/google/callback'
    },
        async (accessToken,refreshToken,profile,done) => {
        
            const newUser = {
                googleId : profile.id,
                displayName : profile.displayName,
                first_name : profile.name.givenName,
                last_name : profile.name.familyName,
                image : profile.photos[0].value
            };
            try {
                let user = await User.findOne({googleId : profile.id})

                if(user){
                    done(null,user)
                }else{
                    user = await User.create(newUser)
                    done(null,user)
                }

            } catch (error) {
                console.log(error);
            }
        }
    ))

    passport.serializeUser((user,done) => {
        done(null,user.id);
    });

    passport.deserializeUser( async (id,done) => {
        try {
            const user = await User.findById(id);
            done(null, user); // Assuming user is found
          } catch (err) {
            done(err, null);
          }
    });
}