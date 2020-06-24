// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap } from 'lodash';

import {
    InstanceResultStatus,
    UnifiedResult,
} from '../../common/types/store-data/unified-data-interface';
import { UUIDGenerator } from '../../common/uid-generator';
import { AxeNodeResult, RuleResult, ScanResults } from '../../scanner/iruleresults';
import { IssueFilingUrlStringUtils } from './../../issue-filing/common/issue-filing-url-string-utils';

export type ConvertScanResultsToUnifiedResultsDelegate = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
) => UnifiedResult[];

interface RuleResultData {
    status: InstanceResultStatus;
    ruleID: string;
}

interface CreationData extends RuleResultData {
    cssSelector: string;
    failureSummary: string;
    snippet: string;
    howToFix: {
        oneOf: string[];
        none: string[];
        all: string[];
    };
}

export const convertScanResultsToUnifiedResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] => {
    if (!scanResults) {
        return [];
    }
    return createUnifiedResultsFromScanResults(scanResults, uuidGenerator);
};

const createUnifiedResultsFromNeedsReviewScanResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] => {
    return [
        ...createUnifiedResultsFromRuleResults(scanResults.violations, 'fail', uuidGenerator),
        ...createUnifiedResultsFromRuleResults(scanResults.passes, 'pass', uuidGenerator),
        ...createUnifiedResultsFromRuleResults(scanResults.incomplete, 'unknown', uuidGenerator),
    ];
};

export const convertScanResultsToNeedsReviewUnifiedResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] => {
    if (!scanResults) {
        return [];
    }
    return createUnifiedResultsFromNeedsReviewScanResults(scanResults, uuidGenerator);
};

const createUnifiedResultsFromScanResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] => {
    return [
        ...createUnifiedResultsFromRuleResults(scanResults.violations, 'fail', uuidGenerator),
        ...createUnifiedResultsFromRuleResults(scanResults.passes, 'pass', uuidGenerator),
    ];
};

const createUnifiedResultsFromRuleResults = (
    ruleResults: RuleResult[],
    status: InstanceResultStatus,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] => {
    const unifiedResultFromRuleResults = (ruleResults || []).map(result =>
        createUnifiedResultsFromRuleResult(result, status, uuidGenerator),
    );

    return flatMap(unifiedResultFromRuleResults);
};

const createUnifiedResultsFromRuleResult = (
    ruleResult: RuleResult,
    status: InstanceResultStatus,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] => {
    return ruleResult.nodes.map(node => {
        const data: RuleResultData = {
            status: status,
            ruleID: ruleResult.id,
        };

        return createUnifiedResultFromNode(node, data, uuidGenerator);
    });
};

const createUnifiedResultFromNode = (
    nodeResult: AxeNodeResult,
    ruleResultData: RuleResultData,
    uuidGenerator: UUIDGenerator,
): UnifiedResult => {
    return createUnifiedResult(
        {
            ...ruleResultData,
            cssSelector: nodeResult.target.join(';'),
            snippet: nodeResult.snippet || nodeResult.html,
            howToFix: {
                oneOf: nodeResult.any.map(checkResult => checkResult.message),
                none: nodeResult.none.map(checkResult => checkResult.message),
                all: nodeResult.all.map(checkResult => checkResult.message),
            },
            failureSummary: nodeResult.failureSummary,
        },
        uuidGenerator,
    );
};

const createUnifiedResult = (data: CreationData, uuidGenerator: UUIDGenerator): UnifiedResult => {
    return {
        uid: uuidGenerator(),
        status: data.status,
        ruleId: data.ruleID,
        identifiers: {
            identifier: data.cssSelector,
            conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(data.cssSelector),
            'css-selector': data.cssSelector,
        },
        descriptors: {
            snippet: data.snippet,
        },
        resolution: {
            howToFixSummary: data.failureSummary,
            'how-to-fix-web': {
                any: data.howToFix.oneOf,
                none: data.howToFix.none,
                all: data.howToFix.all,
            },
        },
    } as UnifiedResult;
};
