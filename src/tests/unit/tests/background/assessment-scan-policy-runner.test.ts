// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { AssessmentsProvider } from '../../../../assessments/assessments-provider';
import { Assessment } from '../../../../assessments/types/iassessment';
import { AssessmentScanPolicyRunner, IIsAnAssessmentSelected, IScheduleScan } from '../../../../background/assessment-scan-policy-runner';
import { AssessmentStore } from '../../../../background/stores/assessment-store';
import { VisualizationStore } from '../../../../background/stores/visualization-store';
import { IBaseStore } from '../../../../common/istore';
import { IAssessmentData, IAssessmentStoreData } from '../../../../common/types/store-data/iassessment-result-data';
import { IVisualizationStoreData, TestsEnabledState } from '../../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';

describe('AssessmentScanPolicyRunner', () => {
    describe('constructor', () => {
        it('exists', () => {
            expect(new AssessmentScanPolicyRunner(null, null, null, null, null, null)).toBeDefined();
        });
    });

    describe('beginListeningToStores', () => {
        let storeChangeCallback;
        let assessmentStoreMock: IMock<AssessmentStore>;
        let visualizationStore: IMock<VisualizationStore>;
        let assessmentProviderMock: IMock<AssessmentsProvider>;
        let scheduleScanMock: IMock<IScheduleScan>;
        let getSelectedAssessmentTestMock: IMock<IIsAnAssessmentSelected>;
        let testSubject: AssessmentScanPolicyRunner;
        let testData: TestsEnabledState;
        let assessmentDataStub: IAssessmentData;

        const stepStub = 'test step';
        const testType = -1;
        const currentTabId = -2;

        beforeEach(() => {
            storeChangeCallback = null;
            assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
            visualizationStore = Mock.ofType(VisualizationStore, MockBehavior.Strict);
            assessmentProviderMock = Mock.ofType(AssessmentsProvider, MockBehavior.Strict);
            getSelectedAssessmentTestMock = Mock.ofInstance((testData: TestsEnabledState) => null, MockBehavior.Strict);
            scheduleScanMock = Mock.ofInstance((test: VisualizationType, step: string, tabId: number) => null, MockBehavior.Strict);
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
            setupStoreGetState<IVisualizationStoreData>(visualizationStore, { tests: testData } as IVisualizationStoreData);
            setupStoreGetState<IAssessmentStoreData>(assessmentStoreMock, {
                persistedTabInfo: { id: currentTabId },
            } as IAssessmentStoreData);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should not do anything, current tab is not the assessment tab', () => {
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupStoreGetState<IVisualizationStoreData>(visualizationStore, { tests: testData } as IVisualizationStoreData);
            setupStoreGetState<IAssessmentStoreData>(assessmentStoreMock, { persistedTabInfo: { id: 1 } } as IAssessmentStoreData);
            setupGetSelectedAssessmentTest(true);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should not do anything, assessment target tab is null', () => {
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupStoreGetState<IVisualizationStoreData>(visualizationStore, { tests: testData } as IVisualizationStoreData);
            setupStoreGetState<IAssessmentStoreData>(assessmentStoreMock, { persistedTabInfo: null } as IAssessmentStoreData);
            setupGetSelectedAssessmentTest(true);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should not do anything, as something is already being scanned', () => {
            const visualizationStateStub: Partial<IVisualizationStoreData> = { tests: testData, scanning: 'something' };
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupGetSelectedAssessmentTest(true);
            setupStoreGetState<IVisualizationStoreData>(visualizationStore, visualizationStateStub as IVisualizationStoreData);
            setupStoreGetState<IAssessmentStoreData>(assessmentStoreMock, {
                persistedTabInfo: { id: currentTabId },
            } as IAssessmentStoreData);

            testSubject.beginListeningToStores();
            storeChangeCallback();

            expect(testSubject.beginListeningToStores).toBeDefined();
            verifyMocks();
        });

        it('should execute assessment scan policy from configuration.', () => {
            const executeAssessmentScanMock = Mock.ofInstance(
                (scanStep: (step: string) => void, data: IAssessmentData) => null,
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
                type: testType,
            } as Assessment;
            const getAssessmentDataMock = Mock.ofInstance((data: IAssessmentStoreData) => null);
            setupStoreMockForCallback(assessmentStoreMock);
            setupStoreMockForCallback(visualizationStore);
            setupGetSelectedAssessmentTest(true);
            setupStoreGetState<IVisualizationStoreData>(visualizationStore, { tests: testData } as IVisualizationStoreData);
            setupStoreGetState<IAssessmentStoreData>(assessmentStoreMock, assessmentStoreDataStub as IAssessmentStoreData);
            setupAssessmentsProvider(assessmentProviderMock, assessmentConfig);

            let scanStepCallback: (step: string) => void;

            executeAssessmentScanMock
                .setup(easm => easm(It.isAny(), assessmentDataStub))
                .callback(scanStep => {
                    expect(typeof scanStep).toBe('function');
                    scanStepCallback = scanStep;
                })
                .verifiable();

            scheduleScanMock.setup(ssm => ssm(testType, stepStub, currentTabId)).verifiable();

            getAssessmentDataMock
                .setup(gadm => gadm(assessmentStoreDataStub as IAssessmentStoreData))
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

        function setupStoreMockForCallback(storeMock: IMock<IBaseStore<any>>): void {
            storeMock
                .setup(sm => sm.addChangedListener(It.isAny()))
                .callback(listener => {
                    expect(typeof listener).toBe('function');
                    storeChangeCallback = listener;
                })
                .verifiable();
        }

        function setupStoreGetState<T>(storeMock: IMock<IBaseStore<T>>, state: T): void {
            storeMock
                .setup(sm => sm.getState())
                .returns(() => state)
                .verifiable();
        }

        function setupAssessmentsProvider(mock: IMock<AssessmentsProvider>, config: Assessment): void {
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
