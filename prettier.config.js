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
            files: ['src/content/**/*', 'src/tests/unit/tests/DetailsView/**/*'],
            options: {
                printWidth: 140,
            },
        },
    ],
};
