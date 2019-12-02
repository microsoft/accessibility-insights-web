// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as makeDir from 'make-dir';
import * as path from 'path';
import * as Puppeteer from 'puppeteer';

import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { generateUID } from 'common/uid-generator';
import { DEFAULT_SCREENSHOT_TIMEOUT_MS } from './timeouts';

const screenshotsPath = path.resolve(__dirname, '../../../../test-results/e2e/failure-screenshots');

const toFilename = (s: string) => s.replace(/[^a-z0-9.-]+/gi, '_');

const promiseFactory = createDefaultPromiseFactory();

export async function takeScreenshot(pageInstance: Puppeteer.Page): Promise<Buffer> {
    await makeDir(screenshotsPath);
    const screenshotName = generateUID();
    const filePath = path.join(screenshotsPath, toFilename(`${screenshotName}.png`));
    const screenshotBuffer = await promiseFactory.timeout(
        pageInstance.screenshot({
            path: filePath,
            fullPage: true,
            timeout: 2,
        }),
        DEFAULT_SCREENSHOT_TIMEOUT_MS,
    );

    // We don't log this until after screenshot() succeeds to avoid misleading logs if it throws
    console.log(`Screenshot file is located at: ${filePath}`);

    return screenshotBuffer;
}
