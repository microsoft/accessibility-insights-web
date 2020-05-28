// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var express = require('express');
var path = require('path');

var port = 9051;
var options = { extensions: 'json' };

var app = express();
app.use(
    '/AccessibilityInsights',
    express.static(path.join(__dirname, 'AccessibilityInsights'), options),
);

app.listen(port, 'localhost', () => {
    console.log(`Running mock Accessibility Insights Service for Android on port ${port}`);
});
