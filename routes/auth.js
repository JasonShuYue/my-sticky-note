var express = require('express');
var passport = require('passport');
var router = express.Router();
var GitHubStrategy = require('passport-github').Strategy;



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use(new GitHubStrategy({
        clientID: '64b7b326131bba52dc3e',
        clientSecret: '9dbef840320186c8c838c62756f70f63adf06152',
        callbackURL: "http://www.shuyuenote.top/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        done(null, profile);
    }
));

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
})

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {

        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
    });

module.exports = router;