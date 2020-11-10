// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { DictionaryStringTo } from 'types/common-types';
import { DocumentUtils } from './document-utils';
import { AxeRule, RuleResult, ScanResults } from './iruleresults';
import { MessageDecorator } from './message-decorator';
import { Processor } from './processor';

export class ResultDecorator {
    constructor(
        private readonly documentUtils: DocumentUtils,
        private readonly messageDecorator: MessageDecorator,
        private readonly getHelpUrl: (ruleId: string, axeHelpUrl?: string) => string | undefined,
        private readonly ruleToLinkConfiguration: DictionaryStringTo<HyperlinkDefinition[]>,
    ) {}

    public decorateResults(results: Axe.AxeResults): ScanResults {
        const scanResults: ScanResults = {
            passes: this.decorateAxeRuleResults(results.passes),
            violations: this.decorateAxeRuleResults(results.violations),
            inapplicable: this.decorateAxeRuleResults(results.inapplicable, true),
            incomplete: this.decorateAxeRuleResults(results.incomplete),
            timestamp: results.timestamp,
            targetPageUrl: results.url,
            targetPageTitle: this.documentUtils.title(),
        };

        return scanResults;
    }

    private decorateAxeRuleResults(
        ruleResults: AxeRule[],
        isInapplicable: boolean = false,
    ): RuleResult[] {
        return ruleResults.reduce((filteredArray: RuleResult[], result: AxeRule) => {
            this.messageDecorator.decorateResultWithMessages(result);
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

    private getMapping(ruleId: string): HyperlinkDefinition[] | undefined {
        if (this.ruleToLinkConfiguration == null) {
            return undefined;
        }

        return this.ruleToLinkConfiguration[ruleId];
    }
}
