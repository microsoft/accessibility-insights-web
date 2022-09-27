// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { CardResult, CardRuleResult, CardRuleResultsByStatus, CardsViewModel } from "common/types/store-data/card-view-model";
import { GuidanceLink } from "common/types/store-data/guidance-links";
import { UUIDGenerator } from "common/uid-generator";
import { ResolutionCreator } from "injected/adapters/resolution-creator";
import { IssueFilingUrlStringUtils } from "issue-filing/common/issue-filing-url-string-utils";
import { isNil } from "lodash";
import { AxeRuleData, FailureData, FailuresGroup, GroupedResults, UrlInfo } from "reports/package/accessibilityInsightsReport";
import { HelpUrlGetter } from "scanner/help-url-getter";

export class CombinedResultsToCardsModelConverter {
    constructor(
        private readonly mapAxeTagsToGuidanceLinks: (ruleId: string, axeTags?: string[]) => GuidanceLink[],
        private readonly cardSelectionViewData: CardSelectionViewData,
        private readonly uuidGenerator: UUIDGenerator,
        private readonly helpUrlGetter: HelpUrlGetter,
        private readonly getFixResolution: ResolutionCreator,
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
            url: this.helpUrlGetter.getHelpUrl(rule.ruleId, rule.ruleUrl),
            isExpanded: false,
            guidance: this.mapAxeTagsToGuidanceLinks(rule.ruleId, rule.tags),
            nodes: isNil(nodes) ? [] : nodes,
        };
    }

    private getFailuresGroupedByRule = (groupedFailures: FailuresGroup): CardRuleResult => {
        if(groupedFailures.failed.length === 0) {
            return null;
        }
        const rule = groupedFailures.failed[0].rule;
        const failureNodes = groupedFailures.failed.map(this.getFailureCardResult);
        
        return this.getCardRuleResult(rule, failureNodes);
    }

    private getFailureCardResult = (failureData: FailureData): CardResult => {
        const rule = failureData.rule;
        const cssSelector = failureData.elementSelector;

        const urls: any = {};
        if (failureData.urls) {
            const urlInfos: UrlInfo[] = []
            failureData.urls.map(url => {
                if (url.url) {
                    urlInfos.push({url: url.url, baselineStatus: url.baselineStatus || 'unknown'});
                } else {
                    urlInfos.push({url, baselineStatus: 'unknown'});
                }
            })
            urls.urlInfos = urlInfos;
        }

        return {
            uid: this.uuidGenerator(),
            status: 'fail',
            ruleId: rule.ruleId,
            identifiers: {
                urls,
                identifier: cssSelector,
                conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(cssSelector),
                'css-selector': cssSelector,
            },
            descriptors: {
                snippet: failureData.snippet,
            },
            resolution: {
                howToFixSummary: failureData.fix.failureSummary,
                ...this.getFixResolution({ ruleId: rule.ruleId, nodeResult: failureData.fix}),
            },
            isSelected: false,
            highlightStatus: 'unavailable',
        }
    }
}
