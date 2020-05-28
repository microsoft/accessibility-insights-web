// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { DEFAULT_SCREENSHOT_TIMEOUT_MS } from 'tests/end-to-end/common/timeouts';
import { prepareTestResultFilePath } from './prepare-test-result-file-path';

const promiseFactory = createDefaultPromiseFactory();

async function takeScreenshot(saveScreenshot: (path) => Promise<void>): Promise<void> {
    const path = await prepareTestResultFilePath('failure-screenshots', 'png');
    await promiseFactory.timeout(saveScreenshot(path), DEFAULT_SCREENSHOT_TIMEOUT_MS);

    // We don't log this until after screenshot() succeeds to avoid misleading logs if it throws
    console.log(`Screenshot file is located at: ${path}`);
}

export async function screenshotOnError<T>(
    saveScreenshot: (path) => Promise<any>,
    wrappedFunction: () => Promise<T>,
): Promise<T> {
    try {
        return await wrappedFunction();
    } catch (originalError) {
        try {
            await takeScreenshot(saveScreenshot);
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
