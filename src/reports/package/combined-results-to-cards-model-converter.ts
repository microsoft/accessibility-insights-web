// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { CardRuleResultsByStatus, CardsViewModel } from "common/types/store-data/card-view-model";
import { GroupedResults } from "reports/package/accessibilityInsightsReport";
import { GuidanceLink } from "scanner/rule-to-links-mappings";

export class CombinedResultsToCardsModelConverter {
    constructor(
        private readonly getGuidanceLinks: (ruleId: string) => GuidanceLink[],
        private readonly cardSelectionViewData: CardSelectionViewData
    ) {}

    public convertResults = (
        results: GroupedResults,
    ): CardsViewModel => {
        const statusResults: CardRuleResultsByStatus = {
            fail: [],
            pass: [],
            inapplicable: [],
            unknown: [],
        };
    
        return {
            cards: statusResults,
            visualHelperEnabled: this.cardSelectionViewData.visualHelperEnabled,
            allCardsCollapsed: this.cardSelectionViewData.expandedRuleIds.length === 0,
        };
    }
}
