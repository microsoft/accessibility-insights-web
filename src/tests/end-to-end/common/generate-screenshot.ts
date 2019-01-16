// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as Puppeteer from 'puppeteer';

import { generateUID } from '../../../common/uid-generator';

const screenshotsPath = path.resolve(__dirname, '../../../../test-results/e2e/failure-screenshots');

const toFilename = (s: string) => s.replace(/[^a-z0-9.-]+/gi, '_');

export async function takeScreenshot(pageInstance: Puppeteer.Page): Promise<Buffer> {
    mkdirp.sync(screenshotsPath);
    const screenshotName = generateUID();
    const filePath = path.join(screenshotsPath, toFilename(`${screenshotName}.png`));
    console.log(`Screenshot file is located at: ${filePath}`);
    return await pageInstance.screenshot({
        path: filePath,
        fullPage: true,
    });
}
