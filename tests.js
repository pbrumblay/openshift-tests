'use strict';


var client = require('superagent');
var restify = require('restify');

var server = restify.createServer();

function runTests(req, response, next) {
    client
        .get('http://purchase-history-test.apps.10.2.2.2.xip.io/healthcheck')
        .end(function(err, res) {
            if(res.status === 200 && res.text.indexOf('Up and running') >= 0) response.send("healthcheck returned success");
            next();
        });
}

server.get('/runtests', runTests);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});






