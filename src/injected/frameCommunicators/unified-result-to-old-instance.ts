// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixWebPropertyData } from 'common/components/cards/how-to-fix-card-row';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { find, includes } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';

export interface CheckData {
    // tslint:disable-next-line: no-reserved-keywords
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
}

export function getElementBasedViewModel(
    rules: UnifiedRule[],
    results: UnifiedResult[],
    highlightedResultInstanceUids: string[],
): DictionaryStringTo<AssessmentVisualizationInstance> {
    const stringToResult: DictionaryStringTo<AssessmentVisualizationInstance> = {};
    results.forEach(unifiedResult => {
        if (unifiedResult.status !== 'fail' && !includes(highlightedResultInstanceUids, unifiedResult.uid)) {
            return;
        }

        const identifier = getIdentifier(unifiedResult);
        const rule = find(rules, unifiedRule => unifiedRule.id === unifiedResult.ruleId);
        const decoratedResult = getDecoratedResult(unifiedResult, rule);
        if (identifier in stringToResult === false) {
            stringToResult[identifier] = {
                isFailure: true,
                isVisualizationEnabled: true,
                target: getTarget(unifiedResult),
                ruleResults: {
                    [rule.id]: decoratedResult,
                },
            };
        } else {
            stringToResult[identifier].ruleResults[rule.id] = getDecoratedResult(unifiedResult, rule);
        }
    });
    return stringToResult;
}

function getIdentifier(unifiedResult: UnifiedResult): string {
    return unifiedResult.identifiers['css-selector'];
}

function getHTML(unifiedResult: UnifiedResult): string {
    return unifiedResult.descriptors['snippet'];
}

function getTarget(unifiedResult: UnifiedResult): string[] {
    return unifiedResult.identifiers['css-selector'].split(';');
}

function getDecoratedResult(unifiedResult: UnifiedResult, rule: UnifiedRule): DecoratedAxeNodeResult {
    return {
        status: getStatus(unifiedResult),
        ruleId: unifiedResult.ruleId,
        failureSummary: unifiedResult.resolution.howToFixSummary,
        selector: getIdentifier(unifiedResult),
        guidanceLinks: rule.guidance,
        help: rule.description,
        helpUrl: rule.url,
        html: getHTML(unifiedResult),
        id: unifiedResult.uid,
        ...getCheckData(unifiedResult),
    };
}

function getStatus(unifiedResult: UnifiedResult): boolean {
    return unifiedResult.status !== 'fail';
}

function getCheckData(unifiedResult: UnifiedResult): CheckData {
    return formatHowToFixData(unifiedResult.resolution['how-to-fix-web']);
}

function formatHowToFixData(howToFixData: HowToFixWebPropertyData): CheckData {
    const turnMessageToCheckResult = (s: string) => {
        return { message: s } as FormattedCheckResult;
    };

    return {
        any: howToFixData.any.map(turnMessageToCheckResult),
        all: howToFixData.all.map(turnMessageToCheckResult),
        none: howToFixData.none.map(turnMessageToCheckResult),
    };
}
