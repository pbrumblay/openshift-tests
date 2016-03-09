'use strict';


var client = require('superagent');
var restify = require('restify');
var test = require('tape');
var server = restify.createServer();

//tests
var results = "";
test.createStream().on('data', function (row) {
    results = results + row
});


test('Verify the test application is running', function (t) {
    client
        .get('http://purchase-history-test.apps.10.2.2.2.xip.io/healthcheck')
        .end((err, res) => {
            t.plan(2);
            t.ok(res.status === 200, 'Healthcheck responded with 200.');
            t.ok(res.text.indexOf('Up and running') >= 0, 'Content contained "up and running"')
        });
});

//restify endpoint for viewing results.
function reportResults(req, response, next) {
    console.log(results);
    response.setHeader('content-type', 'text/plain');
    response.send(results);
    next();
}

server.get('/', reportResults);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});






