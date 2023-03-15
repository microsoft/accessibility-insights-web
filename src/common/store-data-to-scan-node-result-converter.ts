// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { isNullOrUndefined } from '@microsoft/applicationinsights-core-js';
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
import { VisualizationType } from 'common/types/visualization-type';
import { IssueFilingUrlStringUtils } from 'issue-filing/common/issue-filing-url-string-utils';
import { find, forOwn } from 'lodash';

export type ScanNodeResult = UnifiedResult & {
    rule: UnifiedRule;
};

export type ConvertStoreDataForScanNodeResultsCallback = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData | null,
    cardSelectionStoreData?: CardSelectionStoreData,
    testKey?: VisualizationType,
) => ScanNodeResult[] | null;

export const convertStoreDataForScanNodeResults: ConvertStoreDataForScanNodeResultsCallback = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData | null,
    cardSelectionStoreData?: CardSelectionStoreData,
    testKey?: VisualizationType,
): ScanNodeResult[] | null => {
    let results: ScanNodeResult[] | null = convertUnifiedStoreDataToScanNodeResults(
        storeData as UnifiedScanResultStoreData,
    );
    if (results === null) {
        results = convertAssessmentStoreDataToScanNodeResults(
            storeData as AssessmentStoreData,
            cardSelectionStoreData,
            testKey,
        );
    }
    return results;
};

export type ConvertResultsToCardSelectionStoreDataCallback = (
    state: CardSelectionStoreData,
    storeData: UnifiedScanResultStoreData | AssessmentStoreData | null,
    testKey?: VisualizationType,
) => CardSelectionStoreData;

export const convertResultsToCardSelectionStoreData: ConvertResultsToCardSelectionStoreDataCallback =
    (
        state: CardSelectionStoreData,
        storeData: UnifiedScanResultStoreData | AssessmentStoreData | null,
        testKey?: VisualizationType,
    ): CardSelectionStoreData => {
        const results = convertStoreDataForScanNodeResults(storeData, state, testKey);

        if (results) {
            results.forEach(result => {
                if (result.status !== 'fail' && result.status !== 'unknown') {
                    return;
                }

                if (state.rules === null) {
                    state.rules = {};
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

function convertUnifiedStoreDataToScanNodeResults(
    unifiedScanResultStoreData: UnifiedScanResultStoreData | null,
): ScanNodeResult[] | null {
    if (
        isNullOrUndefined(unifiedScanResultStoreData) ||
        isNullOrUndefined(unifiedScanResultStoreData.results)
    ) {
        return null;
    }
    const { rules, results } = unifiedScanResultStoreData;

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

function convertAssessmentStoreDataToScanNodeResults(
    assessmentStoreData: AssessmentStoreData | null,
    cardSelectionStoreData?: CardSelectionStoreData,
    testKey?: VisualizationType,
): ScanNodeResult[] | null {
    if (
        isNullOrUndefined(assessmentStoreData) ||
        isNullOrUndefined(assessmentStoreData.assessments)
    ) {
        return null;
    }

    if (
        isNullOrUndefined(testKey) &&
        (isNullOrUndefined(assessmentStoreData.assessmentNavState) ||
            isNullOrUndefined(
                assessmentStoreData.assessments[
                    assessmentStoreData.assessmentNavState.selectedTestType
                ],
            ))
    ) {
        return null;
    }

    const selectedTest = testKey ?? assessmentStoreData.assessmentNavState.selectedTestType;
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
    cardSelectionViewDataForTest?: CardSelectionStoreData,
): ScanNodeResult {
    const instanceId = testStepResult.id;
    const status = convertTestStepResultStatusToCardResultStatus(testStepResult.status);
    const node: ScanNodeResult = {
        isSelected: cardSelectionViewDataForTest?.rules
            ? cardSelectionViewDataForTest.rules[requirementIdentifier]?.cards[instanceId]
            : false,
        status: status,
        ruleId: requirementIdentifier,
        uid: instanceId,
        identifiers: {
            conciseName: IssueFilingUrlStringUtils.getSelectorLastPart(selector),
            identifier: selector,
        },
        descriptors: {
            snippet: instance.html,
        },
        resolution: {
            howToFixSummary: testStepResult.failureSummary,
        },
        rule: { id: requirementIdentifier },
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
