// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const express = require('express');

function startMockService(port, path) {
    return new Promise(resolve => {
        const options = { extensions: 'json' };

        const app = express();
        app.use('/AccessibilityInsights', express.static(path, options));

        app.listen(parseInt(port, 10), 'localhost', () => {
            console.log(`Running mock Accessibility Insights Service for Android on port ${port}`);
            resolve();
        });
    });
}

module.exports = {
    startMockService,
};
