'use strict';
var fs = require('fs');
var express = require('express');
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var phantom = require('phantom');
var MongoClient = require('./mongodb');
var ObjectID = require('mongodb').ObjectID;
var cheerio = require('./controllers/cheerio');
var githubOAuth = require('./GithubService/githubOAuth');
var createUser = require('./controllers/createUser');
var User = require('./models/UserModel');
var Api = require('./models/ApiModel');


var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', githubOAuth.isLoggedIn ,function(req, res) {

	//get userId and set to cookieID
	//res.cookie('apitycID', req.cookies.githubToken)
	if (!req.cookies.apitycID || req.cookies.apitycID === 'null') {
			var newUser = new User();
			var uniqueID = newUser._id;
			console.log('username here? ', req.username);
			console.log('uniqueID', uniqueID);
			// db.collection('apiCollection').insert({}, function(err, doc) {
			// 	var uniqueID = doc.ops[0]._id;
			res.cookie('apitycID', uniqueID);
			res.send(fs.readFileSync(__dirname + '/index.html', 'utf8'));
			// 	db.close();
			// });
		}

    // if you need to see how to access the object after finding it
    //   MongoClient(function(err, db) {
    //     //var objID = new ObjectID(req.cookies.apitycID);
		 //
    //     db.collection('apiCollection').findOne({_id: objID}, function(err, result) {
    //       console.log(result);
    //       res.send(fs.readFileSync(__dirname + '/index.html', 'utf8'));
    //       db.close();
    //     });
    //  });
	 else {
		res.send(fs.readFileSync(__dirname + '/index.html', 'utf8'));

	}
});

app.get('/blank.html', function(req, res) {
  res.sendFile(__dirname + '/blank.html');
})

app.post('/apireqpost/post.stf', function(req, res, next) {
    res.cookie('website', req.body.website);
    res.send();
});

app.get('/apireqget/get.stf', function(req, res) {
  // console.log(req.cookies.website);

	phantom.create().then(function(ph) {
		ph.createPage().then(function(page) {
			page.setting('userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.256');
			page.open(req.cookies.website).then(function(status) {
				page.property('content').then(function(content) {
					res.send(content);
					page.close();
					ph.exit();
				});
			});
		});
	});

});

app.get('/apireqget/*', function(req, res) {
	res.redirect(req.cookies.website + '/' + req.originalUrl.slice(10));
});

app.get('/goodbye.html', function(req, res) {
	res.sendFile(__dirname + '/goodbye.html');
});

app.post('/apisubmit', function(req, res) {
  var url = req.cookies.website;
  var id = req.cookies.apitycID;

  //console.log('ID ID', id, 'url', url,' req body ', req.body);
  //console.log('these are the queries ', req.body);
	//find username passed down from github

	res.cookie('queries', req.body)
	res.cookie('apitycID', 'null');
  res.send(id);
});

app.get('/api/:id', function(req, res) {
	console.log('getting to api: scraped url: ', req.cookies.website);
	console.log('getting username: ', req.cookies.ghUser);
	console.log('getting queries from cookie ', req.cookies.queries);
	var id = req.params.id;
	var scrapeURL = req.cookies.website;
	var queries = req.cookies.queries;
	var username = req.cookies.ghUser;

	// User.find({githubUsername: '10000highfives'}, function (err, user) {
	// 	if (err) throw new Error('error query db ', user);
	// 	console.log('user in db is ', user[0]);
	// })

	//save API to db with link to user;
	var savedAPI = new Api();
	savedAPI.scrapeURL = scrapeURL;
	savedAPI.githubUsername = username;

	savedAPI.find({scrapeURL: scrapeURL}, function (err, s) {
		if (err) throw new Error()
	})
  cheerio.getData(scrapeURL, [queries]).then(function(data) {
    // console.log(data);
    res.send(data);
  });
});



app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/githubOAuth', githubOAuth.redirectToGithub);

app.get('/getAccessToken', githubOAuth.getAccessToken, githubOAuth.getUserInfo, createUser, (req,res) => {
	//if (err) throw err;
	console.log('made it through createUser');
	res.sendFile(__dirname + '/index.html');
});

// app.get('*', function(req, res, next) {
//   console.log(req)
//   res.redirect(req.cookies.website + req.originalUrl);
// });






app.listen(4000);
