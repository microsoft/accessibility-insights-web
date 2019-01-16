// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as mkdirp from 'mkdirp';
import * as path from 'path';

import { generateUID } from '../../../common/uid-generator';


const screenshotsPath = path.resolve(__dirname, '../failure-screenshots');

const toFilename = (s: string) => s.replace(/[^a-z0-9.-]+/gi, '_');

export async function takeScreenshot(pageInstance) {
    mkdirp.sync(screenshotsPath);
    const screenshotName = generateUID();
    const filePath = path.join(screenshotsPath, toFilename(`${screenshotName}.png`));
    console.log(`Screenshot file is located at: ${filePath}`);
    return await pageInstance.screenshot({
        path: filePath,
        fullPage: true,
    });
}
