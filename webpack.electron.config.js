// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const webpack = require('webpack');
const { createCommonConfig } = require('./webpack.common.config');

const electronEntryFiles = {
    main: [path.resolve(__dirname, 'src/electron/main/main.ts')],
    injected: [path.resolve(__dirname, 'src/injected/stylesheet-init.ts'), path.resolve(__dirname, 'src/injected/client-init.ts')],
};

const electronConfig = {
    ...createCommonConfig(electronEntryFiles, true),
    name: 'electron',
    mode: 'development',
    output: {
        path: path.join(__dirname, 'extension/electronBundle'),
        filename: '[name].bundle.js',
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    optimization: {
        splitChunks: false,
    },
    target: 'electron-main',
};

module.exports = [electronConfig];
