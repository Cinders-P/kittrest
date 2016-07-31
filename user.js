const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	handle: String,
	name: String,
	id: String,
	token: String,
	photo: String,
});

module.exports = mongoose.model('KittrestUser', userSchema);
