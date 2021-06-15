// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssuesAdHocVisualization } from 'ad-hoc-visualizations/issues/visualization';
import { NeedsReviewAdHocVisualization } from 'ad-hoc-visualizations/needs-review/visualization';
import { Analyzer, RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
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
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
}

export type SelfValidatorAnalyzerDeps = {
    scannerUtils: ScannerUtils;
    htmlUtils: HTMLElementUtils;
    logger: Logger;
};

type ResultType = 'incomplete' | 'violations';

class SelfValidatorAnalyzer implements Analyzer {
    constructor(
        private readonly deps: SelfValidatorAnalyzerDeps,
        private readonly config: RuleAnalyzerConfiguration,
        private readonly relevantResultTypes: ResultType[],
    ) {}

    analyze(): void {
        const scanOptions = { testsToRun: this.config.rules };
        this.deps.scannerUtils.scan(scanOptions, this.onScanComplete);
    }

    teardown(): void {}

    onScanComplete = (axeResults: ScanResults): void => {
        for (const resultType of this.relevantResultTypes) {
            const results = axeResults[resultType] ?? [];
            const loggedViolations: LoggedRule[] = [];

            for (const result of results) {
                loggedViolations.push({
                    id: result.id,
                    description: result.description,
                    nodes: result.nodes.map(node => {
                        return {
                            domElement: this.deps.htmlUtils.querySelector(
                                node.target[0],
                            ) as HTMLElement,
                            all: node.all,
                            any: node.any,
                            none: node.none,
                            target: node.target,
                        } as LoggedNode;
                    }),
                });
            }

            this.deps.logger.log(resultType);
            this.deps.logger.log(loggedViolations);
        }
    };
}

class SelfValidatorAnalyzerProvider extends AnalyzerProvider {
    constructor(private readonly deps: SelfValidatorAnalyzerDeps) {
        super(null, null, null, null, null, null, null, null, null, null, null);
    }

    public override createRuleAnalyzerUnifiedScanForNeedsReview(
        config: RuleAnalyzerConfiguration,
    ): Analyzer {
        return new SelfValidatorAnalyzer(this.deps, config, ['violations', 'incomplete']);
    }

    public override createRuleAnalyzerUnifiedScan(config: RuleAnalyzerConfiguration): Analyzer {
        return new SelfValidatorAnalyzer(this.deps, config, ['violations']);
    }
}

export class A11YSelfValidator {
    private readonly analyzerProvider: AnalyzerProvider;

    constructor(scannerUtils: ScannerUtils, htmlUtils: HTMLElementUtils, logger: Logger) {
        this.analyzerProvider = new SelfValidatorAnalyzerProvider({
            scannerUtils,
            htmlUtils,
            logger,
        });
    }

    public automatedChecks(): void {
        IssuesAdHocVisualization.getAnalyzer(this.analyzerProvider).analyze();
    }

    public needsReview(): void {
        NeedsReviewAdHocVisualization.getAnalyzer(this.analyzerProvider).analyze();
    }
}
