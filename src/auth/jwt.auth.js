const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

module.export = passport.use(
  "jwt",
  new JwtStrategy(opts, function (jwtPayload, done) {
    var expDate = new Date(jwtPayload.exp * 1000);
    if (expDate < new Date()) {
      return done(null, false);
    }
    var user = jwtPayload;
    done(null, user);
  })
);
