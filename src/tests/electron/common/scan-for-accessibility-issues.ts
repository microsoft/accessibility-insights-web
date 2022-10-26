// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { Result } from 'axe-core';
import { Page } from 'playwright';
import { getNeedsReviewRulesConfig } from 'scanner/get-rule-inclusions';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';

import { screenshotOnError as screenshot } from '../../end-to-end/common/screenshot-on-error';

declare let window: Window & { axe };

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

async function runAxeScan(client: Page, selector?: string): Promise<Result[]> {
    await injectAxeIfUndefined(client);
    const needsReviewRulesConfig = getNeedsReviewRulesConfig();

    const axeRunOptions = {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa'],
        },
        rules: needsReviewRulesConfig,
    };
    const axeResults = await client.evaluate(
        ({ selector, axeRunOptions }) => {
            const elementContext = selector === undefined ? document : { include: [selector] };
            return window.axe.run(elementContext, axeRunOptions);
        },
        { selector, axeRunOptions },
    );
    return axeResults.violations;
}

async function injectAxeIfUndefined(client: Page): Promise<void> {
    const axeIsUndefined = await client.evaluate(() => {
        return (window as any).axe === undefined;
    }, null);

    if (axeIsUndefined) {
        await injectScriptFile(
            client,
            path.join(__dirname, '../../../../node_modules/axe-core/axe.min.js'),
        );

        await client.waitForFunction(() => {
            return (window as any).axe !== undefined;
        });
    }
}

async function screenshotOnError<T>(client: Page, wrappedFunction: () => Promise<T>): Promise<T> {
    return await screenshot(path => client.screenshot({ path, fullPage: true }), wrappedFunction);
}

async function injectScriptFile(client: Page, filePath: string): Promise<void> {
    await screenshotOnError(client, async () => {
        await client.addScriptTag({ path: filePath, type: 'module' });
        await client.waitForLoadState(); //wait for the script to be available
    });
}
