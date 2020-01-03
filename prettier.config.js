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
            files: [
                'src/ad-hoc-visualizations/**/*',
                'src/assessments/**/*',
                'src/background/**/*',
                'src/Devtools/**/*',
                'src/electron/**/*',
                'src/popup/**/*',
                'src/scanner/**/*',
                'src/types/**/*',
            ],
            options: {
                printWidth: 100,
            },
        },
    ],
};
