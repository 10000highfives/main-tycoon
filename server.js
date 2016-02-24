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

app.get('/tycooned/:id', function(req, res) {
	var id = new ObjectID(req.params.id);

	MongoClient(function(err, db) {
		db.collection('apiCollection').findOne({_id: id}, function(err, result) {
			if (result) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}

			db.close();
		});
	});
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

app.get('/getAccessToken', githubOAuth.getAccessToken, githubOAuth.getUserInfo);

// app.get('*', function(req, res, next) {
//   console.log(req)
//   res.redirect(req.cookies.website + req.originalUrl);
// });






app.listen(4000);
