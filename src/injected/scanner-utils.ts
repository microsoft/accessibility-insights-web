// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { ScanOptions, scan as scanRunner } from '../scanner/exposed-apis';
import { RuleDecorations, ScanResults, RuleResult } from '../scanner/iruleresults';
import { HyperlinkDefinition } from '../views/content/content-page';

declare var axe: any;

export interface DecoratedAxeNodeResult {
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
    status: boolean;
    ruleId: string;
    failureSummary: string;
    selector: string;
    html: string;
    help: string;
    id: string;
    guidanceLinks: HyperlinkDefinition[];
    helpUrl: string;
    fingerprint: string;
    snippet: string;
}

export interface IHtmlElementAxeResults extends IBaseHtmlElementResults {
    ruleResults: IDictionaryStringTo<DecoratedAxeNodeResult>;
    isVisible: boolean;
    propertyBag?: any;
}

export interface IBaseHtmlElementResults {
    target: string[];
}

export class ScannerUtils {
    private generateUID: () => string;
    private scanRunner: typeof scanRunner;

    public constructor(scanner: typeof scanRunner, generateUID?: () => string) {
        this.generateUID = generateUID;
        this.scanRunner = scanner;
    }

    public scan(options: ScanOptions, callback: (results: ScanResults) => void): void {
        this.scanRunner(
            options, axeResults => {
                callback(axeResults);
            }, err => {
                console.log(`failed to scan with error - ${err}`);
            });
    }

    public getUniqueSelector(element: HTMLElement): string {
        /* axe team's suggestion to how to use getSelector */
        axe._tree = axe.utils.getFlattenedTree(document.documentElement);
        axe._selectorData = axe.utils.getSelectorData(axe._tree);
        const selector = axe.utils.getSelector(element);
        axe._tree = undefined;
        axe._selectorData = undefined;
        return selector;
    }

    @autobind
    public getIncompleteInstances(results: ScanResults): IDictionaryStringTo<IHtmlElementAxeResults> {
        const resultsMap: IDictionaryStringTo<IHtmlElementAxeResults> = {};
        this.addIncompletesToDictionary(resultsMap, results.incomplete);
        return resultsMap;
    }

    @autobind
    public getFailingInstances(results: ScanResults): IDictionaryStringTo<IHtmlElementAxeResults> {
        const resultsMap: IDictionaryStringTo<IHtmlElementAxeResults> = {};
        this.addFailuresToDictionary(resultsMap, results.violations);
        return resultsMap;
    }

    @autobind
    public getPassingInstances(results: ScanResults): IDictionaryStringTo<IHtmlElementAxeResults> {
        const resultsMap: IDictionaryStringTo<IHtmlElementAxeResults> = {};
        this.addPassesToDictionary(resultsMap, results.passes);
        return resultsMap;
    }

    @autobind
    public getAllCompletedInstances(results: ScanResults): IDictionaryStringTo<IHtmlElementAxeResults> {
        const resultsMap: IDictionaryStringTo<IHtmlElementAxeResults> = {};
        this.addPassesToDictionary(resultsMap, results.passes);
        this.addFailuresToDictionary(resultsMap, results.violations);
        return resultsMap;
    }

    @autobind
    public getFailingOrPassingInstances(results: ScanResults): IDictionaryStringTo<IHtmlElementAxeResults> {
        const resultsMap: IDictionaryStringTo<IHtmlElementAxeResults> = {};
        this.addFailuresToDictionary(resultsMap, results.violations);
        if (Object.keys(resultsMap).length === 0) {
            this.addPassesToDictionary(resultsMap, results.passes);
        }
        return resultsMap;
    }

    private addPassesToDictionary(dictionary: IDictionaryStringTo<IHtmlElementAxeResults>,
        axeRules: RuleResult[]): void {
        this.addResultstoDictionary(dictionary, axeRules, true);
    }

    private addIncompletesToDictionary(dictionary: IDictionaryStringTo<IHtmlElementAxeResults>,
        axeRules: RuleResult[]): void {
        this.addResultstoDictionary(dictionary, axeRules, undefined);
    }

    private addFailuresToDictionary(dictionary: IDictionaryStringTo<IHtmlElementAxeResults>,
        axeRules: RuleResult[]): void {
        this.addResultstoDictionary(dictionary, axeRules, false);
    }

    private addResultstoDictionary(dictionary: IDictionaryStringTo<IHtmlElementAxeResults>,
        axeRules: RuleResult[], status: boolean): void {
        axeRules.forEach(ruleResult => {
            ruleResult.nodes.forEach(node => {
                const selectorKey = node.target.join(';');
                node.instanceId = this.generateUID ? this.generateUID() : null;

                const elementResult = dictionary[selectorKey] ||
                    {
                        target: node.target,
                        ruleResults: {},
                        isVisible: true,
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
                    guidanceLinks: ruleResult.guidanceLinks,
                    helpUrl: ruleResult.helpUrl,
                    fingerprint: ScannerUtils.getFingerprint(node, ruleResult),
                    snippet: node.snippet || node.html,
                };
            });
        });
    }

    public static getFingerprint(node: AxeNodeResult, rule: RuleResult): string {
        return 'fp--' + rule.id + '--' + node.target.join(';') + '--' + node.html;
    }
}
