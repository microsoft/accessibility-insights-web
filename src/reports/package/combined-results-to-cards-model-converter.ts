// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { CardResult, CardRuleResult, CardRuleResultsByStatus, CardsViewModel } from "common/types/store-data/card-view-model";
import { isNil } from "lodash";
import { AxeRuleData, FailureData, FailuresGroup, GroupedResults } from "reports/package/accessibilityInsightsReport";
import { GuidanceLink } from "scanner/rule-to-links-mappings";

export class CombinedResultsToCardsModelConverter {
    constructor(
        private readonly getGuidanceLinks: (ruleId: string) => GuidanceLink[],
        private readonly cardSelectionViewData: CardSelectionViewData
    ) {}

    public convertResults = (
        results: GroupedResults,
    ): CardsViewModel => {
        
        const passedCards = this.getCardRuleResults(results.passed);
        const inapplicableCards = this.getCardRuleResults(results.notApplicable);
        const failedCards = results.failed.map(this.getFailuresGroupedByRule);
        
        const statusResults: CardRuleResultsByStatus = {
            fail: failedCards,
            pass: passedCards,
            inapplicable: inapplicableCards,
            unknown: [],
        };
    
        return {
            cards: statusResults,
            visualHelperEnabled: this.cardSelectionViewData.visualHelperEnabled,
            allCardsCollapsed: this.cardSelectionViewData.expandedRuleIds.length === 0,
        };
    }
    
    private getCardRuleResults = (rules?: AxeRuleData[]): CardRuleResult[] => {
        if(isNil(rules)) {
            return [];
        }
    
        return rules.map(rule => this.getCardRuleResult(rule));
    }
    
    private getCardRuleResult = (rule: AxeRuleData, nodes?: CardResult[]): CardRuleResult => {
        return {
            id: rule.ruleId,
            description: rule.description,
            url: rule.ruleUrl,
            isExpanded: false,
            guidance: this.getGuidanceLinks(rule.ruleId),
            nodes: isNil(nodes) ? [] : nodes,
        };
    }

    private getFailuresGroupedByRule = (groupedFailures: FailuresGroup): CardRuleResult => {
        if(groupedFailures.failed.length == 0) {
            return null;
        }
        const rule = groupedFailures.failed[0].rule;
        const failureNodes = groupedFailures.failed.map(this.getFailureCardResult);
        
        return this.getCardRuleResult(rule, failureNodes);
    }

    private getFailureCardResult = (failures: FailureData): CardResult => {
        return null;
    }
}
