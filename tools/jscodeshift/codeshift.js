// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('node:path');

const transformPath = path.resolve('./tools/jscodeshift/convert-enzyme-to-rtl.js');
const paths = ['./src/tests/'];
const options = {
    // dry: true,
    // print: true,
    verbose: 2,
    extensions: 'tsx',
    parser: 'tsx',
    // ...
};

jscodeshift(transformPath, paths, options).then(res => {
    console.log(res);
});
