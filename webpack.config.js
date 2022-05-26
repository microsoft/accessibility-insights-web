// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const commonPlugins = [
    new ForkTsCheckerWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
        // Similar to the same options in webpackOptions.output
        filename: '[name].css',
        chunkFilename: '[id].css',
    }),
];

const commonEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/client-init.ts')],
    popup: [path.resolve(__dirname, 'src/popup/popup-init.ts')],
    insights: [path.resolve(__dirname, 'src/views/insights/initializer.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/details-view-initializer.ts')],
    devtools: [path.resolve(__dirname, 'src/Devtools/dev-tool-init.ts')],
    background: [path.resolve(__dirname, 'src/background/background-init.ts')],
    serviceWorker: [path.resolve(__dirname, 'src/background/service-worker-init.ts')],
    debugTools: path.resolve(__dirname, 'src/debug-tools/initializer/debug-tools-init.tsx'),
};

const electronEntryFiles = {
    renderer: [path.resolve(__dirname, 'src/electron/views/renderer-initializer.ts')],
    main: [path.resolve(__dirname, 'src/electron/main/main.ts')],
};

const tsRule = {
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
};

const reportPackageTsRule = {
    test: /\.tsx?$/,
    use: [
        {
            loader: 'ts-loader',
            options: {
                configFile: path.resolve(__dirname, 'packages/report/tsconfig.json'),
                transpileOnly: true,
                experimentalWatchApi: true,
            },
        },
    ],
    exclude: ['/node_modules/'],
};

const scssRule = (useHash = true) => ({
    test: /\.scss$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                esModule: true,
            },
        },
        {
            loader: 'css-loader',
            options: {
                esModule: true,
                modules: {
                    localIdentName: '[local]' + (useHash ? '--[hash:base64:5]' : ''),
                    exportLocalsConvention: 'camelCaseOnly',
                },
            },
        },
        'sass-loader',
    ],
});

const commonConfig = {
    entry: commonEntryFiles,
    module: {
        rules: [tsRule, scssRule(true)],
    },
    resolve: {
        // It is important that src is absolute but node_modules is relative. See #2520
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        // We only directly use .tsx and .ts, but some of our transitive dependencies directly
        // require .js or .json files
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    plugins: commonPlugins,
    performance: {
        // We allow higher-than-normal sizes because our users only have to do local fetches of our bundles
        maxEntrypointSize: 10 * 1024 * 1024,
        maxAssetSize: 10 * 1024 * 1024,
    },
    stats: {
        // This is to suppress noise from mini-css-extract-plugin
        children: false,
    },
};

const reportPackageConfig = {
    ...commonConfig,
    module: {
        rules: [reportPackageTsRule, scssRule(true)],
    },
};

const unifiedConfig = {
    ...commonConfig,
    entry: electronEntryFiles,
    name: 'unified',
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'extension/unifiedBundle'),
        filename: '[name].bundle.js',
    },
    node: {
        ...commonConfig.node,
        __dirname: false,
        __filename: false,
    },
    optimization: {
        splitChunks: false,
    },
    target: 'electron-main',
};

function isReactDevtoolsInstalled() {
    try {
        require.resolve('react-devtools');
        return true;
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return false;
        } else {
            throw error;
        }
    }
}
const reactDevtoolsEntryFiles = isReactDevtoolsInstalled() ? ['react-devtools'] : [];

const devConfig = {
    ...commonConfig,
    entry: {
        ...commonEntryFiles,
        detailsView: [...reactDevtoolsEntryFiles, ...commonEntryFiles.detailsView],
        popup: [...reactDevtoolsEntryFiles, ...commonEntryFiles.popup],
    },
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

const devMv3Config = {
    ...commonConfig,
    entry: {
        ...commonEntryFiles,
        detailsView: [...reactDevtoolsEntryFiles, ...commonEntryFiles.detailsView],
        popup: [...reactDevtoolsEntryFiles, ...commonEntryFiles.popup],
    },
    name: 'dev-mv3',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, 'extension/devMv3Bundle'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: false,
    },
};

const prodConfig = {
    ...commonConfig,
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
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: false,
                    mangle: true,
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

const packageReportConfig = {
    entry: {
        report: [path.resolve(__dirname, 'src/reports/package/reporter-factory.ts')],
    },
    module: reportPackageConfig.module,
    externals: [nodeExternals()],
    plugins: commonPlugins,
    resolve: reportPackageConfig.resolve,
    name: 'package-report',
    mode: 'development',
    devtool: false,
    output: {
        path: path.join(__dirname, 'packages/report/bundle'),
        filename: '[name].bundle.js',
        pathinfo: false,
        library: '[name]',
        libraryTarget: 'umd',
    },
    target: 'node',
};

const packageUIConfig = {
    entry: {
        ui: [path.resolve(__dirname, 'src/packages/accessibility-insights-ui/index.ts')],
    },
    module: { rules: [tsRule, scssRule(false)] },
    externals: [nodeExternals()],
    plugins: commonPlugins,
    resolve: commonConfig.resolve,
    name: 'package-ui',
    mode: 'development',
    devtool: false,
    output: {
        path: path.join(__dirname, 'packages/ui/bundle'),
        filename: '[name].bundle.js',
        pathinfo: false,
        library: '[name]',
        libraryTarget: 'umd',
    },
    target: 'node',
};

// For just one config, use "webpack --config-name dev", "webpack --config-name prod", etc
module.exports = [
    devConfig,
    devMv3Config,
    prodConfig,
    unifiedConfig,
    packageReportConfig,
    packageUIConfig,
];
