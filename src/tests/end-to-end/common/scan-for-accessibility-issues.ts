// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults, ElementContext } from 'axe-core';

import * as path from 'path';
import { Page } from './page-controllers/page';

// we are using axe object in target page scope. so we shouldn't be importing axe object via axe-core
declare var axe;

export interface PrintableNode {
    selector: string[];
    failureSummary: string;
}

export interface PrintableResult {
    id: string;
    nodes: PrintableNode[];
}

export async function scanForAccessibilityIssues(page: Page, selector: string): Promise<PrintableResult[]> {
    await injectAxeIfUndefined(page);

    const axeResults = (await page.evaluate(selectorInEvaluate => {
        return axe.run(
            { include: [selectorInEvaluate] } as ElementContext,
            { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } } as ElementContext,
        );
    }, selector)) as AxeResults;

    const violations = axeResults.violations;
    const printableViolations: PrintableResult[] = violations.map(result => {
        const nodeResults: PrintableNode[] = result.nodes.map(node => {
            return {
                selector: node.target,
                failureSummary: node.failureSummary,
            } as PrintableNode;
        });
        return {
            id: result.id,
            nodes: nodeResults,
        };
    });
    return printableViolations;
}

async function injectAxeIfUndefined(page: Page): Promise<void> {
    const axeIsUndefined = await page.evaluate(() => {
        return (window as any).axe === undefined;
    });

    if (axeIsUndefined) {
        await page.injectScriptFile(path.join(__dirname, '../../../../node_modules/axe-core/axe.min.js'));
    }
}
