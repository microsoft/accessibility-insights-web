// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path')
const webpack = require('webpack');
//const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonPlugins = [
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, // Must be greater than or equal to one
        minChunkSize: 1000000
    }),
    // This runs typechecking and tslint against all files that tsconfig.json specifies,
    // even those which are not dependencies of any entry points, eg, tests
    new ForkTsCheckerWebpackPlugin({
        tsconfig: './tsconfig.json',
        tslint: './tslint.build-enforced.json',
        useTypescriptIncrementalApi: true,
        async: false
    })
];

const commonEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/stylesheet-init.ts'), path.resolve(__dirname, 'src/injected/client-init.ts')],
    popup: path.resolve(__dirname, 'src/popup/scripts/popup-init.ts'),
    insights: [path.resolve(__dirname, 'src/views/insights/initializer.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/details-view-initializer.ts')],
    devtools: [path.resolve(__dirname, 'src/devtools/dev-tool-init.ts')],
    background: [
        'script-loader!' + path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
        path.resolve(__dirname, 'src/background/background-init.ts'),
    ]
}

const commonConfig = {
    entry: commonEntryFiles,
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    // This disables typechecking during the webpack pipeline; we use ForkTsCheckerWebpackPlugin instead
                    transpileOnly: true,
                    experimentalWatchApi: true
                }
            }],
            exclude: ['/node_modules/']
        }]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: commonPlugins,
    node: {
        setImmediate: false
    }
};

const devConfig = {
    ...commonConfig,
    name: 'dev',
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        ...commonPlugins,
        // commenting out to see if this change causes webpack to crash
        // // This ensures that "grunt watch" will catch tslint errors in test files
        // new ExtraWatchWebpackPlugin({
        //     files: ['src/**/*.ts', 'src/**/*.tsx']
        // })
    ],
    output: {
        path: path.join(__dirname, "extension/devBundle"),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: false,
    }
};

const prodConfig = {
    ...commonConfig,
    name: 'prod',
    mode: 'production',
    devtool: false,
    output: {
        path: path.join(__dirname, "extension/prodBundle"),
        filename: '[name].bundle.js',
        pathinfo: false,
    },
    optimization: {
        splitChunks: false,
        minimizer: [new UglifyJsPlugin({
            sourceMap: false,
            uglifyOptions: {
                compress: false,
                mangle: false,
                output: {
                    ascii_only: true,
                    comments: /^\**!|@preserve|@license|@cc_on/i,
                    beautify: false,
                }
            }
        })]
    }
};

// Use "webpack --config-name dev" or "webpack --config-name prod" to use just one or the other
module.exports = [devConfig, prodConfig];
