// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    endOfLine: 'lf',
    printWidth: 100,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: [
                'src/content/**/*',
                'src/tests/unit/tests/DetailsView/**/*',
                'src/tests/unit/tests/injected/adapters/**/*',
                'src/tests/unit/tests/injected/analyzers/**/*',
                'src/tests/unit/tests/injected/components/**/*',
                'src/tests/unit/tests/injected/frameCommunicators/**/*',
                'src/tests/unit/tests/injected/styles/**/*',
                'src/tests/unit/tests/injected/visualization/**/*',
            ],
            options: {
                printWidth: 140,
            },
        },
    ],
};
