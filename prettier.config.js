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
                'src/tests/unit/tests/electron/**/*',
                'src/tests/unit/tests/injected/**/*',
                'src/tests/unit/tests/issue-filing/**/*',
                'src/tests/unit/tests/popup/**/*',
            ],
            options: {
                printWidth: 140,
            },
        },
    ],
};
