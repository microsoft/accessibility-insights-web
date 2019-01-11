// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

let server = null;

module.exports = {
    startServer: function () {
        var app = express();
        app.use(serveStatic(path.join(__dirname, '../test-resources')));
        server = app.listen(8479);
    },
    stopServer: function () {
        server.close();
    }

};
