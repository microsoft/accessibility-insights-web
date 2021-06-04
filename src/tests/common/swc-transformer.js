// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { readFileSync } = require('fs');
const { join } = require('path');
const { transformSync } = require('@swc/core');
const { merge } = require('lodash');

// This file can be replaced by @swc/jest once https://github.com/swc-project/jest/issues/8 resolves

const swcrcPath = join(__dirname, '..', '..', '..', '.swcrc');
const swcrc = JSON.parse(readFileSync(swcrcPath));

const jestTransformOverrides = {
    jsc: {
        transform: {
            hidden: {
                jest: true,
            },
        },
    },
    module: {
        type: 'commonjs',
    },
};

const baseTransformOptions = merge({}, swcrc, jestTransformOverrides);

module.exports = {
    process: (src, path) => {
        if (/\.(t|j)sx?$/.test(path)) {
            const transformOptions = merge({}, baseTransformOptions, {
                filename: path,
            });
            return transformSync(src, transformOptions);
        }
        return src;
    },
};
