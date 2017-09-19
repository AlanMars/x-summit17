// index.js

var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

// Setup view engine - EJS, Embedded JavaScript templates
// Views is directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use res.render to load up ejs view files

// Workshop start page
app.get('/', function(request, response) {
    response.render('pages/start');
});

// Welcome page
app.get('/welcome', function(request, response) {
    response.render('pages/welcome');
});

// Themes page
app.get('/themes', function(request, response) {
    response.render('pages/themes');
});

// Speakers page
app.get('/speakers', function(request, response) {
    response.render('pages/speakers');
});

// FAQ page
app.get('/faq', function(request, response) {
    response.render('pages/faq');
});

// Register page
app.get('/register', function(request, response) {
    response.render('pages/register');
});

// Workshop End page
app.get('/end', function(request, response) {
    response.render('pages/end');
});


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
