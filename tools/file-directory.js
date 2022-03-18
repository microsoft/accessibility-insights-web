// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const webpack = require('webpack');
const webpackConfigs = require('../webpack.config.js');

// Compiles webpack to retrieve every local file used in a given build.
// This allows us to associate a product with a changed file.
function fileDirectory() {
    // Skip `dev` webpack configs
    const configs = webpackConfigs.filter(({ name }) => !name.startsWith('dev'));
    return new Promise(resolve => {
        const directory = {};
        console.log('Creating directory of files to assign product to changed files...');
        webpack(configs, (err, stats) => {
            const all = stats.toJson({
                assets: false,
                hash: false,
                warnings: false,
                errors: false,
                chunks: false,
                entrypoints: false,
                chunkGroups: false,
            });
            for (const { name, modules } of all.children) {
                const files = formatFiles(modules);
                for (const file of files) {
                    if (!directory[file]) directory[file] = [];
                    directory[file] = [...directory[file], formatProductName(name)];
                }
            }
            resolve(directory);
        });
    });
}

module.exports = fileDirectory;

function formatProductName(name) {
    return name === 'prod' ? 'extension' : name;
}

function formatFiles(modules) {
    return [
        ...new Set(
            modules
                // clean file paths to match git log format
                .reduce((arr, { name }) => {
                    const match = name.match(/\.\/(src.*?\.(sc?ss|tsx?|jsx?))/);
                    if (match && match[1]) arr.push(match[1]);
                    return arr;
                }, []),
        ),
    ];
}
