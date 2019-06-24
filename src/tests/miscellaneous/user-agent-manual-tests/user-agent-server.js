// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.var http = require('http');

// based on https://www.npmjs.com/package/ua-parser-js#using-nodejs

// to start the server either
// run from the root folder: node src\tests\miscellaneous\user-agent-manual-tests\user-agent-server.js
// run from this folder: node .\user-agent-server.js

const http = require('http');
const parser = require('ua-parser-js');

const localhost = '127.0.0.1';
const port = 1337;

http.createServer((req, res) => {
    let ua = parser(req.headers['user-agent']);

    ua['ua-parser-js'] = { version: parser.VERSION };

    res.end(JSON.stringify(ua, null, 4));
}).listen(port, localhost);

console.log(`Server running at http://${localhost}:${port}/`);
