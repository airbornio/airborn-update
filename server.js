require('newrelic');

var fs = require('fs');
var crypto = require('crypto');
var JSZip = require('jszip');

var express = require('express');
var app = express();

var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file);
    });
    return results;
}
var zip = new JSZip();
var shasum = crypto.createHash('sha1');
walk('airborn').forEach(function(path) {
	var contents = fs.readFileSync(path);
	zip.file(path, contents);
	shasum.update(contents);
});
var currentId = shasum.digest('hex');
zip.file('airborn/version-id', currentId);
var current = zip.generate({type: 'nodebuffer'});

app.get('/current', function(req, res) {
	res.set('Content-Type', 'application/zip');
	res.send(200, current);
});

app.get('/current-id', function(req, res) {
	res.send(200, currentId);
});

var server = app.listen(process.env.PORT || 8080, function() {
	console.log('Listening on port %d', server.address().port);
});