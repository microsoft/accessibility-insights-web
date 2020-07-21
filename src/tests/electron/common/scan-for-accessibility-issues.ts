// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { source as axeCoreSource } from 'axe-core';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import {
    prettyPrintAxeViolations,
    PrintableAxeResult,
} from 'tests/end-to-end/common/pretty-print-axe-violations';

declare var axe;

export async function scanForAccessibilityIssuesInAllModes(app: AppController): Promise<void> {
    await scanForAccessibilityIssues(app, true);
    await scanForAccessibilityIssues(app, false);
}

async function scanForAccessibilityIssues(
    app: AppController,
    enableHighContrast: boolean,
): Promise<void> {
    await app.setHighContrastMode(enableHighContrast);
    await app.waitForHighContrastMode(enableHighContrast);

    const violations = await runAxeScan(app.client);
    expect(violations).toStrictEqual([]);
}

async function runAxeScan(
    spectronClient: SpectronAsyncClient,
    selector?: string,
): Promise<PrintableAxeResult[]> {
    await injectAxeIfUndefined(spectronClient);

    const axeRunOptions = {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa'],
        },
    };

    const executeOutput = await spectronClient.executeAsync(
        (options, selectorInEvaluate, done) => {
            const elementContext =
                selectorInEvaluate === null ? document : { include: [selectorInEvaluate] };

            axe.run(elementContext, options, function (err: Error, results: any): void {
                if (err) {
                    throw err;
                }
                done(results);
            });
        },
        axeRunOptions,
        selector,
    );

    // This is how webdriverio indicates success
    expect(executeOutput).toHaveProperty('status', 0);

    const axeResults = executeOutput.value;

    return prettyPrintAxeViolations(axeResults);
}

async function injectAxeIfUndefined(spectronClient: SpectronAsyncClient): Promise<void> {
    const axeIsUndefined = await spectronClient.execute(() => {
        return (window as any).axe === undefined;
    });

    if (axeIsUndefined) {
        await spectronClient.execute(axeCoreSource);
    }
}
