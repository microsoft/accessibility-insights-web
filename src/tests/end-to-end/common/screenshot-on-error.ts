// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Puppeteer from 'puppeteer';
import { prepareTestResultFilePath } from './prepare-test-result-file-path';

async function takeScreenshot(pageInstance: Puppeteer.Page): Promise<void> {
    const path = await prepareTestResultFilePath('failure-screenshots', 'png');
    await pageInstance.screenshot({ path, fullPage: true });

    // We don't log this until after screenshot() succeeds to avoid misleading logs if it throws
    console.log(`Screenshot file is located at: ${path}`);
}

export async function screenshotOnError<T>(pageInstance: Puppeteer.Page, wrappedFunction: () => Promise<T>): Promise<T> {
    try {
        return await wrappedFunction();
    } catch (originalError) {
        try {
            await takeScreenshot(pageInstance);
        } catch (secondaryTakeScreenshotError) {
            console.error(
                `screenshotOnError: Detected an error, and then *additionally* hit a second error while trying to take a screenshot of the page state after the first error.\n` +
                    `screenshotOnError: The secondary error from taking the screenshot is: ${secondaryTakeScreenshotError.stack}\n` +
                    `screenshotOnError: rethrowing the original error...`,
            );
        }
        throw originalError;
    }
}
