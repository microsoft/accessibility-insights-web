// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

module.exports = {
    writeTsConfig: async (tsconfigPath, content) => {
        let serializedContent = JSON.stringify(content, null, '    ');

        let prettierConfigPath = path.join(__dirname, '..', '..', 'prettier.config.js');
        let prettierConfig = await prettier.resolveConfig(prettierConfigPath);
        let formattedContent = await prettier.format(serializedContent, {
            ...prettierConfig,
            filepath: tsconfigPath,
        });

        fs.writeFileSync(tsconfigPath, formattedContent);
    },
};
