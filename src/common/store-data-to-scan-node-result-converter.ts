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
import { IssueFilingUrlStringUtils } from 'issue-filing/common/issue-filing-url-string-utils';
import { find, forOwn } from 'lodash';

export type ScanNodeResult = UnifiedResult & {
    rule: UnifiedRule;
};

export type ConvertStoreDataForScanNodeResultsCallback = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData,
    cardSelectionStoreData?: CardSelectionStoreData,
) => ScanNodeResult[] | null;

export const convertStoreDataForScanNodeResults: ConvertStoreDataForScanNodeResultsCallback = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData,
    cardSelectionStoreData?: CardSelectionStoreData,
): ScanNodeResult[] | null => {
    let results: ScanNodeResult[] | null = convertUnifiedStoreDataToScanNodeResults(
        storeData as UnifiedScanResultStoreData,
    );
    if (results === null) {
        results = convertAssessmentStoreDataToScanNodeResults(
            storeData as AssessmentStoreData,
            cardSelectionStoreData,
        );
    }
    return results;
};

function convertUnifiedStoreDataToScanNodeResults(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
): ScanNodeResult[] | null {
    if (
        isNullOrUndefined(unifiedScanResultStoreData) ||
        isNullOrUndefined(unifiedScanResultStoreData.rules) ||
        isNullOrUndefined(unifiedScanResultStoreData.results)
    ) {
        return null;
    }
    const { rules, results } = unifiedScanResultStoreData;

    const transformedResults = results.map(unifiedResult => {
        const rule = find(rules, unifiedRule => unifiedRule.id === unifiedResult.ruleId);
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
    assessmentStoreData: AssessmentStoreData,
    cardSelectionStoreData?: CardSelectionStoreData,
): ScanNodeResult[] | null {
    if (
        isNullOrUndefined(assessmentStoreData) ||
        isNullOrUndefined(assessmentStoreData.assessmentNavState) ||
        isNullOrUndefined(assessmentStoreData.assessments) ||
        isNullOrUndefined(
            assessmentStoreData.assessments[
                assessmentStoreData.assessmentNavState.selectedTestType
            ],
        )
    ) {
        return null;
    }

    const selectedTest = assessmentStoreData.assessmentNavState.selectedTestType;
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
