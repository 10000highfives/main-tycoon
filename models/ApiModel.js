const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./UserModel');



var ApiSchema = Schema({
	userId: { type: Number, ref: 'User' },
	scrapeURL: String,
	githubUsername: String
});


module.exports = mongoose.model('ApiLink', ApiSchema);
