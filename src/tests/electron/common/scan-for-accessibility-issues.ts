// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { source as axeCoreSource } from 'axe-core';
import {
    prettyPrintAxeViolations,
    PrintableAxeResult,
} from 'tests/end-to-end/common/pretty-print-axe-violations';
import { ViewController } from './view-controllers/view-controller';

declare var axe;

export async function scanForAccessibilityIssues(
    view: ViewController,
    selector?: string,
): Promise<PrintableAxeResult[]> {
    await injectAxeIfUndefined(view);

    const axeRunOptions = {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa'],
        },
    };

    const executeOutput = await view.client.executeAsync(
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

async function injectAxeIfUndefined(view: ViewController): Promise<void> {
    const axeIsUndefined = await view.client.execute(() => {
        return (window as any).axe === undefined;
    });

    if (axeIsUndefined) {
        await view.client.execute(axeCoreSource);
    }
}
