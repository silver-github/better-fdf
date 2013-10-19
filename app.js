
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 10085);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', 					routes.home);
app.get('/api', 				routes.api);
app.get('/rss/fragen', 			routes.rss.fragen);
app.get('/rss/anforderungen', 	routes.rss.anforderungen);
app.get('/rss/dokumente', 		routes.rss.dokumente);
app.get('/fragen', 				routes.fragen);
app.get('/fragen/:hash', 		routes.fragenDetails);
app.get('/anforderungen', 		routes.anforderungen);
app.get('/anforderungen/:hash', routes.anforderungenDetails);
app.get('/dokumente', 			routes.dokumente);
app.get('/dokumente/:hash', 	routes.dokumenteDetails);
app.get('/codenummern', 		routes.codenummern);
app.get('/codenummern/:hash', 	routes.codenummernDetails);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
