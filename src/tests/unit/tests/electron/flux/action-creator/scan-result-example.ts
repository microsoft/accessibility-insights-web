// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';

const resultExamplePath = path.join(
    __dirname,
    '../../../../../miscellaneous/mock-service-for-android/AccessibilityInsights/result.json',
);
export const axeRuleResultExample = JSON.parse(
    fs.readFileSync(resultExamplePath, { encoding: 'utf-8' }),
);
