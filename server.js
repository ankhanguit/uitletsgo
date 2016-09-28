﻿require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: [
    '/api/users/authenticate',
    '/api/users/register',
    '/api/users/update',
    '/api/users/requestChangePassword',
    '/api/users/validateDynamicCode',
    '/api/users/updatePassword',
    '/api/users/newPassword',
    '/api/groups/add',
    '/api/groups/update',
    '/api/groups/get',
	'/api/groups/search',
    '/api/groups/delete'

] }));

// routes
app.use('/site', require('./controllers/site.controller'));
app.use('/user', require('./controllers/user.controller'));
app.use('/group', require('./controllers/group.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/groups', require('./controllers/api/groups.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/site/login');
});

// start server
var server = app.listen(process.env.PORT, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});