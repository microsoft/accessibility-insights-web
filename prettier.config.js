// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    endOfLine: 'lf',
    printWidth: 100,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    // We'd like to remove this arrowParens setting and use the new Prettier 2.0 default
    // But since it has a lot of conflict potential, defering that until a quiet weekend
    arrowParens: 'avoid',
    overrides: [
        {
            files: ['src/content/**/*'],
            options: {
                printWidth: 140,
            },
        },
    ],
};
