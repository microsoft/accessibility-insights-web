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
                'src/common/**/*',
                'src/DetailsView/**/*',
                'src/Devtools/**/*',
                'src/electron/**/*',
                'src/injected/**/*',
                'src/issue-filing/**/*',
                'src/popup/**/*',
                'src/reports/**/*',
                'src/scanner/**/*',
                'src/tests/common/**/*',
                'src/tests/electron/**/*',
                'src/tests/end-to-end/**/*',
                'src/tests/miscellaneous/**/*',
                'src/tests/unit/common/**/*',
                'src/tests/unit/electron/**/*',
                'src/tests/unit/mock-helpers/**/*',
                'src/tests/unit/stubs/**/*',
                'src/types/**/*',
                'src/views/**/*',
            ],
            options: {
                printWidth: 100,
            },
        },
    ],
};
