// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { commonEntryFiles, createCommonConfig } = require('./webpack.common.config');

const devConfig = {
    ...createCommonConfig(commonEntryFiles),
    name: 'dev',
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
        path: path.join(__dirname, 'extension/devBundle'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: false,
    },
};

const prodConfig = {
    ...createCommonConfig(commonEntryFiles),
    name: 'prod',
    mode: 'production',
    devtool: false,
    output: {
        path: path.join(__dirname, 'extension/prodBundle'),
        filename: '[name].bundle.js',
        pathinfo: false,
    },
    optimization: {
        splitChunks: false,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,
                uglifyOptions: {
                    compress: false,
                    mangle: false,
                    output: {
                        ascii_only: true,
                        comments: /^\**!|@preserve|@license|@cc_on/i,
                        beautify: false,
                    },
                },
            }),
        ],
    },
};

// Use "webpack --config-name dev", "webpack --config-name prod" or "webpack --config-name electron" to use just one or the other
module.exports = [devConfig, prodConfig];
