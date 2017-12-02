var fs = require('fs');
var crypto = require('crypto');
var JSZip = require('jszip');

var walk = function(dir) {
	var results = [];
	var list = fs.readdirSync(dir);
	list.forEach(function(file) {
		if(file[0] === '.') return;
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) results = results.concat(walk(file));
		else results.push(file);
	});
	return results;
}

var airborn = walk('airborn');
var firetext = walk('firetext');
var strut = walk('strut');

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
	var current = zip.generate({type: 'nodebuffer', compression: 'DEFLATE'});
	fs.writeFileSync('current-id', currentId);
	fs.writeFileSync('current', current);
})();
var v2 = (function() {
	var zip = new JSZip();
	var shasum = crypto.createHash('sha1');
	airborn.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('airborn/', 'Core/'), contents);
		shasum.update(contents);
	});
	firetext.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('firetext/', 'Apps/firetext/'), contents);
		shasum.update(contents);
	});
	strut.forEach(function(path) {
		var contents = fs.readFileSync(path);
		zip.file(path.replace('strut/', 'Apps/strut/'), contents);
		shasum.update(contents);
	});
	var currentId = shasum.digest('hex');
	zip.file('Core/version-id', currentId);
	var current = zip.generate({type: 'nodebuffer', compression: 'DEFLATE'});
	fs.writeFileSync('v2-current-id', currentId);
	fs.writeFileSync('v2-current', current);
})();