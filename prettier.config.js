// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    endOfLine: 'lf',
    printWidth: 140,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: 'src/popup/**/*',
            options: {
                printWidth: 80,
            },
        },
        {
            files: 'src/background/**/*',
            options: {
                printWidth: 120,
            },
        },
    ],
};
