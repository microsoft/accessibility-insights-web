// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const express = require('express');

function startMockService(port, filesPath, testLogsDir) {
    return new Promise(resolve => {
        const options = { extensions: 'json' };
        const testLogsPath = path.join(testLogsDir, 'server.log');
        const app = express();

        app.use(function (req, res, next) {
            fs.writeFileSync(testLogsPath, `${req.method} ${req.url}\n`, {
                flag: 'a',
            });
            next();
        });
        app.use('/AccessibilityInsights', express.static(filesPath, options));

        app.listen(parseInt(port, 10), 'localhost', () => {
            console.log(`Running mock Accessibility Insights Service for Android on port ${port}`);
            resolve();
        });
    });
}

module.exports = {
    startMockService,
};
