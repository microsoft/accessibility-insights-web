// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixWebPropertyData } from 'common/components/cards/how-to-fix-card-row';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { GetDecoratedAxeNodeCallback } from 'injected/frameCommunicators/get-decorated-axe-node-from-unified-instance-data';
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

export type GetElementBasedViewModelCallback = (
    rules: UnifiedRule[],
    results: UnifiedResult[],
    highlightedResultInstanceUids: string[],
) => DictionaryStringTo<AssessmentVisualizationInstance>;

export class ElementBaseViewModelCreator {
    constructor(private getDecoratedAxeNode: GetDecoratedAxeNodeCallback) {}

    public getElementBasedViewModel: GetElementBasedViewModelCallback = (
        rules: UnifiedRule[],
        results: UnifiedResult[],
        highlightedResultInstanceUids: string[],
    ) => {
        const stringToResult: DictionaryStringTo<AssessmentVisualizationInstance> = {};

        results.forEach(unifiedResult => {
            if (unifiedResult.status !== 'fail' && !includes(highlightedResultInstanceUids, unifiedResult.uid)) {
                return;
            }

            const rule = find(rules, unifiedRule => unifiedRule.id === unifiedResult.ruleId);

            const identifier = this.getIdentifier(unifiedResult);
            const decoratedResult = this.getDecoratedAxeNode(unifiedResult, rule, identifier);
            const ruleResults = stringToResult[identifier] ? stringToResult[identifier].ruleResults : {};

            stringToResult[identifier] = {
                isFailure: true,
                isVisualizationEnabled: true,
                target: this.getTarget(unifiedResult),
                ruleResults: {
                    ...ruleResults,
                    [rule.id]: decoratedResult,
                },
            };
        });

        return stringToResult;
    };

    private getTarget(unifiedResult: UnifiedResult): string[] {
        return unifiedResult.identifiers['css-selector'].split(';');
    }

    private getIdentifier(unifiedResult: UnifiedResult): string {
        return unifiedResult.identifiers['css-selector'];
    }
}
