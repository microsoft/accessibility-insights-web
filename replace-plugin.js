// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs');

const CreateReplaceJsonValidatorPlugin = () => {
    return {
        name: 'replace-json-validator-plugin',

        setup(build) {
            build.onLoad(
                {
                    filter: /.*load-assessment-data-validator.ts/,
                },
                async args => {
                    const origContent = fs.readFileSync(args.path, 'utf-8');
                    const newContent = origContent.replace(
                        'empty-validate-assessment-json',
                        'generated-validate-assessment-json',
                    );
                    return {
                        contents: newContent,
                        loader: 'ts',
                    };
                },
            );
        },
    };
};

module.exports = { CreateReplaceJsonValidatorPlugin };
