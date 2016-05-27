'use strict';

var express = require('express');
var app = express();

var errhandler = require('errorhandler');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var compress = require('compression');
var cors = require('cors');
var flash = require('connect-flash');
var session = require('express-session');

var tenantMw = require('./modules/tenant_middleware');
var config = require('./config');
var authRoute = require('./routes/auth');
var postRoute = require('./routes/post');
var tenantRoute = require('./routes/tenant');
var userRoute = require('./routes/user');
var imageRoute = require('./routes/image');
var subscriptionRoute = require('./routes/subscription');

require('./config/passport')(passport); // pass passport for configuration

app.use(cors());
app.use(tenantMw());
app.use(bodyParser.urlencoded({ extended: true, limit: '4mb' }));
app.use(bodyParser.json({ limit: '4mb' }));
app.use(compress());

//TODO: rework secret
// required for passport
app.use(session({ secret: 'maaaaattrriiiiixxxx44444442' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(errhandler());

mongoose.connect(config.mongo_url);

// ROUTES FOR OUR API.
// =============================================================================
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'API root' });
});

app.use('/', router);

authRoute(app, passport); // load our routes
postRoute.init(router);
tenantRoute.init(router);
userRoute.init(router);
imageRoute.init(router);
subscriptionRoute.init(router);


// START THE SERVER
// =============================================================================
app.listen(config.port);
console.log('Listening on port ' + config.port);
