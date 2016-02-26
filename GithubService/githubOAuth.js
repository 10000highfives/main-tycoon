'use strict';
var githubKeys = require('./../config');
var qs = require('querystring');
var request = require('request');
var User = require('./../models/UserModel')

module.exports = {

  redirectToGithub (req, res, next) {
    var url = 'https://github.com/login/oauth/authorize/?' +
    'scope=user&' +
    `client_id=${githubKeys.client_id}&` +
    'redirect_uri=http://localhost:4000/getAccessToken';
    res.redirect(url);
  },

  getAccessToken (req, res, next) {
    //console.log('query string', req.query.code);
    var queryForAccessToken = {
      client_id: githubKeys.client_id,
      client_secret: githubKeys.client_secret,
      code: req.query.code,
      redirect_uri: 'http://localhost:4000/'
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
      res.cookie('githubToken', body.access_token, { httpOnly: true });
      req.github = body.access_token;
      next();
    });
    //were not redirecting user to the oauth access-token github page so we cant use res.redirect
    // res.redirect(url);
    //access token can now be used to request information about the user
  },
  getUserInfo (req, res, next) {

    var url = 'https://api.github.com/'+ 'user?' + `access_token=${req.github}&` + 'user/emails';
    var options = {
      url: url,
      headers: {
        'user-agent': 'api-tycoon'
      },
      json: true
    }

    request(options, function(err, resp, body) {
      //body.login gives us the username - body also has a lot of other properties.
			req.username = body.login;

			console.log('req.username ', req.username);
			//set username to a cookie so it can be grabbed later
			res.cookie('ghUser', req.username);
			//create new user with body.login
			var user = new User();
			user.githubUsername = body.login;
			user.save((err) => {
				if (err) throw new Error('error saving username ', err);
				next();
			});
    });
  },

  isLoggedIn (req, res, next) {
      if (req.cookies.githubToken) next();
      else res.redirect('/login');
  }
}
