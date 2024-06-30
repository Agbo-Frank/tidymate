import { Router } from "express";
import cltr from "./controller"
import valid, { emailValidator, passwordValidator } from "./validator"
import guard, { guardValid } from "../../middleware/guard";
import passport from "passport"
import GoogleStrategy from "passport-google-oidc"

const router = Router()

passport.use(new GoogleStrategy({
  clientID: "1085337230569-a0o0pj4uotd96mittl6ecohe9crnanfc.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  console.log(issuer, profile)
}))
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    console.log(user)
    // cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
router.post("/auth/login", valid.login, cltr.login)
router.get("/auth/google", passport.authenticate('google'))
router.post("/auth/register", valid.register, cltr.register)
router.post("/auth/send-otp", emailValidator, cltr.sendOTP)
router.post("/auth/verify-otp", valid.verifyOtp, cltr.verifyOtp)
router.post("/auth/reset-password", passwordValidator, guardValid, guard, cltr.resetPassword)

export default router