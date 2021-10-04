// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');

module.exports = {
    result: fs.readFileSync(path.join(__dirname, 'assets/result.json'), 'utf8'),
    config: fs.readFileSync(path.join(__dirname, 'assets/config.json'), 'utf8'),
};
