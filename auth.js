const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: '567790212408-bge0rkkh8qirc0h5nblgtv459vcp5443.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true,
},
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });