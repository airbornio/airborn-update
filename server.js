require('newrelic');

var fs = require('fs');
var crypto = require('crypto');
var JSZip = require('jszip');
var jsyaml = require('js-yaml');

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

var airborn = walk('airborn');
var marketplace = walk('marketplace');
var firetext = walk('firetext');
var history = walk('history');

var v1 = (function() {
	var zip = new JSZip();
	var shasum = crypto.createHash('sha1');
	airborn.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path, contents);
		shasum.update(contents);
	});
	var currentId = shasum.digest('hex');
	zip.file('airborn/version-id', currentId);
	var current = zip.generate({type: 'nodebuffer'});
	return {
		currentId: currentId,
		current: current
	};
})();
var v2 = (function() {
	var zip = new JSZip();
	var shasum = crypto.createHash('sha1');
	airborn.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('airborn/', 'Core/'), contents);
		shasum.update(contents);
	});
	marketplace.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('marketplace/', 'Apps/marketplace/'), contents);
		shasum.update(contents);
	});
	firetext.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('firetext/', 'Apps/firetext/'), contents);
		shasum.update(contents);
	});
	history.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('history/', 'Apps/history/'), contents);
		shasum.update(contents);
	});
	var currentId = shasum.digest('hex');
	zip.file('Core/version-id', currentId);
	var current = zip.generate({type: 'nodebuffer'});
	return {
		currentId: currentId,
		current: current
	};
})();

app.get('/current', function(req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Content-Type', 'application/zip');
	res.send(200, v1.current);
});

app.get('/current-id', function(req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	res.send(200, v1.currentId);
});

app.get('/v2/current', function(req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Content-Type', 'application/zip');
	res.send(200, v2.current);
});

app.get('/v2/current-id', function(req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	res.send(200, v2.currentId);
});

app.get(/^\/v2\/live(\/.*)$/, function(req, res) {
	var pathMap = {
		'/Core/': 'airborn/',
		'/Apps/marketplace/': 'marketplace/',
		'/Apps/firetext/': 'firetext/',
		'/Apps/history/': 'history/'
	};
	var path = req.params[0];
	if(path === '/Apps/') {
		var results = {};
		results['marketplace/'] =
		results['firetext/'] =
		results['history/'] =
			{created: new Date()};
		res.send(jsyaml.safeDump(results, {flowLevel: 1}));
		return;
	}
	if(!Object.keys(pathMap).some(function(key) {
		if(path.substr(0, key.length) === key) {
			path = path.replace(key, pathMap[key]).replace(/\.\./g, '');
			console.log(path, path.substr(-1));
			res.sendFile(path, {root: __dirname});
			return true;
		}
	})) {
		res.send(404);
	}
});

var server = app.listen(process.env.PORT || 8080, function() {
	console.log('Listening on port %d', server.address().port);
});