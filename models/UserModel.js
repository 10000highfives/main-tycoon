const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ApiLink = require('./ApiModel');


var UserSchema = Schema({
	githubUsername: String,
	apiLinks: [ {type: Schema.Types.ObjectId, ref: 'ApiLink'} ]
});

module.exports = mongoose.model('User', UserSchema);
