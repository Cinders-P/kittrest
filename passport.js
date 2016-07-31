const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./user.js');

module.exports = (passport) => {
	passport.serializeUser = (localUser, twitterUser, done) => {
		done(null, localUser.id);
	};
	passport.deserializeUser = (id, twitterUser, done) => {
		User.findOne({ id }, (err, user) => {
			done(err, user);
		});
	};

	passport.use('twitter', new TwitterStrategy({
		consumerKey: process.env.CONSUMER_KEY,
		consumerSecret: process.env.CONSUMER_SECRET,
		callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback',
	}, (token, tokenSecret, profile, done) => {
		process.nextTick(() => {
			User.findOne({ id: profile.id }, (err, user) => {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, user);
				}

				const newUser = new User;
				newUser.id = profile.id;
				newUser.token = token;
				newUser.handle = profile._json.screen_name;
				newUser.name = profile._json.name;
				newUser.photo = profile._json.profile_image_url;

				newUser.save((err) => {
					if (err) console.error(err);
					return done(null, newUser);
				});
			});
		});
	}));
};
