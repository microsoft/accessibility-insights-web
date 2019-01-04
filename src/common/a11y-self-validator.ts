// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './html-element-utils';
import { ScannerUtils } from '../injected/scanner-utils';
import { autobind } from '@uifabric/utilities';
import { ScanResults } from '../scanner/iruleresults';

export interface LoggedRule {
    id: string;
    description: string;
    nodes: LoggedNode[];
}

export interface LoggedNode {
    target: string[];
    domElement: HTMLElement;
    all: FormattedCheckResult[];
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
}

export class A11YSelfValidator {
    private scannerUtils: ScannerUtils;
    private docUtils: HTMLElementUtils;

    constructor(scannerUtils: ScannerUtils, docUtils: HTMLElementUtils) {
        this.scannerUtils = scannerUtils;
        this.docUtils = docUtils;
    }

    public validate(): void {
        this.scannerUtils.scan(null, this.logAxeResults);
    }

    @autobind
    private logAxeResults(axeResults: ScanResults): void {
        const violations = axeResults.violations;
        const loggedViolations: LoggedRule[] = [];

        if (violations && violations.length > 0) {
            violations.forEach(violation => {
                loggedViolations.push({
                    id: violation.id,
                    description: violation.description,
                    nodes: violation.nodes.map(node => {
                        return {
                            domElement: this.docUtils.querySelector(node.target[0]) as HTMLElement,
                            all: node.all,
                            any: node.any,
                            none: node.none,
                            target: node.target,
                        } as LoggedNode;
                    }),
                });
            });
        }

        console.log(loggedViolations);
    }
}
