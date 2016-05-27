module.exports = function(app, passport) {

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', function(req, res, next) {
        req.session.redirect = req.query.return_url;
        next();
    }, passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            var returnUrl = req.session.redirect ? req.session.redirect : 'http://eventonizer.tk/';
            delete req.session.redirect;

            res.redirect(returnUrl);
        });
};
