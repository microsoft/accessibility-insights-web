// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';

const resultV1ExamplePath = path.join(
    __dirname,
    '../../../../../miscellaneous/mock-service-for-android/AccessibilityInsights/result.json',
);
const resultV2ExamplePath = path.join(
    __dirname,
    '../../../../../miscellaneous/mock-service-for-android/AccessibilityInsights/result_v2.json',
);
export const axeRuleResultExample = JSON.parse(
    fs.readFileSync(resultV1ExamplePath, { encoding: 'utf-8' }),
);
export const scanResultV2Example = JSON.parse(
    fs.readFileSync(resultV2ExamplePath, { encoding: 'utf-8' }),
);
