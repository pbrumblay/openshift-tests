'use strict';

const test = require('tape');
const client = require('superagent');


test('Verify the test application is running', function (t) {
    client
        .get('http://purchase-history-test.apps.10.2.2.2.xip.io/healthcheck')
        .end((err, res) => {
            t.plan(2);
            t.ok(res.status === 200, 'Healthcheck responded with 200.');
            t.ok(res.text.indexOf('Up and running') >= 0, 'Content contained "up and running"')
        });
});

test.onFinish(function() {
    console.log(this.pass);
    process.exit();
});

