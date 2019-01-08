// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require("path")
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonPlugins = [
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, // Must be greater than or equal to one
        minChunkSize: 1000000
    }),
    new ForkTsCheckerWebpackPlugin()
];

const productionPlugins = commonPlugins.slice();

const devPlugins = commonPlugins.slice();

const entryFiles = {
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

const developmentConfig = {
    entry: entryFiles,
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true
                }
            }],
            exclude: ['/node_modules/']
        }]
    },
    output: {
        path: path.join(__dirname, "extension/devBundle"),
        filename: '[name].bundle.js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: devPlugins,
    node: {
        setImmediate: false
    },
    optimization: {
        splitChunks: false,
    }
};

module.exports = [
    developmentConfig,
    {
        ...developmentConfig,
        devtool: false,
        mode: 'production',
        plugins: productionPlugins,
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

    }
];