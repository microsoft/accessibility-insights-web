// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScannerUtils } from '../injected/scanner-utils';
import { ScanResults } from '../scanner/iruleresults';
import { HTMLElementUtils } from './html-element-utils';
import { Logger } from './logging/logger';

export interface LoggedRule {
    id: string;
    description: string;
    nodes: LoggedNode[];
}

export interface LoggedNode {
    target: string[];
    domElement: HTMLElement;
    all: FormattedCheckResult[];
    // tslint:disable-next-line: no-reserved-keywords
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
}

export class A11YSelfValidator {
    constructor(private scannerUtils: ScannerUtils, private docUtils: HTMLElementUtils, private logger: Logger) {}

    public validate(): void {
        this.scannerUtils.scan(null, this.logAxeResults);
    }

    private logAxeResults = (axeResults: ScanResults): void => {
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

        this.logger.log(loggedViolations);
    };
}
