// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('node:path');
const { run: jscodeshift } = require('jscodeshift/src/Runner');

const transformPath = path.resolve('./tools/jscodeshift/convert-enzyme-to-rtl.js');
const paths = ['./src/tests/unit/tests/debug-tools/components/debug-tools-view.test.tsx'];
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
