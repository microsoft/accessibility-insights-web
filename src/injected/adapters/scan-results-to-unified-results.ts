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
) => UnifiedResult[];

interface RuleResultData {
    status: InstanceResultStatus;
    ruleID: string;
}

// export interface CreationData extends RuleResultData {
//     cssSelector: string;
//     failureSummary: string;
//     snippet: string;
//     howToFix: {
//         oneOf: string[];
//         none: string[];
//         all: string[];
//     };
// }

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
                'fail',
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
        const cssSelector = nodeResult.target.join(';');
        return {
            uid: this.uuidGenerator(),
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
                ...getResolution({ id: ruleResultData.ruleID, nodeResult: nodeResult }),
            },
        };
    };
}
/*
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
        ),
        ...createUnifiedResultsFromRuleResults(
            scanResults.passes,
            'pass',
            uuidGenerator,
            getResolution,
        ),
    ];
};

export const convertScanResultsToNeedsReviewUnifiedResults = (
    scanResults: ScanResults,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
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
        ),
        ...createUnifiedResultsFromRuleResults(
            scanResults.violations,
            'fail',
            uuidGenerator,
            getResolution,
        ),
    ];
};

const createUnifiedResultsFromRuleResults = (
    ruleResults: RuleResult[],
    status: InstanceResultStatus,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
): UnifiedResult[] => {
    const unifiedResultFromRuleResults = (ruleResults || []).map(result =>
        createUnifiedResultsFromRuleResult(result, status, uuidGenerator, getResolution),
    );

    return flatMap(unifiedResultFromRuleResults);
};

const createUnifiedResultsFromRuleResult = (
    ruleResult: RuleResult,
    status: InstanceResultStatus,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
): UnifiedResult[] => {
    return ruleResult.nodes.map(node => {
        const data: RuleResultData = {
            status: status,
            ruleID: ruleResult.id,
        };

        return createUnifiedResultFromNode(node, data, uuidGenerator, getResolution);
    });
};

const createUnifiedResultFromNode = (
    nodeResult: AxeNodeResult,
    ruleResultData: RuleResultData,
    uuidGenerator: UUIDGenerator,
    getResolution: ResolutionCreator,
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
            ...getResolution({ id: ruleResultData.ruleID, nodeResult: nodeResult }),
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
*/
