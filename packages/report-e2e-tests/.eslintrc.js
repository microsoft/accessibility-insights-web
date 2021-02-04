// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const baseModule = require('../../eslintrc.base');
module.exports = {
    ...baseModule,
    root: true,
    ignorePatterns: ['node_modules/', '**/*bundle.js', 'dist/', 'drop/', 'test-results/'],
};
