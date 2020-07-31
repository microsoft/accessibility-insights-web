// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Playwright from 'playwright';
import { prepareTestResultFilePath } from 'tests/end-to-end/common/prepare-test-result-file-path';

async function startTracing(tracing: Playwright.Tracing): Promise<string> {
    const traceFilePath = await prepareTestResultFilePath('tracing', 'json');
    await tracing.start({ path: traceFilePath, screenshots: true });
    return traceFilePath;
}

async function stopTracing(
    tracing: Playwright.Tracing,
    traceFilePath: string,
    logLabel: string,
): Promise<void> {
    await tracing.stop();

    // Only log this after tracing.stop succeeds!
    console.log(`Trace file (${logLabel}) is located at: ${traceFilePath}`);
}

export async function withTracing<T>(
    tracing: Playwright.Tracing,
    wrappedFunction: () => Promise<T>,
): Promise<T> {
    const traceFilePath = await startTracing(tracing);

    let retVal: T;
    try {
        retVal = await wrappedFunction();
    } catch (originalError) {
        try {
            await stopTracing(tracing, traceFilePath, 'from error path');
        } catch (secondaryTracingStopError) {
            console.error(
                `withTracing: Detected an error, and then *additionally* hit a second error while trying to call tracing.stop() after the first error.\n` +
                    `withTracing: The secondary error from tracing.stop() is: ${secondaryTracingStopError.stack}\n` +
                    `withTracing: rethrowing the original error...`,
            );
        }
        throw originalError;
    }

    // We rethrow originalError in the catch path, so we only get here in the success path
    await stopTracing(tracing, traceFilePath, 'from success path');
    return retVal;
}
