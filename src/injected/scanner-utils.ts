// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from 'common/guidance-links';
import { Logger } from 'common/logging/logger';
import { CheckData } from 'injected/element-based-view-model-creator';
import { scan as scanRunner } from 'scanner/exposed-apis';
import { RuleResult, ScanResults } from 'scanner/iruleresults';
import { ScanOptions } from 'scanner/scan-options';
import { DictionaryStringTo } from 'types/common-types';

export type DecoratedAxeNodeResult = {
    status?: boolean;
    ruleId: string;
    failureSummary?: string;
    selector: string;
    html?: string;
    help?: string;
    id?: string;
    guidanceLinks: GuidanceLink[];
    helpUrl?: string;
} & CheckData;

export interface HtmlElementAxeResults {
    ruleResults: DictionaryStringTo<DecoratedAxeNodeResult>;
    propertyBag?: any;
    target: string[];
}

export class ScannerUtils {
    public constructor(
        private readonly scanner: typeof scanRunner,
        private readonly logger: Logger,
        private readonly generateUID?: () => string,
    ) {}

    public scan(options: ScanOptions, callback: (results: ScanResults) => void): void {
        this.scanner(
            options,
            axeResults => {
                callback(axeResults);
            },
            err => {
                this.logger.log(`failed to scan with error - ${err}`);
            },
        );
    }

    public getIncompleteInstances = (
        results: ScanResults,
    ): DictionaryStringTo<HtmlElementAxeResults> => {
        const resultsMap: DictionaryStringTo<HtmlElementAxeResults> = {};
        this.addIncompletesToDictionary(resultsMap, results.incomplete);
        return resultsMap;
    };

    public getFailingInstances = (
        results: ScanResults,
    ): DictionaryStringTo<HtmlElementAxeResults> => {
        const resultsMap: DictionaryStringTo<HtmlElementAxeResults> = {};
        this.addFailuresToDictionary(resultsMap, results.violations);
        return resultsMap;
    };

    public getPassingInstances = (
        results: ScanResults,
    ): DictionaryStringTo<HtmlElementAxeResults> => {
        const resultsMap: DictionaryStringTo<HtmlElementAxeResults> = {};
        this.addPassesToDictionary(resultsMap, results.passes);
        return resultsMap;
    };

    public getAllCompletedInstances = (
        results: ScanResults,
    ): DictionaryStringTo<HtmlElementAxeResults> => {
        const resultsMap: DictionaryStringTo<HtmlElementAxeResults> = {};
        this.addPassesToDictionary(resultsMap, results.passes);
        this.addFailuresToDictionary(resultsMap, results.violations);
        return resultsMap;
    };

    public getFailingOrPassingInstances = (
        results: ScanResults,
    ): DictionaryStringTo<HtmlElementAxeResults> => {
        const resultsMap: DictionaryStringTo<HtmlElementAxeResults> = {};
        this.addFailuresToDictionary(resultsMap, results.violations);
        if (Object.keys(resultsMap).length === 0) {
            this.addPassesToDictionary(resultsMap, results.passes);
        }
        return resultsMap;
    };

    private addPassesToDictionary(
        dictionary: DictionaryStringTo<HtmlElementAxeResults>,
        axeRules: RuleResult[],
    ): void {
        this.addResultstoDictionary(dictionary, axeRules, true);
    }

    private addIncompletesToDictionary(
        dictionary: DictionaryStringTo<HtmlElementAxeResults>,
        axeRules: RuleResult[],
    ): void {
        this.addResultstoDictionary(dictionary, axeRules, undefined);
    }

    private addFailuresToDictionary(
        dictionary: DictionaryStringTo<HtmlElementAxeResults>,
        axeRules: RuleResult[],
    ): void {
        this.addResultstoDictionary(dictionary, axeRules, false);
    }

    private addResultstoDictionary(
        dictionary: DictionaryStringTo<HtmlElementAxeResults>,
        axeRules: RuleResult[],
        status: boolean | undefined,
    ): void {
        axeRules.forEach(ruleResult => {
            ruleResult.nodes.forEach(node => {
                const selectorKey = node.target.join(';');
                node.instanceId = this.generateUID ? this.generateUID() : undefined;

                const elementResult = dictionary[selectorKey] || {
                    target: node.target,
                    ruleResults: {},
                };

                dictionary[selectorKey] = elementResult;
                elementResult.ruleResults[ruleResult.id] = {
                    any: node.any,
                    all: node.all,
                    none: node.none,
                    status: status,
                    ruleId: ruleResult.id,
                    help: ruleResult.help,
                    failureSummary: node.failureSummary,
                    html: node.html,
                    selector: selectorKey,
                    id: node.instanceId,
                    guidanceLinks: ruleResult.guidanceLinks ?? [],
                    helpUrl: ruleResult.helpUrl,
                };
            });
        });
    }

    public static getFingerprint(node: AxeNodeResult, rule: RuleResult): string {
        return 'fp--' + rule.id + '--' + node.target.join(';') + '--' + node.html;
    }
}
