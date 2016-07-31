const mongoose = require('mongoose');

const pinSchema = mongoose.Schema({
	author: { type: String, default: 'Anonymous' },
	likes: { type: Number, default: 0 },
	image: String,
	desc: String,
	dp: { type: String, default: '/default.jpg' },
	likers: { type: [String], default: [] },
});

module.exports = mongoose.model('KittrestPin', pinSchema);
