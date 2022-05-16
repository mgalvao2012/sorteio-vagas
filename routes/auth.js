var passport = require("passport");
var OpenIDConnectStrategy = require("passport-openidconnect");

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: "https://" + process.env["AUTH0_DOMAIN"] + "/",
      authorizationURL: "https://" + process.env["AUTH0_DOMAIN"] + "/authorize",
      tokenURL: "https://" + process.env["AUTH0_DOMAIN"] + "/oauth/token",
      userInfoURL: "https://" + process.env["AUTH0_DOMAIN"] + "/userinfo",
      clientID: process.env["AUTH0_CLIENT_ID"],
      clientSecret: process.env["AUTH0_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect",
      scope: ["profile"],
    },
    function verify(issuer, profile, cb) {
      return cb(null, profile);
    }
  )
);

var express = require("express");
var qs = require("querystring");
var router = express.Router();

router.get("/login", passport.authenticate("openidconnect"));

router.get("/logout", (request, response) => {
  resquest.oidc.logout({
    returnTo: "/",
  });
});

router.get(
  "/oauth2/redirect",
  passport.authenticate("openidconnect", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
