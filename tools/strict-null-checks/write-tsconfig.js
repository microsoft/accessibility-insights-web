// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');

module.exports = {
    writeTsconfigSync: (tsconfigPath, content) => {
        let serializedContent = JSON.stringify(content, null, '    ');
        serializedContent += '\n';

        fs.writeFileSync(tsconfigPath, serializedContent);
    },
};
