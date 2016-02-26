const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./../models/UserModel');

module.exports = function (req, res, next) {
	var user = new User();
	user.githubUsername = req.username;
	user.save((err) => {
		if (err) throw new Error('error writing user :', err);

		//if user already exists they should be rerouted; for now a doc is created for every login
		next();
	});
}
