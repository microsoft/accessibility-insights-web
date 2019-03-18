// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { DictionaryStringTo } from '../types/common-types';
import { HyperlinkDefinition } from '../views/content/content-page';
import { DocumentUtils } from './document-utils';
import { AxeRule, RuleResult, ScanResults } from './iruleresults';
import { MessageDecorator } from './message-decorator';
import { Processor } from './processor';

export class ResultDecorator {
    private _ruleToLinkConfiguration: DictionaryStringTo<HyperlinkDefinition[]>;
    private _documentUtils: DocumentUtils;
    private _messageDecorator: MessageDecorator;

    constructor(
        documentUtils: DocumentUtils,
        messageDecorator: MessageDecorator,
        private getHelpUrl: (ruleId: string, axeHelpUrl: string) => string,
    ) {
        this._documentUtils = documentUtils;
        this._messageDecorator = messageDecorator;
    }

    public decorateResults(results: Axe.AxeResults): ScanResults {
        const scanResults: ScanResults = {
            passes: this.decorateAxeRuleResults(results.passes),
            violations: this.decorateAxeRuleResults(results.violations),
            inapplicable: this.decorateAxeRuleResults(results.inapplicable, true),
            incomplete: this.decorateAxeRuleResults(results.incomplete),
            timestamp: results.timestamp,
            targetPageUrl: results.url,
            targetPageTitle: this._documentUtils.title(),
        };

        return scanResults;
    }

    private decorateAxeRuleResults(ruleResults: AxeRule[], isInapplicable: boolean = false): RuleResult[] {
        return ruleResults.reduce((filteredArray: RuleResult[], result: AxeRule) => {
            this._messageDecorator.decorateResultWithMessages(result);
            const processedResult = Processor.suppressChecksByMessages(result, !isInapplicable);

            if (processedResult != null) {
                filteredArray.push({
                    ...processedResult,
                    guidanceLinks: this.getMapping(result.id),
                    helpUrl: this.getHelpUrl(result.id, result.helpUrl),
                });
            }

            return filteredArray;
        }, []);
    }

    private getMapping(ruleId: string): HyperlinkDefinition[] {
        if (this._ruleToLinkConfiguration == null) {
            return null;
        }

        return this._ruleToLinkConfiguration[ruleId];
    }

    public setRuleToLinksConfiguration(configuration: DictionaryStringTo<HyperlinkDefinition[]>): void {
        this._ruleToLinkConfiguration = configuration;
    }
}
