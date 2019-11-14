// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import {
    AssessmentScanPolicyRunner,
    IIsAnAssessmentSelected,
    IScheduleScan,
} from 'background/assessment-scan-policy-runner';
import { AssessmentStore } from 'background/stores/assessment-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { BaseStore } from '../../../../common/base-store';
import {
    AssessmentData,
    AssessmentStoreData,
} from '../../../../common/types/store-data/assessment-result-data';
import {
    TestsEnabledState,
    VisualizationStoreData,
} from '../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';

describe('AssessmentScanPolicyRunner', () => {
    describe('constructor', () => {
        it('exists', () => {
            expect(
                new AssessmentScanPolicyRunner(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ),
            ).toBeDefined();
        });
    });

    describe('beginListeningToStores', () => {
        let storeChangeCallback;
        let assessmentStoreMock: IMock<AssessmentStore>;
        let visualizationStore: IMock<VisualizationStore>;
        let assessmentProviderMock: IMock<AssessmentsProviderImpl>;
        let scheduleScanMock: IMock<IScheduleScan>;
        let getSelectedAssessmentTestMock: IMock<IIsAnAssessmentSelected>;
        let testSubject: AssessmentScanPolicyRunner;
        let testData: TestsEnabledState;
        let assessmentDataStub: AssessmentData;

        const stepStub = 'test step';
        const testType = -1;
        const currentTabId = -2;

        beforeEach(() => {
            storeChangeCallback = null;
            assessmentStoreMock = Mock.ofType(
                AssessmentStore,
                MockBehavior.Strict,
            );
            visualizationStore = Mock.ofType(
                VisualizationStore,
                MockBehavior.Strict,
            );
            assessmentProviderMock = Mock.ofType(
                AssessmentsProviderImpl,
                MockBehavior.Strict,
            );
            getSelectedAssessmentTestMock = Mock.ofInstance(
                (testTestData: TestsEnabledState) => null,
                MockBehavior.Strict,
            );
            scheduleScanMock = Mock.ofInstance(
                (test: VisualizationType, step: string, tabId: number) => null,
                MockBehavior.Strict,
            );
            testSubject = new AssessmentScanPolicyRunner(
                assessmentStoreMock.object,
                visualizationStore.object,
                scheduleScanMock.object,
                assessmentProviderMock.object,
                getSelectedAssessmentTestMock.object,
                currentTabId,
            );
            assessmentDataStub = {
                testStepStatus: {
                    [stepStub]: {
                        isStepScanned: false,
                        stepFinalResult: null,
                    },
                },
                fullAxeResultsMap: null,
            };

            testData = {} as TestsEnabledState;
        });

        it('should not do anything, as test is not an assessment', () => {
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupGetSelectedAssessmentTest(false);
            setupStoreGetState<VisualizationStoreData>(visualizationStore, {
                tests: testData,
            } as VisualizationStoreData);
            setupStoreGetState<AssessmentStoreData>(assessmentStoreMock, {
                persistedTabInfo: { id: currentTabId },
            } as AssessmentStoreData);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should not do anything, current tab is not the assessment tab', () => {
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupStoreGetState<VisualizationStoreData>(visualizationStore, {
                tests: testData,
            } as VisualizationStoreData);
            setupStoreGetState<AssessmentStoreData>(assessmentStoreMock, {
                persistedTabInfo: { id: 1 },
            } as AssessmentStoreData);
            setupGetSelectedAssessmentTest(true);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should not do anything, assessment target tab is null', () => {
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupStoreGetState<VisualizationStoreData>(visualizationStore, {
                tests: testData,
            } as VisualizationStoreData);
            setupStoreGetState<AssessmentStoreData>(assessmentStoreMock, {
                persistedTabInfo: null,
            } as AssessmentStoreData);
            setupGetSelectedAssessmentTest(true);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should not do anything, as something is already being scanned', () => {
            const visualizationStateStub: Partial<VisualizationStoreData> = {
                tests: testData,
                scanning: 'something',
            };
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupGetSelectedAssessmentTest(true);
            setupStoreGetState<VisualizationStoreData>(
                visualizationStore,
                visualizationStateStub as VisualizationStoreData,
            );
            setupStoreGetState<AssessmentStoreData>(assessmentStoreMock, {
                persistedTabInfo: { id: currentTabId },
            } as AssessmentStoreData);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should execute assessment scan policy from configuration.', () => {
            const executeAssessmentScanMock = Mock.ofInstance(
                (scanStep: (step: string) => void, data: AssessmentData) =>
                    null,
                MockBehavior.Strict,
            );
            const assessmentStoreDataStub = {
                assessmentNavState: {
                    selectedTestStep: null,
                    selectedTestType: testType,
                },
                persistedTabInfo: { id: currentTabId },
            };
            const assessmentConfig = {
                executeAssessmentScanPolicy: executeAssessmentScanMock.object,
                getVisualizationConfiguration: () => {
                    return {
                        getAssessmentData: getAssessmentDataMock.object,
                    };
                },
                visualizationType: testType,
            } as Assessment;
            const getAssessmentDataMock = Mock.ofInstance(
                (data: AssessmentStoreData) => null,
            );
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupGetSelectedAssessmentTest(true);
            setupStoreGetState<VisualizationStoreData>(visualizationStore, {
                tests: testData,
            } as VisualizationStoreData);
            setupStoreGetState<AssessmentStoreData>(
                assessmentStoreMock,
                assessmentStoreDataStub as AssessmentStoreData,
            );
            setupAssessmentsProvider(assessmentProviderMock, assessmentConfig);

            let scanStepCallback: (step: string) => void;

            executeAssessmentScanMock
                .setup(easm => easm(It.isAny(), assessmentDataStub))
                .callback(scanStep => {
                    expect(typeof scanStep).toBe('function');
                    scanStepCallback = scanStep;
                })
                .verifiable();

            scheduleScanMock
                .setup(ssm => ssm(testType, stepStub, currentTabId))
                .verifiable();

            getAssessmentDataMock
                .setup(gadm =>
                    gadm(assessmentStoreDataStub as AssessmentStoreData),
                )
                .returns(() => assessmentDataStub)
                .verifiable();

            testSubject.beginListeningToStores();
            storeChangeCallback();
            scanStepCallback(stepStub);

            expect(testSubject.beginListeningToStores).toBeDefined();
            executeAssessmentScanMock.verifyAll();
            getAssessmentDataMock.verifyAll();
            verifyMocks();
        });

        function verifyMocks(): void {
            assessmentStoreMock.verifyAll();
            visualizationStore.verifyAll();
            assessmentProviderMock.verifyAll();
            scheduleScanMock.verifyAll();
            getSelectedAssessmentTestMock.verifyAll();
        }

        function setupStoreMockForCallback(
            storeMock: IMock<BaseStore<any>>,
        ): void {
            storeMock
                .setup(sm => sm.addChangedListener(It.isAny()))
                .callback(listener => {
                    expect(typeof listener).toBe('function');
                    storeChangeCallback = listener;
                })
                .verifiable();
        }

        function setupStoreGetState<T>(
            storeMock: IMock<BaseStore<T>>,
            state: T,
        ): void {
            storeMock
                .setup(sm => sm.getState())
                .returns(() => state)
                .verifiable();
        }

        function setupAssessmentsProvider(
            mock: IMock<AssessmentsProviderImpl>,
            config: Assessment,
        ): void {
            mock.setup(m => m.forType(testType))
                .returns(() => config)
                .verifiable();
        }

        function setupGetSelectedAssessmentTest(retValue: boolean): void {
            getSelectedAssessmentTestMock
                .setup(m => m(testData))
                .returns(() => retValue)
                .verifiable();
        }
    });
});
