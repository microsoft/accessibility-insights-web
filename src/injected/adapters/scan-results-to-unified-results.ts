// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap } from 'lodash';

import { ResolutionCreator } from 'injected/adapters/resolution-creator';
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
    getResolution: ResolutionCreator,
) => UnifiedResult[];

interface RuleResultData {
    status: InstanceResultStatus;
    ruleID: string;
}

export interface CreationData extends RuleResultData {
    cssSelector: string;
    failureSummary: string;
    snippet: string;
    howToFix: {
        oneOf: string[];
        none: string[];
        all: string[];
    };
}

export type ResolutionType = 'how-to-fix' | 'how-to-check';

export const convertScanResultsToUnifiedResults = (
    // AC
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
): UnifiedResult[] => {
    if (!scanResults) {
        return [];
    }
    return createUnifiedResultsFromScanResults(scanResults, uuidGenerator, getResolution);
};

const createUnifiedResultsFromScanResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
): UnifiedResult[] => {
    return [
        ...createUnifiedResultsFromRuleResults(
            scanResults.violations,
            'fail',
            uuidGenerator,
            getResolution,
            'how-to-fix',
        ),
        ...createUnifiedResultsFromRuleResults(
            scanResults.passes,
            'pass',
            uuidGenerator,
            getResolution,
            'how-to-fix',
        ),
    ];
};

export const convertScanResultsToNeedsReviewUnifiedResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
    getCheckResolution: ResolutionCreator,
): UnifiedResult[] => {
    if (!scanResults) {
        return [];
    }
    return createUnifiedResultsFromNeedsReviewScanResults(
        scanResults,
        uuidGenerator,
        getResolution,
    );
};

const createUnifiedResultsFromNeedsReviewScanResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
): UnifiedResult[] => {
    return [
        ...createUnifiedResultsFromRuleResults(
            scanResults.incomplete,
            'unknown',
            uuidGenerator,
            getResolution,
            'how-to-check',
        ),
        ...createUnifiedResultsFromRuleResults(
            scanResults.violations,
            'fail',
            uuidGenerator,
            getResolution,
            'how-to-check',
        ),
    ];
};

const createUnifiedResultsFromRuleResults = (
    ruleResults: RuleResult[],
    status: InstanceResultStatus,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
    resolutionType: ResolutionType,
): UnifiedResult[] => {
    const unifiedResultFromRuleResults = (ruleResults || []).map(result =>
        createUnifiedResultsFromRuleResult(
            result,
            status,
            uuidGenerator,
            getResolution,
            resolutionType,
        ),
    );

    return flatMap(unifiedResultFromRuleResults);
};

const createUnifiedResultsFromRuleResult = (
    ruleResult: RuleResult,
    status: InstanceResultStatus,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
    resolutionType: ResolutionType,
): UnifiedResult[] => {
    return ruleResult.nodes.map(node => {
        const data: RuleResultData = {
            status: status,
            ruleID: ruleResult.id,
        };

        return createUnifiedResultFromNode(
            node,
            data,
            uuidGenerator,
            getResolution,
            resolutionType,
        );
    });
};

const createUnifiedResultFromNode = (
    nodeResult: AxeNodeResult,
    ruleResultData: RuleResultData,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
    resolutionType: ResolutionType,
): UnifiedResult => {
    const cssSelector = nodeResult.target.join(';');
    return {
        uid: uuidGenerator(),
        status: ruleResultData.status,
        ruleId: ruleResultData.ruleID,
        identifiers: {
            identifier: cssSelector,
            conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(cssSelector),
            'css-selector': cssSelector,
        },
        descriptors: {
            snippet: nodeResult.snippet || nodeResult.html,
        },
        resolution: {
            howToFixSummary: nodeResult.failureSummary,
            ...getResolution(resolutionType, { ruleResultData.ruleID, nodeResult }),
        },
    };

    // return createUnifiedResult(
    //     {
    //         ...ruleResultData,
    //         cssSelector: nodeResult.target.join(';'),
    //         snippet: nodeResult.snippet || nodeResult.html,
    //         howToFix: {
    //             oneOf: nodeResult.any.map(checkResult => checkResult.message),
    //             none: nodeResult.none.map(checkResult => checkResult.message),
    //             all: nodeResult.all.map(checkResult => checkResult.message),
    //         },
    //         failureSummary: nodeResult.failureSummary,
    //     },
    //     uuidGenerator,
    //     getResolution,
    //     resolutionType,
    // );
};

// const createUnifiedResult = (
//     data: CreationData,
//     uuidGenerator: UUIDGenerator,
//     getResolution: ResolutionCreator,
//     resolutionType: ResolutionType,
// ): UnifiedResult => {
//     return {
//         uid: uuidGenerator(),
//         status: data.status,
//         ruleId: data.ruleID,
//         identifiers: {
//             identifier: data.cssSelector,
//             conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(data.cssSelector),
//             'css-selector': data.cssSelector,
//         },
//         descriptors: {
//             snippet: data.snippet,
//         },
//         resolution: {
//             howToFixSummary: data.failureSummary,
//             ...getResolution(resolutionType, { data.ruleID, data.howToFix }),
//         },
//     } as UnifiedResult;
// };
