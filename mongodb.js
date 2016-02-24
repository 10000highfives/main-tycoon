var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const mongoURI = 'mongodb://team-big-gulp:biggulp14@ds015478.mongolab.com:15478/big-gulp-api';

mongoose.connect(mongoURI);

const db = mongoose.connection;



// MongoClient.connect('mongodb://team-big-gulp:biggulp14@ds015478.mongolab.com:15478/big-gulp-api', function(err, db) {
//   db.createCollection('api-collection', { validator:
//     { $or: {
//       apiURL: { $type: 'string'},
//       }
//     }
//   }, function(err, result) {
//     db.close();
//   });
// });

module.exports = MongoClient.connect.bind(null, 'mongodb://team-big-gulp:biggulp14@ds015478.mongolab.com:15478/big-gulp-api');
