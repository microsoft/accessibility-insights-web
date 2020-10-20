// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const baseConfig = require('../../jest.config.base');
const package = require('./package');

module.exports = {
    ...baseConfig,
    displayName: package.name,
};
