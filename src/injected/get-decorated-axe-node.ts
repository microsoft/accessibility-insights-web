// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixWebPropertyData } from 'common/components/cards/how-to-fix-card-row';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { CheckData } from 'injected/element-based-view-model-creator';
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';

export type GetDecoratedAxeNodeCallback = (
    unifiedResult: UnifiedResult,
    rule: UnifiedRule,
    selector: string,
) => DecoratedAxeNodeResult;

export const getDecoratedAxeNode: GetDecoratedAxeNodeCallback = (unifiedResult, rule, selector) => {
    return {
        status: false,
        ruleId: unifiedResult.ruleId,
        failureSummary: unifiedResult.resolution.howToFixSummary,
        selector: selector,
        guidanceLinks: rule.guidance,
        help: rule.description,
        helpUrl: rule.url,
        html: getHTML(unifiedResult),
        id: unifiedResult.uid,
        ...getCheckData(unifiedResult),
    };
};

function getCheckData(unifiedResult: UnifiedResult): CheckData | undefined {
    if (!unifiedResult.resolution['how-to-fix-web']) {
        return;
    }
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

function getHTML(unifiedResult: UnifiedResult): string | undefined {
    return unifiedResult.descriptors.snippet;
}
