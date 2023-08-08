// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getCSSModulesLoadersConfig = isDevMode => {
    return {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: isDevMode ? '[local]' : '[local][hash:base64:5]',
                    },
                    localsConvention: 'camelCaseOnly',
                },
            },
            'sass-loader',
        ],
    };
};

const commonPlugins = [
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, // Must be greater than or equal to one
        minChunkSize: 1000000,
    }),
    // Be warned: this plugin supports tslint, but enabling it here causes webpack to occasionally
    // process.exit(0) in the middle of execution on mac build machines, resulting in difficult to
    // debug build failures. We aren't quite sure why this is yet, but until it's root caused, keep
    // tslint separate from webpack.
    new ForkTsCheckerWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
    }),
];

const commonEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/stylesheet-init.ts'), path.resolve(__dirname, 'src/injected/client-init.ts')],
    popup: path.resolve(__dirname, 'src/popup/popup-init.ts'),
    insights: [path.resolve(__dirname, 'src/views/insights/initializer.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/details-view-initializer.ts')],
    devtools: [path.resolve(__dirname, 'src/Devtools/dev-tool-init.ts')],
    background: [path.resolve(__dirname, 'src/background/background-init.ts')],
};

const electronMainEntryFiles = {
    main: [path.resolve(__dirname, 'src/electron/main/main.ts')],
};

const electronRendererEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/stylesheet-init.ts'), path.resolve(__dirname, 'src/injected/electron-client-init.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/in-electron-initializer.ts')],
    background: [path.resolve(__dirname, 'src/background/in-electron-background-init.ts')],
    insights: [path.resolve(__dirname, 'src/views/insights/electron-initializer.ts')],
};

const commonConfig = {
    entry: commonEntryFiles,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    },
                ],
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: commonPlugins,
    node: {
        setImmediate: false,
    },
    performance: {
        // We allow higher-than-normal sizes because our users only have to do local fetches of our bundles
        maxEntrypointSize: 10 * 1024 * 1024,
        maxAssetSize: 10 * 1024 * 1024,
    },
};

const devModules = {
    rules: [...commonConfig.module.rules, getCSSModulesLoadersConfig(true)],
};

const prodModules = {
    rules: [...commonConfig.module.rules, getCSSModulesLoadersConfig(false)],
};

const createElectronConfig = (entry, nameAndTarget) => {
    return {
        ...commonConfig,
        module: devModules,
        entry,
        name: nameAndTarget,
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
        target: nameAndTarget,
    };
};

const electronMainConfig = createElectronConfig(electronMainEntryFiles, 'electron-main');

const electronRendererConfig = createElectronConfig(electronRendererEntryFiles, 'electron-renderer');

const devConfig = {
    ...commonConfig,
    module: devModules,
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
    ...commonConfig,
    module: prodModules,
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

// Use "webpack --config-name <cofig-name>" to use just one or the other
module.exports = [devConfig, prodConfig, electronMainConfig, electronRendererConfig];
