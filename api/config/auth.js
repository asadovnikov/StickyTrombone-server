// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID' 		: 'your-secret-clientID-here', // your App ID
        'clientSecret' 	: 'your-client-secret-here', // your App Secret
        'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey' 		: 'your-consumer-key-here',
        'consumerSecret' 	: 'your-client-secret-here',
        'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID' 		: '749051342564-070i4bt0le5jim6irk8gvfv3smc2dff2.apps.googleusercontent.com',
        'clientSecret' 	: 'NmUw3No9lJN5o7JxpHESUzlB',
        'callbackURL' 	: 'http://localhost:5000/auth/google/callback'
    }
};