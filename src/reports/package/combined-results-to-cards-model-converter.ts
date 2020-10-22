// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { CardRuleResult, CardRuleResultsByStatus, CardsViewModel } from "common/types/store-data/card-view-model";
import { isNil } from "lodash";
import { AxeRuleData, GroupedResults } from "reports/package/accessibilityInsightsReport";
import { GuidanceLink, RuleToLinksMapping } from "scanner/rule-to-links-mappings";

export class CombinedResultsToCardsModelConverter {
    constructor(
        private readonly getGuidanceLinks: (ruleId: string) => GuidanceLink[],
        private readonly cardSelectionViewData: CardSelectionViewData
    ) {}

    public convertResults = (
        results: GroupedResults,
    ): CardsViewModel => {
        
        const passedCardRules = this.getCardRuleResults(results.passed);
        const inapplicableCardRules = this.getCardRuleResults(results.notApplicable)
        
        const statusResults: CardRuleResultsByStatus = {
            fail: [],
            pass: passedCardRules,
            inapplicable: inapplicableCardRules,
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
    
        return rules.map(this.getCardRuleResult);
    }
    
    private getCardRuleResult = (rule: AxeRuleData): CardRuleResult => {
        return {
            id: rule.ruleId,
            description: rule.description,
            url: rule.ruleUrl,
            isExpanded: false,
            guidance: this.getGuidanceLinks(rule.ruleId),
            nodes: [],
        };
    }
}
