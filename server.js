var fs = require('fs');
var express = require('express');
//var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var phantom = require('phantom');
var MongoClient = require('./mongodb');
var ObjectID = require('mongodb').ObjectID;
var cheerio = require('./controllers/cheerio');
var qs = require('querystring');
var githubOAuth = require('./config');

var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function(req, res) {
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
<<<<<<< HEAD
  res.sendFile(__dirname + '/blank.html');
})

app.post('/apireqpost/post.stf', function(req, res, next) {
    res.cookie('website', req.body.website);
    res.send();
=======
	res.sendFile(__dirname + '/blank.html');
});

app.post('/apireqpost/post.stf', function(req, res) {
	res.cookie('website', req.body.website);
	res.send();
>>>>>>> 7bffeaf1c54da9083d205f0f95ac7396e33a55f8
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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
	console.log('getting to apisumbit');
	var url = req.cookies.website;
	var id = new ObjectID(req.cookies.apitycID);
	var queries = req.body;



	MongoClient(function(err, db) {
		db.collection('apiCollection').updateOne({_id: id}, { $set: { url: url, queries: queries}}, function(err, result) {
			console.log('updated queries', queries);
			db.close();
		});
	});

	res.cookie('apitycID', 'null');
	res.send(id);
>>>>>>> 7bffeaf1c54da9083d205f0f95ac7396e33a55f8

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

app.post('/githubOAuth', function(req, res) {
  var url = 'https://github.com/login/oauth/authorize/?' +
  'scope=user&' +
  `client_id=${githubOAuth.client_id}&` +
  'redirect_uri=http://localhost:4000/getAccessToken';
  res.redirect(url);
})

app.get('/getAccessToken', function(req, res) {
  console.log('query string', req.query.code);
  var queryForAccessToken = {
    client_id: githubOAuth.client_id,
    client_secret: githubOAuth.client_secret,
    code: req.query.code
  }
  var url = 'https://github.com/login/oauth/access_token/?' + qs.stringify(queryForAccessToken);
  var options = {
    url: url,
    headers: {
      'user-agent': 'api-tycoon'
    },
    json: true
  }
  request(options, function(err, resp, body) {
    res.cookie(body.access_token);
    res.redirect()
  });
})

// app.get('*', function(req, res, next) {
//   console.log(req)
//   res.redirect(req.cookies.website + req.originalUrl);
// });






app.listen(4000);
