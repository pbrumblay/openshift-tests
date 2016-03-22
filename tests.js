'use strict';


var client = require('superagent');
var restify = require('restify');
var test = require('tape');
var server = restify.createServer();
var testUrl = process.env.TEST_URL;

function runTests(cb) {
    console.log('running tests...');
    var harness = test.createHarness();
    var results = {};
    results.text = "";

    //tests
    harness.createStream().on('data', function (row) {
        results.text = results.text + row
    });

    harness('Verify the test application is running', function (t) {
        client
        .get(testUrl)
        .end(function(err, res) {
            t.plan(2);
            t.ok(res.status === 200, 'Healthcheck responded with 200.');
            t.ok(res.text.indexOf('Up and running') >= 0, 'Content contained "up and running"');
            results.allPassed = t._ok;
            console.log('tests complete.');
            cb(results);
        });
    });
}

//restify endpoint for viewing results.
function reportResults(req, response, next) {
    runTests(function(results) {
	console.log(JSON.stringify(results));
        console.log(results.text);
        if(results.allPassed) {
            response.status(200);
        } else {
            response.status(500);
        }
        response.setHeader('content-type', 'text/plain');
        response.send(results.text);
        next();        
    });
}

server.get('/', reportResults);
server.on('NotFound', function (request, response, cb) {
    console.log('Not Found');
    console.log(request.method);
    console.log(request.url);
    console.log(JSON.stringify(request.rawHeaders));
    response.send(404, "Not Found.");
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});






