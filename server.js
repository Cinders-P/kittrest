// DEPENDENCIES
const express = require('express');
const stylus = require('stylus');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const Pin = require('./pin.js');

// SETTINGS
mongoose.connect(process.env.DB);

app.use(require('morgan')('dev'));
app.use(require('compression')());
app.use(stylus.middleware({
	src: path.join(__dirname, 'stylesheets'),
	dest: path.join(__dirname, 'static'),
	compile(str, path) {
		return stylus(str)
			.set('filename', path)
			.set('compress', true);
	},
}));
app.use(cookieParser(process.env.COOKIE));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: process.env.COOKIE,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
require('./passport.js')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'static')));

// ROUTES
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/',
	failureRedirect: '/',
}));
app.get('/user', (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user);
	} else {
		res.json({});
	}
});
app.get('/pins', (req, res) => {
	if (req.query.search) {
		Pin.find({ author: req.query.search }, (err, pins) => {
			if (err) console.error(err);
			if (!pins) {
				res.json([]);
			} else {
				res.json(pins);
			}
		});
	} else {
		Pin.find({}, (err, pins) => {
			if (err) console.error(err);
			if (!pins) {
				res.json([]);
			} else {
				res.json(pins);
			}
		});
	}
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
app.post('/delete', (req, res) => {
	if (!req.user) {
		res.end();
		return;
	}
	Pin.findById(req.body.id, (err, pin) => {
		if (pin.author === req.user.handle) {
			new Promise(resolve => {
				Pin.findOneAndRemove({ _id: req.body.id }, resolve);
			}).then(() => {
				if (req.body.search) {
					Pin.find({ author: req.body.search }, (err, pins) => {
						if (err) console.error(err);
						if (!pins) {
							res.json([]);
						} else {
							res.json(pins);
						}
					});
				} else {
					Pin.find({}, (err, pins) => {
						if (err) console.error(err);
						if (!pins) {
							res.json([]);
						} else {
							res.json(pins);
						}
					});
				}
			});
		} else {
			res.end();
		}
	});
});
app.post('/like', (req, res) => {
	new Promise(resolve => {
		Pin.findById(req.body.id, (err, pin) => {
			if (!pin || err) {
				res.end();
				resolve();
				return;
			}
			if (req.isAuthenticated()) {
				(pin.likers.includes(req.user.handle)) ?
				Pin.findOneAndUpdate({ _id: req.body.id }, { $pull: { likers: req.user.handle }, $inc: { likes: -1 } }, resolve) :
					Pin.findOneAndUpdate({ _id: req.body.id }, { $push: { likers: req.user.handle }, $inc: { likes: 1 } }, resolve);
			} else {
				const sid = req.signedCookies['connect.sid'];
				(pin.likers.includes(sid)) ?
				Pin.findOneAndUpdate({ _id: req.body.id }, { $pull: { likers: sid }, $inc: { likes: -1 } }, resolve) :
					Pin.findOneAndUpdate({ _id: req.body.id }, { $push: { likers: sid }, $inc: { likes: 1 } }, resolve);
			}
		});
	}).then(() => {
		if (req.body.search) {
			Pin.find({ author: req.body.search }, (err, pins) => {
				if (err) console.error(err);
				if (!pins) {
					res.json([]);
				} else {
					res.json(pins);
				}
			});
		} else {
			Pin.find({}, (err, pins) => {
				if (err) console.error(err);
				if (!pins) {
					res.json([]);
				} else {
					res.json(pins);
				}
			});
		}
	});
});
app.post('/post', (req, res) => {
	const newPin = new Pin;
	if (req.isAuthenticated()) {
		newPin.author = req.user.handle;
		newPin.dp = req.user.photo;
	}
	newPin.image = req.body.image;
	newPin.desc = req.body.desc;
	newPin.save((err) => {
		if (err) console.error(err);
		Pin.find({}, (err, pins) => {
			if (err) console.error(err);
			res.json(pins);
		});
	});
});
app.use('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/home.html'));
});
app.use((req, res) => {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => { console.log('Running.'); });
