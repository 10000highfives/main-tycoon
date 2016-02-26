//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const User = require('./models/UserModel');
const ApiLink = require('./models/ApiModel');

const mongoURI = 'mongodb://team-big-gulp:biggulp14@ds015478.mongolab.com:15478/big-gulp-api';

mongoose.connect(mongoURI);
const db = mongoose.connection;

// var session = 234234;
// var atoken = 23459082347345;

var addDataObject = {
	createNewUser: function(userEmail){
		var user = new UserModel();
		user.userEmail = userEmail;
		console.log('loggin inside create new User :', userEmail);

		user.save((err) => {
			if (err) throw new Error ('error on write to db', err);
		});
	},

	addData: function (url, userEmail) {
		db.User.findOne({userEmail: userEmail},function(err,docs){
			if(err){
				console.log(err);
			}
			console.log(docs);
			if(!docs.length){
				var newUser = this.createNewUser(userEmail);
				if (user.apiLink) {
					user.apiLink.push({
						date: new Date(),
						url: url
					});
			}

		});


	}
};

// function addData (url) {
// 	var user = new UserModel();
// 	user.sessionId = session;
// 	user.authToken = atoken;
// 	console.log('loggin inside addData');
// 	if (user.apiLink) {
// 		user.apiLink.push({
// 			date: new Date(),
// 			url: url
// 		});
// 	}
// 	user.save((err) => {
// 		if (err) throw new Error ('error on write to db', err);
// 	});
// }

// addData('http://www.google.com')
// addData('http://www.reddit.com')
// addData('http://www.facebook.com')




module.exports = { addData: addDataObject.addData };
