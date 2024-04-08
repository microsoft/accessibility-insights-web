// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';

import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import {
    InstanceResultStatus,
    UnifiedResult,
    UnifiedRule,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { IssueFilingUrlStringUtils } from 'issue-filing/common/issue-filing-url-string-utils';
import { find, forOwn } from 'lodash';
import { ScannerRuleInfo, ScannerRuleInfoMap } from 'scanner/scanner-rule-info';

export type ScanNodeResult = UnifiedResult & {
    rule: UnifiedRule;
};

export type ConvertResultsToCardSelectionStoreDataCallback = (
    state: CardSelectionStoreData,
    results: ScanNodeResult[] | null,
) => CardSelectionStoreData;

export const convertResultsToCardSelectionStoreData: ConvertResultsToCardSelectionStoreDataCallback =
    (state: CardSelectionStoreData, results: ScanNodeResult[] | null): CardSelectionStoreData => {
        if (results) {
            results.forEach(result => {
                if (result.status !== 'fail' && result.status !== 'unknown') {
                    return;
                }

                if (state.rules![result.ruleId] === undefined) {
                    state.rules![result.ruleId] = {
                        isExpanded: false,
                        cards: {},
                    };
                }

                state.rules![result.ruleId].cards[result.uid] = false;
            });
        }

        return state;
    };

export type ConvertUnifiedStoreDataToScanNodeResultsCallback = (
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
) => ScanNodeResult[] | null;

export function convertUnifiedStoreDataToScanNodeResults(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
): ScanNodeResult[] | null {
    const { rules, results } = unifiedScanResultStoreData;
    if (unifiedScanResultStoreData == null || results == null) {
        return null;
    }

    const transformedResults = results.map(unifiedResult => {
        const rule = rules
            ? find(rules, unifiedRule => unifiedRule.id === unifiedResult.ruleId)
            : { id: unifiedResult.ruleId };
        if (rule == null) {
            throw new Error(`Got result with unknown ruleId ${unifiedResult.ruleId}`);
        }

        const result: ScanNodeResult = {
            ...unifiedResult,
            rule,
        };

        return result;
    });
    return transformedResults;
}

export type ConvertAssessmentStoreDataToScanNodeResultsCallback = (
    assessmentStoreData: AssessmentStoreData,
    selectedTest: string,
    cardSelectionStoreData: CardSelectionStoreData,
    ruleInfoMap?: ScannerRuleInfoMap,
) => ScanNodeResult[] | null;

export function convertAssessmentStoreDataToScanNodeResults(
    assessmentStoreData: AssessmentStoreData,
    selectedTest: string,
    cardSelectionStoreData: CardSelectionStoreData,
    ruleInfoMap?: ScannerRuleInfoMap,
): ScanNodeResult[] | null {
    if (
        selectedTest == null ||
        assessmentStoreData?.assessments == null ||
        assessmentStoreData?.assessments[selectedTest] == null
    ) {
        return null;
    }

    const testData = assessmentStoreData.assessments[selectedTest];
    const allResults: ScanNodeResult[] = [];

    forOwn(
        testData.generatedAssessmentInstancesMap,
        (instance: GeneratedAssessmentInstance, selector: string) => {
            forOwn(
                instance.testStepResults,
                (testStepResult: TestStepResult, requirementIdentifier) => {
                    const node: ScanNodeResult = convertAssessmentResultToScanNodeResult(
                        testStepResult,
                        selector,
                        instance,
                        requirementIdentifier,
                        cardSelectionStoreData,
                        ruleInfoMap?.[requirementIdentifier],
                    );
                    allResults.push(node);
                },
            );
        },
    );

    return allResults;
}

function convertAssessmentResultToScanNodeResult(
    testStepResult: TestStepResult,
    selector: string,
    instance: GeneratedAssessmentInstance,
    requirementIdentifier: string,
    cardSelectionViewDataForTest: CardSelectionStoreData,
    ruleInfo: ScannerRuleInfo | undefined,
): ScanNodeResult {
    const instanceId = testStepResult.id;
    const status = convertTestStepResultStatusToCardResultStatus(testStepResult.status);
    const node: ScanNodeResult = {
        status: status,
        ruleId: requirementIdentifier,
        uid: instanceId,
        identifiers: {
            conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(selector),
            identifier: selector,
            'css-selector': selector,
            target: instance.target,
        },
        descriptors: {
            snippet: instance.html,
        },
        resolution: {
            ...testStepResult.resolution,
        },
        rule: {
            id: requirementIdentifier,
            description: ruleInfo?.help,
            url: ruleInfo?.url,
            guidance: ruleInfo?.a11yCriteria,
        },
    };
    return node;
}

const convertTestStepResultStatusToCardResultStatus = (
    status: ManualTestStatus,
): InstanceResultStatus => {
    switch (status) {
        case ManualTestStatus.PASS:
            return 'pass';
        case ManualTestStatus.FAIL:
            return 'fail';
        case ManualTestStatus.UNKNOWN:
            return 'unknown';
    }
};
