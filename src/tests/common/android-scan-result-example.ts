// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';

const mockAdbStandardResultPath = path.join(
    __dirname,
    '../miscellaneous/setup-mock-adb/assets/result.json',
);
export const androidScanResultExample = JSON.parse(
    fs.readFileSync(mockAdbStandardResultPath, { encoding: 'utf-8' }),
);
