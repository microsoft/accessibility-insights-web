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
                'src/injected/**/*',
                'src/issue-filing/**/*',
                'src/popup/**/*',
                'src/reports/**/*',
                'src/scanner/**/*',
                'src/types/**/*',
                'src/views/**/*',
                'src/DetailsView/**/*',
            ],
            excludeFiles: ['src/DetailsView/components/**/*'],
            options: {
                printWidth: 100,
            },
        },
    ],
};
