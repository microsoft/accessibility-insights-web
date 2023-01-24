// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { normalizeOfficeFabricClassName } from 'tests/common/element-snapshot-formatter';

export interface PrintableAxeResultNode {
    selector: string[];
    failureSummary: string;
}

export interface PrintableAxeResult {
    id: string;
    nodes: PrintableAxeResultNode[];
}

// This normalizes any selectors that are based on dynamically-generated FluentUI IDs
// to ensure that snapshots are derived consistently between test runs/test machines
export function normalizeSelector(selector: string): string {
    let output = selector;
    if (/^[#.][a-zA-Z0-9-]+$/.test(output)) {
        const identifier = output.slice(1);
        output = `${output[0]}${normalizeOfficeFabricClassName(identifier)}`;
    }
    return output;
}

export function prettyPrintAxeViolations(axeResults: AxeResults): PrintableAxeResult[] {
    const violations = axeResults.violations;
    const printableViolations: PrintableAxeResult[] = violations.map(result => {
        const nodeResults: PrintableAxeResultNode[] = result.nodes.map(node => {
            return {
                selector: node.target.map(normalizeSelector),
                failureSummary: node.failureSummary,
            } as PrintableAxeResultNode;
        });
        return {
            id: result.id,
            nodes: nodeResults,
        };
    });
    return printableViolations;
}
