// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { AxeResults, ElementContext } from 'axe-core';
import { getNeedsReviewRulesConfig } from 'scanner/get-rule-inclusions';

import { falsePositiveRemoval } from '../../common/false-positive-violations';
import { Page } from './page-controllers/page';
import { prettyPrintAxeViolations, PrintableAxeResult } from './pretty-print-axe-violations';

// we are using axe object in target page scope. so we shouldn't be importing axe object via axe-core
declare let axe;

export async function scanForAccessibilityIssues(
    page: Page,
    selector: string,
): Promise<PrintableAxeResult[]> {
    await injectAxeIfUndefined(page);
    const axeResults = (await page.evaluate(
        options => {
            return axe.run({ include: [options.selector] } as ElementContext, {
                runOnly: { type: 'tag', values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa'] },
                rules: options.rules,
            });
        },
        { selector, rules: getNeedsReviewRulesConfig() },
    )) as AxeResults;
    axeResults.violations = falsePositiveRemoval(axeResults.violations);
    return prettyPrintAxeViolations(axeResults);
}

async function injectAxeIfUndefined(page: Page): Promise<void> {
    const axeIsUndefined = await page.evaluate(() => {
        return (window as any).axe === undefined;
    }, null);

    if (axeIsUndefined) {
        await page.injectScriptFile(
            path.join(__dirname, '../../../../node_modules/axe-core/axe.min.js'),
        );
    }
}
