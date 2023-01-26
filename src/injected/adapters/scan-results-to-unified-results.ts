// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResolutionCreator } from 'injected/adapters/resolution-creator';
import { flatMap } from 'lodash';

import {
    InstanceResultStatus,
    UnifiedResult,
} from '../../common/types/store-data/unified-data-interface';
import { UUIDGenerator } from '../../common/uid-generator';
import { AxeNodeResult, RuleResult, ScanResults, Target } from '../../scanner/iruleresults';
import { IssueFilingUrlStringUtils } from './../../issue-filing/common/issue-filing-url-string-utils';

export type ConvertScanResultsToUnifiedResultsDelegate = (
    scanResults: ScanResults,
) => UnifiedResult[];

interface RuleResultData {
    status: InstanceResultStatus;
    ruleID: string;
}

export class ConvertScanResultsToUnifiedResults {
    constructor(
        private uuidGenerator: UUIDGenerator,
        private getFixResolution: ResolutionCreator,
        private getCheckResolution: ResolutionCreator,
    ) {}

    public automatedChecksConversion: ConvertScanResultsToUnifiedResultsDelegate = (
        scanResults: ScanResults,
    ): UnifiedResult[] => {
        if (!scanResults) {
            return [];
        }
        return this.automatedChecksCreateUnifiedResultsFromScanResults(scanResults);
    };

    private automatedChecksCreateUnifiedResultsFromScanResults = (
        scanResults: ScanResults,
    ): UnifiedResult[] => {
        return [
            ...this.createUnifiedResultsFromRuleResults(
                scanResults.violations,
                'fail',
                this.getFixResolution,
            ),
            ...this.createUnifiedResultsFromRuleResults(
                scanResults.passes,
                'pass',
                this.getFixResolution,
            ),
        ];
    };

    public needsReviewConversion: ConvertScanResultsToUnifiedResultsDelegate = (
        scanResults: ScanResults,
    ): UnifiedResult[] => {
        if (!scanResults) {
            return [];
        }
        return this.needsReviewCreateUnifiedResultsFromScanResults(scanResults);
    };

    private needsReviewCreateUnifiedResultsFromScanResults = (
        scanResults: ScanResults,
    ): UnifiedResult[] => {
        return [
            ...this.createUnifiedResultsFromRuleResults(
                scanResults.incomplete,
                'unknown',
                this.getCheckResolution,
            ),
            ...this.createUnifiedResultsFromRuleResults(
                scanResults.violations,
                'unknown',
                this.getCheckResolution,
            ),
        ];
    };

    private createUnifiedResultsFromRuleResults = (
        ruleResults: RuleResult[],
        status: InstanceResultStatus,
        getResolution: ResolutionCreator,
    ): UnifiedResult[] => {
        const unifiedResultFromRuleResults = (ruleResults || []).map(result =>
            this.createUnifiedResultsFromRuleResult(result, status, getResolution),
        );

        return flatMap(unifiedResultFromRuleResults);
    };

    private createUnifiedResultsFromRuleResult = (
        ruleResult: RuleResult,
        status: InstanceResultStatus,
        getResolution: ResolutionCreator,
    ): UnifiedResult[] => {
        return ruleResult.nodes.map(node => {
            const data: RuleResultData = {
                status: status,
                ruleID: ruleResult.id,
            };

            return this.createUnifiedResultFromNode(node, data, getResolution);
        });
    };

    private createUnifiedResultFromNode = (
        nodeResult: AxeNodeResult,
        ruleResultData: RuleResultData,
        getResolution: ResolutionCreator,
    ): UnifiedResult => {
        const cssSelector = this.nodeToCssSelector(nodeResult);
        return {
            uid: this.uuidGenerator(),
            status: ruleResultData.status,
            ruleId: ruleResultData.ruleID,
            identifiers: {
                identifier: cssSelector,
                conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(cssSelector),
                'css-selector': cssSelector,
                target: nodeResult.target,
            },
            descriptors: {
                snippet: nodeResult.snippet || nodeResult.html,
                relatedCssSelectors: this.relatedCssSelectors(nodeResult),
            },
            resolution: {
                howToFixSummary: nodeResult.failureSummary!,
                ...getResolution({ ruleId: ruleResultData.ruleID, nodeResult: nodeResult }),
            },
        };
    };

    private relatedCssSelectors(nodeResult: AxeNodeResult): string[] | undefined {
        const output: string[] = [];
        for (const checkType of ['all', 'any', 'none'] as const) {
            const checks = nodeResult[checkType];
            for (const check of checks) {
                const relatedSelectors = check.relatedNodes?.map(this.nodeToCssSelector) ?? [];
                output.push(...relatedSelectors);
            }
        }
        return output.length === 0 ? undefined : output;
    }

    private nodeToCssSelector = (node: { target: Target }): string => {
        const { target } = node;
        if (typeof target === 'string') {
            return target;
        }
        return target.join(';');
    };
}
