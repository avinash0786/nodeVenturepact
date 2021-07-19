var passport = require("passport");
var userModel = require("../models/users");
var GoogleStrategy = require("passport-google-oauth2");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  userModel.findById(id).then((ans) => {
    console.log("Deserialize user find by id");
    console.log(ans);
    done(null, ans);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CONSUMER_KEY,
      clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
      callbackURL: "http://localhost:3000/oauth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      userModel
        .find({ email: profile.email })
        .then((res) => {
          console.log("response from db");
          console.log(res);
          if (res.length === 0) {
            console.log("User not-exist: need to save it");
            let nayaUser = new userModel({
              name: profile.given_name,
              email: profile.email,
              profileImage: profile.picture,
            });
            nayaUser.save().then((ans) => {
              console.log("New user saved");
              return done(null, nayaUser);
            });
          } else {
            console.log("User exist pass to done");
            console.log(res[0]);
            return done(null, res[0]);
          }
        })
        .catch((er) => {
          console.log(er);
        });
    }
  )
);
