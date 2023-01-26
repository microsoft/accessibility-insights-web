// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { AxeResults, Result, ElementContext } from 'axe-core';
import { getNeedsReviewRulesConfig } from 'scanner/get-rule-inclusions';
import { AxeInfo } from '../../../common/axe-info';

import { Page } from './page-controllers/page';
import { prettyPrintAxeViolations, PrintableAxeResult } from './pretty-print-axe-violations';

// we are using axe object in target page scope. so we shouldn't be importing axe object via axe-core
declare let axe;

const axeInfo = AxeInfo.Default;

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

// this is a method to remove violations tied to rules with known false-positives and was introduced
// Jan 25 2023 to remove aria-required-children failures introduced by axe-core 4.6.1
// we should keep this in until Deque introduces the fix for the issues tracked here
// https://github.com/dequelabs/axe-core/issues/3850
// the axe-core bug causes a failure for the FluentUI v8 DetailsList component
// The FluentUI tracking issue can be found here:
// https://github.com/microsoft/fluentui/issues/26330
function falsePositiveRemoval(violations: Result[]): Result[] {
    // Re-evaluate if the false positive is still present in future axe-core versions
    if (axeInfo.version !== '4.6.3') {
        console.log('Axe Core version has changed. Please check if this is still needed');
        return violations;
    }
    const newViolations = [] as Result[];
    //can be modified if other rules with false positives are identified
    const knownFalsePositives = ['aria-required-children'];
    violations.forEach(function (x) {
        if (!knownFalsePositives.includes(x.id)) {
            newViolations.push(x);
        }
    });
    return newViolations;
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
