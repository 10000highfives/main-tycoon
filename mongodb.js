//var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoURI = 'mongodb://team-big-gulp:biggulp14@ds015478.mongolab.com:15478/big-gulp-api';


mongoose.connect(mongoURI);

const db = mongoose.connection;

function addData (url) {
	var user = new UserModel();
	user.sessionId = session;
	user.authToken = atoken;
	console.log('loggin inside addData');
	if (user.apiLink) {
		user.apiLink.push({
			date: new Date(),
			url: url
		});
	}
	user.save((err) => {
		if (err) throw new Error ('error on write to db', err);
	});
}

// addData('http://www.espn.com')
// addData('http://www.twitter.com')
// addData('http://www.aol.com')




//module.exports = UserModel;
