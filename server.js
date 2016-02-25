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
var UserModel = require('./models/UserModel');

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', githubOAuth.isLoggedIn ,function(req, res) {
	if (!req.cookies.apitycID || req.cookies.apitycID === 'null') {
		MongoClient(function(err, db) {
			db.collection('apiCollection').insert({}, function(err, doc) {
				var uniqueID = doc.ops[0]._id;
				res.cookie('apitycID', uniqueID);
				res.send(fs.readFileSync(__dirname + '/index.html', 'utf8'));
				db.close();
			});
		});

    // if you need to see how to access the object after finding it
    // } else if (req.cookies.apitycID) {
    //   MongoClient(function(err, db) {
    //     var objID = new ObjectID(req.cookies.apitycID);

    //     db.collection('apiCollection').findOne({_id: objID}, function(err, result) {
    //       console.log(result);
    //       res.send(fs.readFileSync(__dirname + '/index.html', 'utf8'));
    //       db.close();
    //     });
    //  });
	} else {
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

//route to test db writing -- delete before deploying
app.get('/dbtest', (req,res) => {
	req.body.id = 'myUsername';
	console.log('body username ', req.body.id);
	var user = new UserModel();
	user.githubUsername = req.body.id;
	user.save((err) => {
		if (err) throw new Error('error writing to db ', err);
	});

	console.log('should write');
	res.send('http://www.codesmith.io');
})

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
  var id = new ObjectID(req.cookies.apitycID);
  var queries = req.body;

  console.log('ID ID', id, 'url', url, req.body);

  MongoClient(function(err, db) {
    db.collection('apiCollection').updateOne({_id: id}, { $set: { url: url, queries: queries}}, function(err, result) {
      //console.log('updated result', result);
      db.close();
    });
  });

  res.cookie('apitycID', 'null');
  res.send(id);

});

app.get('/api/:id', function(req, res) {
	console.log('getting to api ', req.url);
	var id = new ObjectID(req.params.id);
  // console.log('grabbed', id);
  //get data from mongodb

  MongoClient(function(err, db) {
    db.collection('apiCollection').findOne({_id: id}, function(err, result) {
       console.log('found user', result);
      var url = result.url;
      var queries = result.queries;
      cheerio.getData(url, [queries]).then(function(data) {
        // console.log(data);
        res.send(data);
      });
    });
  });
})

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/githubOAuth', githubOAuth.redirectToGithub);

app.get('/getAccessToken', githubOAuth.getAccessToken, githubOAuth.getUserInfo, createUser, (req,res) => {
	if (err) throw err;
	console.log('made it through createUser');
	res.send('index.html')
});

// app.get('*', function(req, res, next) {
//   console.log(req)
//   res.redirect(req.cookies.website + req.originalUrl);
// });






app.listen(4000);
