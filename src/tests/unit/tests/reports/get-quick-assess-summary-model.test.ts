// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus, TestStepData } from 'common/types/store-data/manual-test-status';
import {
    AssessmentStatusData,
    AssessmentSummaryResult,
} from 'reports/get-assessment-summary-model';

import {
    getQuickAssessSummaryModelFromProviderAndStatusData,
    getQuickAssessSummaryModelFromProviderAndStoreData,
} from 'reports/get-quick-assess-summary-model';
import { IMock, It, Mock } from 'typemoq';

type IRequirementSubsetForSummary = Pick<Requirement, 'name' | 'key'>;
type IAssessmentSubsetForSummary = Pick<Assessment, 'title' | 'key' | 'visualizationType'> & {
    requirements: IRequirementSubsetForSummary[];
};

describe('getQuickAssessSummaryModel', () => {
    const mockAssessmentsProvider: IMock<AssessmentsProvider> = Mock.ofType<AssessmentsProvider>();
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

    const sampleRequirements = {
        step1a: {
            name: 'Step 1A',
            key: 'step1a',
        },
        step2a: {
            name: 'Step 2A',
            key: 'step2a',
        },
        step2b: {
            name: 'Step 2B',
            key: 'step2b',
        },
        step2c: {
            name: 'Step 2C',
            key: 'step2c',
        },
        step2d: {
            name: 'Step 2D',
            key: 'step2d',
        },
        step2e: {
            name: 'Step 2E',
            key: 'step2e',
        },
    };

    const sampleAssessments: { [key: string]: IAssessmentSubsetForSummary } = {
        automatedChecks: {
            title: 'Automated Checks',
            key: AutomatedChecks.key,
            visualizationType: 0,
            requirements: [
                { name: 'Any', key: 'any' },
                { name: 'Name', key: 'Name' },
                { name: 'Will', key: 'Will' },
                { name: 'Do', key: 'Do' },
            ],
        },
        test1: {
            title: 'Test 1',
            key: 'test1',
            visualizationType: 1,
            requirements: [sampleRequirements.step1a],
        },
        test2: {
            title: 'Test 2',
            key: 'test2',
            visualizationType: 2,
            requirements: [
                sampleRequirements.step2a,
                sampleRequirements.step2b,
                sampleRequirements.step2c,
                sampleRequirements.step2d,
                sampleRequirements.step2e,
            ],
        },
    };

    const sampleResults: { [key: string]: AssessmentSummaryResult } = {
        [sampleAssessments.test1.key]: {
            title: sampleAssessments.test1.title,
            storeData: {
                testStepStatus: {
                    step1a: sampleTestStepData.pass,
                },
            },
        },
        [sampleAssessments.test2.key]: {
            title: sampleAssessments.test2.title,
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
        [sampleAssessments.automatedChecks.key]: {
            title: sampleAssessments.automatedChecks.title,
            storeData: {
                testStepStatus: {
                    any: sampleTestStepData.pass,
                    name: sampleTestStepData.pass,
                    will: sampleTestStepData.fail,
                    do: sampleTestStepData.fail,
                },
            },
        },
    };

    const quickAssessAllRequirementKeysStub = Object.keys(sampleRequirements);
    const quickAssessSomeRequirementKeysStub = [
        sampleRequirements.step1a.key,
        sampleRequirements.step2c.key,
        sampleRequirements.step2e.key,
    ];
    const quickAssessSingleRequirementKeyStub = [sampleRequirements.step1a.key];

    const multipleAssessmentsAll: IAssessmentSubsetForSummary[] = [
        sampleAssessments.automatedChecks,
        sampleAssessments.test1,
        sampleAssessments.test2,
    ];
    const multipleRequirementsStatusData: AssessmentStatusData = {
        [sampleAssessments.automatedChecks.key]:
            sampleResults[sampleAssessments.automatedChecks.key].storeData.testStepStatus,
        [sampleAssessments.test1.key]:
            sampleResults[sampleAssessments.test1.key].storeData.testStepStatus,
        [sampleAssessments.test2.key]:
            sampleResults[sampleAssessments.test2.key].storeData.testStepStatus,
    } as any;
    const multipleRequirementsStoreData: AssessmentStoreData = {
        assessments: {
            [sampleAssessments.automatedChecks.key]: {
                testStepStatus:
                    sampleResults[sampleAssessments.automatedChecks.key].storeData.testStepStatus,
            },
            [sampleAssessments.test1.key]: {
                testStepStatus: sampleResults[sampleAssessments.test1.key].storeData.testStepStatus,
            },
            [sampleAssessments.test2.key]: {
                testStepStatus: sampleResults[sampleAssessments.test2.key].storeData.testStepStatus,
            },
        },
    } as any;

    function setupMockAssessmentsProvider() {
        mockAssessmentsProvider
            .setup(ap => ap.all())
            .returns(() => multipleAssessmentsAll as Assessment[]);
        mockAssessmentsProvider
            .setup(ap => ap.forKey(AutomatedChecks.key))
            .returns(() => sampleAssessments.automatedChecks as Assessment);
        mockAssessmentsProvider
            .setup(ap => ap.forRequirementKey(It.isAnyString()))
            .returns((requirementKey: string) => {
                const testKey = `test${requirementKey.charAt(requirementKey.length - 2)}`;
                return sampleAssessments[testKey] as Assessment;
            });
        mockAssessmentsProvider
            .setup(ap => ap.getStep(It.isAnyNumber(), It.isAnyString()))
            .returns((visualizationType, requirementKey: string) => {
                return sampleRequirements[requirementKey] as Requirement;
            });
    }

    describe('getAssessmentSummaryModelFromProviderAndStoreData', () => {
        beforeEach(() => {
            mockAssessmentsProvider.reset();
        });

        it.each`
            name                    | quickAssessRequirementKeysStub
            ${'empty requirements'} | ${[]}
            ${'one requirement'}    | ${quickAssessSingleRequirementKeyStub}
            ${'all requirements'}   | ${quickAssessAllRequirementKeysStub}
            ${'some requirements'}  | ${quickAssessSomeRequirementKeysStub}
        `(
            'handles multiple requirements completed for $name included',
            ({ quickAssessRequirementKeysStub }) => {
                setupMockAssessmentsProvider();
                const actual = getQuickAssessSummaryModelFromProviderAndStoreData(
                    mockAssessmentsProvider.object,
                    multipleRequirementsStoreData,
                    quickAssessRequirementKeysStub,
                );

                expect(actual).toMatchSnapshot();
            },
        );
    });

    describe('getQuickAssessSummaryModelFromProviderAndStatusData', () => {
        beforeEach(() => {
            mockAssessmentsProvider.reset();
        });
        it.each`
            name                    | quickAssessRequirementKeysStub
            ${'empty requirements'} | ${[]}
            ${'one requirement'}    | ${quickAssessSingleRequirementKeyStub}
            ${'all requirements'}   | ${quickAssessAllRequirementKeysStub}
            ${'some requirements'}  | ${quickAssessSomeRequirementKeysStub}
        `('handles $name included in assessment', ({ quickAssessRequirementKeysStub }) => {
            setupMockAssessmentsProvider();
            const actual = getQuickAssessSummaryModelFromProviderAndStatusData(
                mockAssessmentsProvider.object,
                multipleRequirementsStatusData,
                quickAssessRequirementKeysStub,
            );

            expect(actual).toMatchSnapshot();
        });
    });
});
