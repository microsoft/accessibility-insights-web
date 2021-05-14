// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { ManualTestStatus, TestStepData } from 'common/types/manual-test-status';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import {
    AssessmentStatusData,
    AssessmentSummaryResult,
    getAssessmentSummaryModelFromProviderAndStatusData,
    getAssessmentSummaryModelFromProviderAndStoreData,
    getAssessmentSummaryModelFromResults,
} from 'reports/get-assessment-summary-model';

type IAssessmentSubsetForSummary = Pick<Assessment, 'title' | 'key'>;

describe('getAssessmentSummaryModel', () => {
    const sampleTestStepData: { [key: string]: TestStepData } = {
        pass: {
            stepFinalResult: ManualTestStatus.PASS,
            isStepScanned: true,
        },
        fail: {
            stepFinalResult: ManualTestStatus.FAIL,
            isStepScanned: true,
        },
        incomplete: {
            stepFinalResult: ManualTestStatus.UNKNOWN,
            isStepScanned: true,
        },
        unscanned: {
            stepFinalResult: ManualTestStatus.UNKNOWN,
            isStepScanned: false,
        },
    };

    const sampleTests: { [key: string]: IAssessmentSubsetForSummary } = {
        test1: {
            title: 'Test 1',
            key: 'test1',
        },
        test2: {
            title: 'Test 2',
            key: 'test2',
        },
    };
    const sampleResults: { [key: string]: AssessmentSummaryResult } = {
        [sampleTests.test1.key]: {
            title: sampleTests.test1.title,
            storeData: {
                testStepStatus: {
                    step1a: sampleTestStepData.pass,
                },
            },
        },
        [sampleTests.test2.key]: {
            title: sampleTests.test2.title,
            storeData: {
                testStepStatus: {
                    step2a: sampleTestStepData.fail,
                    step2b: sampleTestStepData.fail,
                    step2c: sampleTestStepData.incomplete,
                    step2d: sampleTestStepData.unscanned,
                    step2e: sampleTestStepData.fail,
                },
            },
        },
    };

    const zeroRequirementsAll: IAssessmentSubsetForSummary[] = [];
    const zeroAssessmentsProvider: AssessmentsProvider =
        createTestAssessmentsProvider(zeroRequirementsAll);
    const zeroRequirementsStatusData: AssessmentStatusData = {} as any;
    const zeroRequirementsStoreData: AssessmentStoreData = {} as any;
    const zeroRequirementsResults: AssessmentSummaryResult[] = [];
    const zeroRequirementsModel: OverviewSummaryReportModel = {
        byPercentage: {
            fail: NaN,
            incomplete: NaN,
            pass: NaN,
        },
        byRequirement: {
            fail: 0,
            incomplete: 0,
            pass: 0,
        },
        reportSummaryDetailsData: [],
    };

    const singleRequirementAll: IAssessmentSubsetForSummary[] = [sampleTests.test1];
    const singleAssessmentsProvider: AssessmentsProvider =
        createTestAssessmentsProvider(singleRequirementAll);
    const singleRequirementStatusData: AssessmentStatusData = {
        [sampleTests.test1.key]: sampleResults[sampleTests.test1.key].storeData.testStepStatus,
    } as any;
    const singleRequirementStoreData: AssessmentStoreData = {
        assessments: {
            [sampleTests.test1.key]: sampleResults[sampleTests.test1.key].storeData,
        },
    } as any;
    const singleRequirementResults: AssessmentSummaryResult[] = [
        sampleResults[sampleTests.test1.key],
    ];
    const singleRequirementModel: OverviewSummaryReportModel = {
        byPercentage: {
            fail: 0,
            incomplete: 0,
            pass: 100,
        },
        byRequirement: {
            fail: 0,
            incomplete: 0,
            pass: 1,
        },
        reportSummaryDetailsData: [
            {
                displayName: sampleTests.test1.title,
                fail: 0,
                incomplete: 0,
                pass: 1,
            },
        ],
    };

    const multipleRequirementsAll: IAssessmentSubsetForSummary[] = [
        sampleTests.test1,
        sampleTests.test2,
    ];
    const multipleAssessmentsProvider: AssessmentsProvider =
        createTestAssessmentsProvider(multipleRequirementsAll);
    const multipleRequirementsStatusData: AssessmentStatusData = {
        [sampleTests.test1.key]: sampleResults[sampleTests.test1.key].storeData.testStepStatus,
        [sampleTests.test2.key]: sampleResults[sampleTests.test2.key].storeData.testStepStatus,
    } as any;
    const multipleRequirementsStoreData: AssessmentStoreData = {
        assessments: {
            [sampleTests.test1.key]: sampleResults[sampleTests.test1.key].storeData,
            [sampleTests.test2.key]: sampleResults[sampleTests.test2.key].storeData,
        },
    } as any;
    const multipleRequirementsResults: AssessmentSummaryResult[] = [
        sampleResults[sampleTests.test1.key],
        sampleResults[sampleTests.test2.key],
    ];
    const multipleRequirementsModel: OverviewSummaryReportModel = {
        byPercentage: {
            fail: 30,
            incomplete: 20,
            pass: 50,
        },
        byRequirement: {
            fail: 3,
            incomplete: 2,
            pass: 1,
        },
        reportSummaryDetailsData: [
            {
                displayName: sampleTests.test1.title,
                fail: 0,
                incomplete: 0,
                pass: 1,
            },
            {
                displayName: sampleTests.test2.title,
                fail: 3,
                incomplete: 2,
                pass: 0,
            },
        ],
    };

    function createTestAssessmentsProvider(
        requirements: IAssessmentSubsetForSummary[],
    ): AssessmentsProvider {
        const testAssessmentsProvider: AssessmentsProvider = {
            all: () => requirements,
        } as any;
        return testAssessmentsProvider;
    }

    describe('getAssessmentSummaryModelFromProviderAndStoreData', () => {
        it('handles zero requirements', () => {
            const actual = getAssessmentSummaryModelFromProviderAndStoreData(
                zeroAssessmentsProvider,
                zeroRequirementsStoreData,
            );

            expect(actual).toEqual(zeroRequirementsModel);
        });

        it('handles one requirement', () => {
            const actual = getAssessmentSummaryModelFromProviderAndStoreData(
                singleAssessmentsProvider,
                singleRequirementStoreData,
            );

            expect(actual).toEqual(singleRequirementModel);
        });

        it('handles multiple requirements', () => {
            const actual = getAssessmentSummaryModelFromProviderAndStoreData(
                multipleAssessmentsProvider,
                multipleRequirementsStoreData,
            );

            expect(actual).toEqual(multipleRequirementsModel);
        });
    });

    describe('getAssessmentSummaryModelFromProviderAndStatusData', () => {
        it('handles zero requirements', () => {
            const actual = getAssessmentSummaryModelFromProviderAndStatusData(
                zeroAssessmentsProvider,
                zeroRequirementsStatusData,
            );

            expect(actual).toEqual(zeroRequirementsModel);
        });

        it('handles one requirement', () => {
            const actual = getAssessmentSummaryModelFromProviderAndStatusData(
                singleAssessmentsProvider,
                singleRequirementStatusData,
            );

            expect(actual).toEqual(singleRequirementModel);
        });

        it('handles multiple requirements', () => {
            const actual = getAssessmentSummaryModelFromProviderAndStatusData(
                multipleAssessmentsProvider,
                multipleRequirementsStatusData,
            );

            expect(actual).toEqual(multipleRequirementsModel);
        });
    });

    describe('getAssessmentSummaryModelFromResults', () => {
        it('handles zero requirements', () => {
            const actual = getAssessmentSummaryModelFromResults(zeroRequirementsResults);

            expect(actual).toEqual(zeroRequirementsModel);
        });

        it('handles one requirement', () => {
            const actual = getAssessmentSummaryModelFromResults(singleRequirementResults);

            expect(actual).toEqual(singleRequirementModel);
        });

        it('handles multiple requirements', () => {
            const actual = getAssessmentSummaryModelFromResults(multipleRequirementsResults);

            expect(actual).toEqual(multipleRequirementsModel);
        });
    });
});
