// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    ExpandTestNavPayload,
    LoadAssessmentPayload,
    RemoveFailureInstancePayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
} from 'background/actions/action-payloads';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { AssessmentDataConverter } from 'background/assessment-data-converter';
import { AssessmentDataRemover } from 'background/assessment-data-remover';
import { InitialAssessmentStoreDataGenerator } from 'background/initial-assessment-store-data-generator';
import { AssessmentStore } from 'background/stores/assessment-store';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { AssessmentVisualizationConfiguration } from 'common/configs/assessment-visualization-configuration';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Tab } from 'common/itab';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import {
    ManualTestStatus,
    ManualTestStatusData,
    TestStepData,
} from 'common/types/manual-test-status';
import {
    AssessmentData,
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
    ManualTestStepResult,
    PersistedTabInfo,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ScanBasePayload,
    ScanCompletedPayload,
    ScanUpdatePayload,
} from 'injected/analyzers/analyzer';
import { cloneDeep, isFunction } from 'lodash';
import { ScanResults } from 'scanner/iruleresults';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { AssessmentDataBuilder } from '../../../common/assessment-data-builder';
import { AssessmentsStoreDataBuilder } from '../../../common/assessment-store-data-builder';
import { AssessmentStoreTester } from '../../../common/assessment-store-tester';
import { createStoreWithNullParams } from '../../../common/store-tester';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

const assessmentKey: string = 'assessment-1';
const requirementKey: string = 'assessment-1-step-1';
const assessmentType = -1 as VisualizationType;

describe('AssessmentStore', () => {
    let browserMock: IMock<BrowserAdapter>;
    let assessmentDataConverterMock: IMock<AssessmentDataConverter>;
    let assessmentDataRemoverMock: IMock<AssessmentDataRemover>;
    let assessmentsProvider: AssessmentsProvider;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let indexDBInstanceMock: IMock<IndexedDBAPI>;
    let assessmentMock: IMock<Assessment>;
    let getInstanceIdentiferGeneratorMock: IMock<(step: string) => Function>;
    let configStub: AssessmentVisualizationConfiguration;
    let instanceIdentifierGeneratorStub: (instances) => string;
    let initialAssessmentStoreDataGeneratorMock: IMock<InitialAssessmentStoreDataGenerator>;

    beforeEach(() => {
        instanceIdentifierGeneratorStub = () => null;
        browserMock = Mock.ofType<BrowserAdapter>();
        assessmentDataConverterMock = Mock.ofType(AssessmentDataConverter);
        assessmentDataRemoverMock = Mock.ofType(AssessmentDataRemover);
        getInstanceIdentiferGeneratorMock = Mock.ofInstance(step => null);
        configStub = {
            getAssessmentData: data => data.assessments[assessmentKey],
            getInstanceIdentiferGenerator: getInstanceIdentiferGeneratorMock.object,
        } as AssessmentVisualizationConfiguration;

        assessmentsProvider = CreateTestAssessmentProvider();
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(undefined, MockBehavior.Strict);
        assessmentMock = Mock.ofInstance({
            getVisualizationConfiguration: () => {
                return null;
            },
        } as Assessment);
        assessmentDataConverterMock
            .setup(dataConverter => dataConverter.getNewManualTestStepResult(It.isAny()))
            .returns(step => getDefaultManualTestStepResult(step));

        indexDBInstanceMock = Mock.ofType<IndexedDBAPI>(undefined, MockBehavior.Strict);
        initialAssessmentStoreDataGeneratorMock =
            Mock.ofType<InitialAssessmentStoreDataGenerator>();
    });

    afterEach(() => {
        initialAssessmentStoreDataGeneratorMock.verifyAll();
    });

    test('constructor, no side effect', () => {
        const testObject = createStoreWithNullParams(AssessmentStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(AssessmentStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.AssessmentStore]);
    });

    test('getDefaultState with no assessments', () => {
        const defaultStateStub = {};
        setupDataGeneratorMock(null, defaultStateStub as AssessmentStoreData);

        const testObject = new AssessmentStore(
            null,
            null,
            assessmentDataConverterMock.object,
            assessmentDataRemoverMock.object,
            assessmentsProviderMock.object,
            null,
            null,
            initialAssessmentStoreDataGeneratorMock.object,
            failTestOnErrorLogger,
        );

        const actualState = testObject.getDefaultState();

        expect(actualState).toEqual(defaultStateStub);
    });

    test('getDefaultState with persistedData', () => {
        const targetTab: PersistedTabInfo = {
            id: 1,
            url: 'url',
            title: 'title',
            appRefreshed: true,
        };
        const expectedTestType = -1 as VisualizationType;
        const expectedTestStep: string = 'assessment-1-step-1';
        const assessmentProvider = CreateTestAssessmentProvider();
        const assessments = assessmentProvider.all();

        const persisted: AssessmentStoreData = {
            persistedTabInfo: targetTab,
            assessments: {
                ['assessment-1']: {
                    fullAxeResultsMap: null,
                    generatedAssessmentInstancesMap: null,
                    manualTestStepResultMap: {
                        ['assessment-1-step-1']: {
                            instances: [],
                            status: 2,
                            id: 'assessment-1-step-1',
                        },
                        ['removed-step']: {
                            instances: [],
                            status: 2,
                            id: '123',
                        },
                    },
                    testStepStatus: {},
                },
            },
            assessmentNavState: {
                selectedTestType: expectedTestType,
                selectedTestSubview: expectedTestStep,
            },
            resultDescription: '',
        };

        const defaultValues: Partial<AssessmentData> = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: null,
            manualTestStepResultMap: null,
        };

        const expectedState: AssessmentStoreData = {
            persistedTabInfo: targetTab,
            assessments: {},
            assessmentNavState: {
                selectedTestType: expectedTestType,
                selectedTestSubview: expectedTestStep,
            },
            resultDescription: '',
        };

        assessments.forEach(assessment => {
            expectedState.assessments[assessment.key] = {
                ...defaultValues,
                manualTestStepResultMap: {},
                testStepStatus: {},
            } as AssessmentData;

            assessment.requirements.forEach(step => {
                const assessmentData = expectedState.assessments[assessment.key];
                assessmentData.testStepStatus[step.key] = getDefaultTestStepData();
                assessmentData.manualTestStepResultMap[step.key] = getDefaultManualTestStepResult(
                    step.key,
                );
            });
        });

        expectedState.assessments['assessment-1'].manualTestStepResultMap[
            expectedTestStep
        ].status = 2;

        setupDataGeneratorMock(persisted, expectedState);

        const testObject = new AssessmentStore(
            null,
            null,
            assessmentDataConverterMock.object,
            assessmentDataRemoverMock.object,
            assessmentProvider,
            null,
            persisted,
            initialAssessmentStoreDataGeneratorMock.object,
            failTestOnErrorLogger,
        );
        const actualState = testObject.getDefaultState();

        expect(actualState).toEqual(expectedState);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreTesterForAssessmentActions('getCurrentState').testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('on resetData: only reset data for one test', () => {
        const expectedInstanceMap = {};
        const expectedManualTestStepResultMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', expectedManualTestStepResultMap)
            .with('testStepStatus', getSampleTestStepsData())
            .build();

        const initialState = getStateWithAssessment(assessmentData);
        const expectedState = getDefaultStateWithDefaultAssessmentData(
            assessmentKey,
            requirementKey,
        );
        setupDataGeneratorMock(null, expectedState);
        const getVisualizationConfigurationMock = Mock.ofInstance(() => {});
        const visualizationConfigStub = {
            getAssessmentData: state => {
                return state.assessments[assessmentKey];
            },
        } as AssessmentVisualizationConfiguration;

        getVisualizationConfigurationMock
            .setup(configGetter => configGetter())
            .returns(() => {
                return visualizationConfigStub;
            });

        const assessmentStub = {
            getVisualizationConfiguration: getVisualizationConfigurationMock.object,
            key: assessmentKey,
            requirements: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;

        assessmentsProviderMock
            .setup(apm => apm.forType(assessmentType))
            .returns(() => assessmentStub);

        const payload: ToggleActionPayload = {
            test: assessmentType,
        };

        createStoreTesterForAssessmentActions('resetData')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('test that tests indexedDB and also reset', () => {
        const expectedInstanceMap = {};
        const expectedManualTestStepResultMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', expectedManualTestStepResultMap)
            .with('testStepStatus', getSampleTestStepsData())
            .build();

        const initialState = getStateWithAssessment(assessmentData);
        const finalState = getDefaultStateWithDefaultAssessmentData(assessmentKey, requirementKey);
        setupDataGeneratorMock(null, finalState);
        const getVisualizationConfigurationMock = Mock.ofInstance(() => {});
        const visualizationConfigStub = {
            getAssessmentData: state => {
                return state.assessments[assessmentKey];
            },
        } as AssessmentVisualizationConfiguration;

        getVisualizationConfigurationMock
            .setup(configGetter => configGetter())
            .returns(() => {
                return visualizationConfigStub;
            });

        const assessmentStub = {
            getVisualizationConfiguration: getVisualizationConfigurationMock.object,
            key: assessmentKey,
            requirements: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(apm => apm.forType(assessmentType))
            .returns(() => assessmentStub);

        const payload: ToggleActionPayload = {
            test: assessmentType,
        };

        createStoreTesterForAssessmentActions('resetData')
            .withActionParam(payload)
            .withPostListenerMock(indexDBInstanceMock)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('test for null indexedDB instance and also reset', () => {
        const expectedInstanceMap = {};
        const expectedManualTestStepResultMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', expectedManualTestStepResultMap)
            .with('testStepStatus', getSampleTestStepsData())
            .build();

        const initialState = getStateWithAssessment(assessmentData);
        const finalState = getDefaultStateWithDefaultAssessmentData(assessmentKey, requirementKey);
        setupDataGeneratorMock(null, finalState);
        const getVisualizationConfigurationMock = Mock.ofInstance(() => {});
        const visualizationConfigStub = {
            getAssessmentData: state => {
                return state.assessments[assessmentKey];
            },
        } as AssessmentVisualizationConfiguration;

        getVisualizationConfigurationMock
            .setup(configGetter => configGetter())
            .returns(() => {
                return visualizationConfigStub;
            });

        const assessmentStub = {
            getVisualizationConfiguration: getVisualizationConfigurationMock.object,
            key: assessmentKey,
            requirements: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(apm => apm.forType(assessmentType))
            .returns(() => assessmentStub);

        const payload: ToggleActionPayload = {
            test: assessmentType,
        };

        createStoreTesterForAssessmentActions('resetData')
            .withActionParam(payload)
            .withPostListenerMock(indexDBInstanceMock)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onResetAllAssessmentsData', () => {
        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab: Tab = {
            id: tabId,
            url,
            title,
        };
        let rejectCb;
        browserMock
            .setup(b => b.getTab(tabId, It.isAny(), It.isAny()))
            .returns((id, resolve, reject) => {
                rejectCb = reject;
                resolve(tab);
            })
            .verifiable();
        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestType(VisualizationType.Color)
            .withTargetTab(oldTabId, null, null, true)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title, false)
            .build();

        setupDataGeneratorMock(null, getDefaultState());

        createStoreTesterForAssessmentActions('resetAllAssessmentsData')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);

        expect(() => rejectCb()).toThrowErrorMatchingSnapshot();
    });

    test('onContinuePreviousAssessment', () => {
        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab: Tab = {
            id: tabId,
            url,
            title,
        };
        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        browserMock
            .setup(adapter => adapter.getTab(tabId, It.is(isFunction), It.is(isFunction)))
            .callback((id, resolve) => resolve(tab));

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(oldTabId, null, null, true)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title, false)
            .build();

        createStoreTesterForAssessmentActions('continuePreviousAssessment')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onLoadAssessment', () => {
        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';

        const tab: Tab = {
            id: tabId,
            url,
            title,
        };

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(oldTabId, null, null, true)
            .build();

        const payload: LoadAssessmentPayload = {
            tabId,
            versionedAssessmentData: {
                version: -1,
                assessmentData: initialState,
            },
        };

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title, false)
            .build();

        setupDataGeneratorMock(payload.versionedAssessmentData.assessmentData, initialState);

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        browserMock
            .setup(adapter => adapter.getTab(tabId, It.is(isFunction), It.is(isFunction)))
            .callback((id, resolve) => resolve(tab));

        createStoreTesterForAssessmentActions('LoadAssessment')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanCompleted with an assisted requirement', () => {
        const initialAssessmentData = new AssessmentDataBuilder()
            .with('testStepStatus', {
                ['assessment-1-step-1']: getDefaultTestStepData(),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .build();
        const initialState = getStateWithAssessment(initialAssessmentData);

        const payload: ScanCompletedPayload<any> = {
            selectorMap: {},
            scanResult: {} as ScanResults,
            testType: assessmentType,
            key: requirementKey,
            scanIncompleteWarnings: [],
        };

        const expectedInstanceMap = {};
        const stepMapStub = assessmentsProvider.getStepMap(assessmentType);
        const stepConfig: Readonly<Requirement> = {
            ...assessmentsProvider.getStep(assessmentType, 'assessment-1-step-1'),
            isManual: false,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('testStepStatus', {
                // should PASS because it is a non-manual test with no associated instances
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.PASS, true),
                // should stay unchanged because the event/payload is requirement-specific
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .with('scanIncompleteWarnings', [])
            .build();

        const finalState = getStateWithAssessment(assessmentData);

        assessmentsProviderMock
            .setup(provider => provider.all())
            .returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(provider => provider.getStepMap(assessmentType))
            .returns(() => stepMapStub);

        assessmentsProviderMock
            .setup(provider => provider.getStep(assessmentType, 'assessment-1-step-1'))
            .returns(() => stepConfig);

        assessmentsProviderMock
            .setup(provider => provider.forType(payload.testType))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock
            .setup(idGetter => idGetter(requirementKey))
            .returns(() => instanceIdentifierGeneratorStub);

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMap(
                    initialAssessmentData.generatedAssessmentInstancesMap,
                    payload.selectorMap,
                    requirementKey,
                    instanceIdentifierGeneratorStub,
                    stepConfig.getInstanceStatus,
                    stepConfig.isVisualizationSupportedForResult,
                ),
            )
            .returns(() => expectedInstanceMap);

        createStoreTesterForAssessmentActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanCompleted with a manual requirement uses getInitialManualTestStatus to set status', () => {
        const initialManualTestStepResult = {
            status: ManualTestStatus.UNKNOWN,
            id: requirementKey,
            instances: [
                {
                    id: '1',
                    description: 'aaa',
                },
            ],
        };
        const initialAssessmentData = new AssessmentDataBuilder()
            .with('testStepStatus', {
                ['assessment-1-step-1']: getDefaultTestStepData(),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .with('manualTestStepResultMap', {
                [requirementKey]: initialManualTestStepResult,
            })
            .build();
        const initialState = getStateWithAssessment(initialAssessmentData);

        const payload: ScanCompletedPayload<any> = {
            selectorMap: {},
            scanResult: {} as ScanResults,
            testType: assessmentType,
            key: requirementKey,
            scanIncompleteWarnings: [],
        };

        const fullInstanceMap: InstanceIdToInstanceDataMap = {
            '#selector-1': {
                target: ['#selector-1'],
                html: '<div id="selector-1" />',
                testStepResults: { 'assessment-1-step-1': { resultData: 'result data' } },
            },
            '#selector-2': {
                target: ['#selector-2'],
                html: '<div id="selector-2" />',
                testStepResults: { 'assessment-1-step-2': { resultData: 'result data' } },
            },
        };
        const instanceMapFilteredForTestStep1 = {
            '#selector-1': fullInstanceMap['#selector-1'],
        };

        const mockGetInitialManualTestStatus = Mock.ofInstance(
            (_: InstanceIdToInstanceDataMap) => ManualTestStatus.FAIL,
            MockBehavior.Strict,
        );
        mockGetInitialManualTestStatus
            .setup(m => m(instanceMapFilteredForTestStep1))
            .returns(() => ManualTestStatus.FAIL)
            .verifiable();

        const stepMapStub = assessmentsProvider.getStepMap(assessmentType);
        const stepConfig: Readonly<Requirement> = {
            ...assessmentsProvider.getStep(assessmentType, 'assessment-1-step-1'),
            isManual: true,
            getInitialManualTestStatus: mockGetInitialManualTestStatus.object,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', fullInstanceMap)
            .with('testStepStatus', {
                // should FAIL based on getInitialManualTestStatus
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.FAIL, true),
                // should stay unchanged because the event/payload is requirement-specific
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .with('scanIncompleteWarnings', [])
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    ...initialManualTestStepResult,
                    // should FAIL based on getInitialManualTestStatus
                    status: ManualTestStatus.FAIL,
                },
            })
            .build();

        const finalState = getStateWithAssessment(assessmentData);

        assessmentsProviderMock
            .setup(provider => provider.all())
            .returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(provider => provider.getStepMap(assessmentType))
            .returns(() => stepMapStub);

        assessmentsProviderMock
            .setup(provider => provider.getStep(assessmentType, 'assessment-1-step-1'))
            .returns(() => stepConfig);

        assessmentsProviderMock
            .setup(provider => provider.forType(payload.testType))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock
            .setup(idGetter => idGetter(requirementKey))
            .returns(() => instanceIdentifierGeneratorStub);

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMap(
                    initialAssessmentData.generatedAssessmentInstancesMap,
                    payload.selectorMap,
                    requirementKey,
                    instanceIdentifierGeneratorStub,
                    stepConfig.getInstanceStatus,
                    stepConfig.isVisualizationSupportedForResult,
                ),
            )
            .returns(() => fullInstanceMap);

        createStoreTesterForAssessmentActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);

        mockGetInitialManualTestStatus.verifyAll();
    });

    test('onScanCompleted with a manual requirement skips getInitialManualTestStatus for requirements that already have a status', () => {
        const initialManualTestStepResult = {
            status: ManualTestStatus.PASS,
            id: requirementKey,
            instances: [
                {
                    id: '1',
                    description: 'aaa',
                },
            ],
        };
        const initialAssessmentData = new AssessmentDataBuilder()
            .with('testStepStatus', {
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.PASS, true),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .with('manualTestStepResultMap', {
                [requirementKey]: initialManualTestStepResult,
            })
            .build();
        const initialState = getStateWithAssessment(initialAssessmentData);

        const payload: ScanCompletedPayload<any> = {
            selectorMap: {},
            scanResult: {} as ScanResults,
            testType: assessmentType,
            key: requirementKey,
            scanIncompleteWarnings: [],
        };

        const expectedInstanceMap = {};
        const stepMapStub = assessmentsProvider.getStepMap(assessmentType);
        const stepConfig: Readonly<Requirement> = {
            ...assessmentsProvider.getStep(assessmentType, 'assessment-1-step-1'),
            isManual: true,
            getInitialManualTestStatus: () => ManualTestStatus.FAIL,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('testStepStatus', {
                // should ignore getInitialManualTestStatus because the original state was not UNKNOWN
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.PASS, true),
                // should stay unchanged because the event/payload is requirement-specific
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .with('scanIncompleteWarnings', [])
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    ...initialManualTestStepResult,
                    // should ignore getInitialManualTestStatus because the original state was not UNKNOWN
                    status: ManualTestStatus.PASS,
                },
            })
            .build();

        const finalState = getStateWithAssessment(assessmentData);

        assessmentsProviderMock
            .setup(provider => provider.all())
            .returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(provider => provider.getStepMap(assessmentType))
            .returns(() => stepMapStub);

        assessmentsProviderMock
            .setup(provider => provider.getStep(assessmentType, 'assessment-1-step-1'))
            .returns(() => stepConfig);

        assessmentsProviderMock
            .setup(provider => provider.forType(payload.testType))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock
            .setup(idGetter => idGetter(requirementKey))
            .returns(() => instanceIdentifierGeneratorStub);

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMap(
                    initialAssessmentData.generatedAssessmentInstancesMap,
                    payload.selectorMap,
                    requirementKey,
                    instanceIdentifierGeneratorStub,
                    stepConfig.getInstanceStatus,
                    stepConfig.isVisualizationSupportedForResult,
                ),
            )
            .returns(() => expectedInstanceMap);

        createStoreTesterForAssessmentActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanUpdate', () => {
        const initialAssessmentData = new AssessmentDataBuilder()
            .with('testStepStatus', {
                ['assessment-1-step-1']: getDefaultTestStepData(),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .build();
        const initialState = getStateWithAssessment(initialAssessmentData);

        const payload: ScanUpdatePayload = {
            testType: assessmentType,
            key: requirementKey,
            results: {} as TabStopEvent[],
        };

        const expectedInstanceMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('testStepStatus', {
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.PASS, false),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .build();

        const finalState = getStateWithAssessment(assessmentData);

        assessmentsProviderMock
            .setup(provider => provider.all())
            .returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(provider => provider.getStepMap(assessmentType))
            .returns(() => assessmentsProvider.getStepMap(assessmentType));

        assessmentsProviderMock
            .setup(provider => provider.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentsProviderMock
            .setup(provider => provider.forType(payload.testType))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock
            .setup(getter => getter(requirementKey))
            .returns(() => instanceIdentifierGeneratorStub);

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMapForEvents(
                    initialAssessmentData.generatedAssessmentInstancesMap,
                    payload.results,
                    requirementKey,
                    instanceIdentifierGeneratorStub,
                ),
            )
            .returns(() => expectedInstanceMap);

        createStoreTesterForAssessmentActions('scanUpdate')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onTrackingCompleted', () => {
        const instanceKey = 'instance-1';
        const initialInstanceMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            [instanceKey]: {
                testStepResults: {
                    [requirementKey]: {
                        status: 2,
                    } as TestStepResult,
                },
            } as GeneratedAssessmentInstance,
        };
        const initialAssessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', initialInstanceMap)
            .build();
        const finalAssessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', {})
            .build();
        const payload: ScanBasePayload = {
            testType: assessmentType,
            key: requirementKey,
        };

        const initialState = getStateWithAssessment(initialAssessmentData);
        const finalState = getStateWithAssessment(finalAssessmentData);

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.testType))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        assessmentDataRemoverMock
            .setup(a => a.deleteDataFromGeneratedMapWithStepKey(initialInstanceMap, payload.key))
            .callback(() => {
                delete initialInstanceMap[instanceKey];
            });

        createStoreTesterForAssessmentActions('trackingCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on selectTestStep', () => {
        const visualizationType = 1 as VisualizationType;
        const requirement = 'test-step';
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();
        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestType(visualizationType)
            .withSelectedTestSubview(requirement)
            .build();

        const payload: SelectTestSubviewPayload = {
            selectedTestSubview: requirement,
            selectedTest: visualizationType,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        createStoreTesterForAssessmentActions('selectTestSubview')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on expandTestNav', () => {
        const visualizationType = 1 as VisualizationType;
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();
        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withExpandedTest(visualizationType)
            .build();

        const payload: ExpandTestNavPayload = {
            selectedTest: visualizationType,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        createStoreTesterForAssessmentActions('expandTestNav')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on collapseTestNav', () => {
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();
        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withExpandedTest(null)
            .build();

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        createStoreTesterForAssessmentActions('collapseTestNav').testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('onUpdateTargetTabId', () => {
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab: Tab = {
            id: tabId,
            url,
            title,
        };
        let onReject;
        browserMock
            .setup(b => b.getTab(tabId, It.isAny(), It.isAny()))
            .returns((id, cb, reject) => {
                onReject = reject;
                cb(tab);
            })
            .verifiable();
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();
        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title, false)
            .build();

        createStoreTesterForAssessmentActions('updateTargetTabId')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
        expect(() => onReject()).toThrowErrorMatchingSnapshot();
    });

    test('onUpdateTargetTabId: tab is null', () => {
        const tabId = 1000;
        const tab: Tab = null;
        browserMock
            .setup(b => b.getTab(tabId, It.isAny()))
            .returns((id, cb) => cb(tab))
            .verifiable();
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();
        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();

        createStoreTesterForAssessmentActions('updateTargetTabId')
            .withActionParam(tabId)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    test('on changeInstanceStatus, test step status updated', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [requirementKey]: {
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap)
            .with('testStepStatus', {
                [requirementKey]: getDefaultTestStepData(),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceStatusPayload = {
            test: assessmentType,
            requirement: requirementKey,
            selector: 'selector',
            status: ManualTestStatus.PASS,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstanceMap = cloneDeep(generatedAssessmentInstancesMap);
        expectedInstanceMap.selector.testStepResults[requirementKey] = {
            status: ManualTestStatus.PASS,
            originalStatus: ManualTestStatus.UNKNOWN,
        };

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.PASS, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeInstanceStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeStepStatus: user marked as pass', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [
                        {
                            id: '1',
                            description: 'aaa',
                        },
                    ],
                },
            })
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeRequirementStatusPayload = {
            test: assessmentType,
            requirement: requirementKey,
            status: ManualTestStatus.PASS,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.PASS,
                    id: requirementKey,
                    instances: [],
                },
            })
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.PASS, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeRequirementStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeStepStatus: user marked as fail', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.PASS,
                    id: requirementKey,
                    instances: [],
                },
            })
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeRequirementStatusPayload = {
            test: assessmentType,
            requirement: requirementKey,
            status: ManualTestStatus.FAIL,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);
        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [],
                },
            })
            .with('testStepStatus', {
                [requirementKey]: getDefaultTestStepData(),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeRequirementStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test.each`
        supportsVisualization | startsEnabled | payloadEnabled | expectedFinalEnabled
        ${false}              | ${false}      | ${true}        | ${false}
        ${true}               | ${false}      | ${true}        | ${true}
        ${true}               | ${true}       | ${false}       | ${false}
        ${true}               | ${true}       | ${true}        | ${true}
        ${true}               | ${false}      | ${false}       | ${false}
    `(
        'on changeAssessmentVisualizationState: supportsVisualization:$supportsVisualization, ' +
            'startsEnabled:$startsEnabled, payloadEnabled:$payloadEnabled -> finalEnabled:$expectedFinalEnabled',
        ({ supportsVisualization, startsEnabled, payloadEnabled, expectedFinalEnabled }) => {
            const generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance> =
                {
                    selector: {
                        testStepResults: {
                            [requirementKey]: {
                                isVisualizationEnabled: startsEnabled,
                                isVisualizationSupported: supportsVisualization,
                            },
                        },
                    } as any,
                };

            const assessmentData = new AssessmentDataBuilder()
                .with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap)
                .build();

            const initialState = getStateWithAssessment(assessmentData);

            const payload: ChangeInstanceSelectionPayload = {
                test: assessmentType,
                requirement: requirementKey,
                isVisualizationEnabled: payloadEnabled,
                selector: 'selector',
            };

            assessmentsProviderMock
                .setup(apm => apm.forType(payload.test))
                .returns(() => assessmentMock.object);

            assessmentMock
                .setup(am => am.getVisualizationConfiguration())
                .returns(() => configStub);

            const expectedInstancesMap = cloneDeep(generatedAssessmentInstancesMap);
            expectedInstancesMap.selector.testStepResults[requirementKey].isVisualizationEnabled =
                expectedFinalEnabled;

            const expectedAssessment = new AssessmentDataBuilder()
                .with('generatedAssessmentInstancesMap', expectedInstancesMap)
                .build();

            const finalState = getStateWithAssessment(expectedAssessment);

            createStoreTesterForAssessmentActions('changeAssessmentVisualizationState')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, finalState);
        },
    );

    test('changeAssessmentVisualizationStateForAll enables all visualizations that support it', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector1: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: true,
                        isVisualizationSupported: true,
                    },
                },
            } as any,
            selector2: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                        isVisualizationSupported: false,
                    },
                },
            } as any,
            selector3: {
                testStepResults: {},
            } as any,
            selector4: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                        isVisualizationSupported: true,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', cloneDeep(generatedAssessmentInstancesMap))
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceSelectionPayload = {
            test: assessmentType,
            requirement: requirementKey,
            isVisualizationEnabled: true,
            selector: null,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = cloneDeep(generatedAssessmentInstancesMap);

        // Selector 1 shouldn't change because it's already enabled
        // Selector 2 shouldn't change because it doesn't support visualizations
        // Selector 3 shouldn't change because it has no test step results
        // Selector 4 should toggle from disabled to enabled:
        expectedInstancesMap.selector4.testStepResults[requirementKey].isVisualizationEnabled =
            true;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeAssessmentVisualizationStateForAll')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoInstanceStatusChange', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [requirementKey]: {
                        status: ManualTestStatus.UNKNOWN,
                        originalStatus: ManualTestStatus.FAIL,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', cloneDeep(generatedAssessmentInstancesMap))
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.UNKNOWN, false),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ToggleActionPayload = {
            test: assessmentType,
            requirement: requirementKey,
            selector: 'selector',
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector.testStepResults[requirementKey].status =
            ManualTestStatus.FAIL;
        expectedInstancesMap.selector.testStepResults[requirementKey].originalStatus = null;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('undoInstanceStatusChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoStepStatusChange', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.PASS,
                    id: requirementKey,
                    instances: [
                        {
                            id: 'id',
                            description: 'comment',
                        },
                    ],
                },
            })
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeRequirementStatusPayload = {
            test: assessmentType,
            requirement: requirementKey,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.UNKNOWN,
                    id: requirementKey,
                    instances: [],
                },
            })
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('undoRequirementStatusChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeInstanceStatus: update test step status, do not go through all instances', () => {
        const selector = 'test-selector';
        const generatedAssessmentInstancesMap = {
            [selector]: {
                testStepResults: {
                    [requirementKey]: {
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', cloneDeep(generatedAssessmentInstancesMap))
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceStatusPayload = {
            test: assessmentType,
            requirement: requirementKey,
            selector,
            status: ManualTestStatus.FAIL,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap[selector].testStepResults[requirementKey].originalStatus =
            ManualTestStatus.UNKNOWN;
        expectedInstancesMap[selector].testStepResults[requirementKey].status =
            ManualTestStatus.FAIL;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeInstanceStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addFailureInstance', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [],
                },
            })
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: AddFailureInstancePayload = {
            test: assessmentType,
            requirement: requirementKey,
            instanceData: {
                failureDescription: 'description',
                path: 'path',
                snippet: 'snippet',
            },
        };

        const failureInstance = {
            id: '1',
            description: 'description',
            selector: 'path',
            html: 'snippet',
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        assessmentDataConverterMock
            .setup(a =>
                a.generateFailureInstance(
                    payload.instanceData.failureDescription,
                    payload.instanceData.path,
                    payload.instanceData.snippet,
                ),
            )
            .returns(description => failureInstance);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [failureInstance],
                },
            })
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('addFailureInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on removeFailureInstance', () => {
        const failureInstance = {
            id: '1',
            description: 'description',
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [failureInstance],
                },
            })
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: RemoveFailureInstancePayload = {
            test: assessmentType,
            requirement: requirementKey,
            id: '1',
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [],
                },
            })
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('removeFailureInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on editFailureInstance', () => {
        const oldDescription = 'old';
        const newDescription = 'new';
        const oldPath = 'old path';
        const newPath = 'new path';
        const oldSnippet = 'old snippet';
        const newSnippet = 'new snippet';
        const failureInstance = {
            id: '1',
            description: oldDescription,
            selector: oldPath,
            html: oldSnippet,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [failureInstance],
                },
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: EditFailureInstancePayload = {
            test: assessmentType,
            requirement: requirementKey,
            id: '1',
            instanceData: {
                failureDescription: newDescription,
                path: newPath,
                snippet: newSnippet,
            },
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [
                        {
                            id: '1',
                            description: newDescription,
                            selector: newPath,
                            html: newSnippet,
                        },
                    ],
                },
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('editFailureInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on passUnmarkedInstance', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector1: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: true,
                        status: ManualTestStatus.PASS,
                        originalStatus: ManualTestStatus.FAIL,
                    },
                },
                target: [],
                html: '',
            } as GeneratedAssessmentInstance,
            selector2: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
                target: [],
                html: '',
            } as GeneratedAssessmentInstance,
            selector3: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.FAIL,
                    },
                },
                target: [],
                html: '',
            } as GeneratedAssessmentInstance,
            selector4: {
                testStepResults: {
                    ['someOtherKey']: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.FAIL,
                    },
                },
                target: [],
                html: '',
            } as GeneratedAssessmentInstance,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap)
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ToggleActionPayload = {
            test: assessmentType,
            requirement: requirementKey,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(payload.test))
            .returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', {
                selector1: {
                    testStepResults: {
                        [requirementKey]: {
                            isVisualizationEnabled: true,
                            status: ManualTestStatus.PASS,
                            originalStatus: ManualTestStatus.FAIL,
                        },
                    },
                    target: [],
                    html: '',
                } as GeneratedAssessmentInstance,
                selector2: {
                    testStepResults: {
                        [requirementKey]: {
                            isVisualizationEnabled: false,
                            status: ManualTestStatus.PASS,
                            originalStatus: ManualTestStatus.UNKNOWN,
                        },
                    },
                    target: [],
                    html: '',
                } as GeneratedAssessmentInstance,
                selector3: {
                    testStepResults: {
                        [requirementKey]: {
                            isVisualizationEnabled: false,
                            status: ManualTestStatus.FAIL,
                        },
                    },
                    target: [],
                    html: '',
                } as GeneratedAssessmentInstance,
                selector4: {
                    testStepResults: {
                        ['someOtherKey']: {
                            isVisualizationEnabled: false,
                            status: ManualTestStatus.FAIL,
                        },
                    },
                    target: [],
                    html: '',
                } as GeneratedAssessmentInstance,
            })
            .with('testStepStatus', {
                [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('passUnmarkedInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivotChild, full payload', () => {
        const testType = assessmentType;
        const payload: UpdateSelectedDetailsViewPayload = {
            detailsViewType: testType,
            pivotType: DetailsViewPivotType.assessment,
        };

        assessmentsProviderMock
            .setup(apm => apm.forType(testType))
            .returns(() => assessmentsProvider.forType(testType));

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview('step')
            .withSelectedTestType(VisualizationType.Color)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview(requirementKey)
            .withSelectedTestType(testType)
            .build();

        createStoreTesterForAssessmentActions('updateSelectedPivotChild')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivotChild: details view type is null', () => {
        const selectedTest = VisualizationType.Color;
        const testType = null;
        const payload: UpdateSelectedDetailsViewPayload = {
            detailsViewType: testType,
            pivotType: DetailsViewPivotType.assessment,
        };

        assessmentsProviderMock.setup(apm => apm.forType(testType)).verifiable(Times.never());

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview('step')
            .withSelectedTestType(selectedTest)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview('step')
            .withSelectedTestType(selectedTest)
            .build();

        createStoreTesterForAssessmentActions('updateSelectedPivotChild')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
        assessmentsProviderMock.verifyAll();
    });

    test('on updateSelectedPivotChild: when selected pivot is not assessment', () => {
        const payload: UpdateSelectedDetailsViewPayload = {
            detailsViewType: assessmentType,
            pivotType: DetailsViewPivotType.fastPass,
        };

        assessmentsProviderMock.setup(apm => apm.forType(assessmentType)).verifiable(Times.never());

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview('step')
            .withSelectedTestType(VisualizationType.Color)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview('step')
            .withSelectedTestType(VisualizationType.Color)
            .build();

        createStoreTesterForAssessmentActions('updateSelectedPivotChild')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
        assessmentsProviderMock.verifyAll();
    });

    test('verify the ManualTestStatus Priorities', () => {
        expect(ManualTestStatus.PASS < ManualTestStatus.UNKNOWN).toBeTruthy();
        expect(ManualTestStatus.UNKNOWN < ManualTestStatus.FAIL).toBeTruthy();
    });

    test('onAddResultDescription', () => {
        const payload: AddResultDescriptionPayload = {
            description: 'new-test-description',
        };

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .with('resultDescription', payload.description)
            .build();

        createStoreTesterForAssessmentActions('addResultDescription')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    function setupDataGeneratorMock(
        persistedData: AssessmentStoreData,
        initialData: AssessmentStoreData,
    ): void {
        initialAssessmentStoreDataGeneratorMock
            .setup(im => im.generateInitialState(persistedData))
            .returns(() => initialData)
            .verifiable(Times.once());
    }

    function getSampleTestStepsData(): ManualTestStatusData {
        const defaultData = {
            ['assessment-1-step-1']: getDefaultTestStepData(),
            ['assessment-1-step-2']: getDefaultTestStepData(),
            ['assessment-1-step-3']: getDefaultTestStepData(),
        };

        return defaultData;
    }

    function getDefaultTestStepData(): TestStepData {
        return {
            stepFinalResult: ManualTestStatus.UNKNOWN,
            isStepScanned: false,
        };
    }

    function getDefaultManualTestStepResult(stepName: string): ManualTestStepResult {
        return {
            status: ManualTestStatus.UNKNOWN,
            id: stepName,
            instances: [],
        };
    }

    function generateTestStepData(
        stepFinalResult: ManualTestStatus,
        isStepScanned: boolean,
    ): TestStepData {
        return {
            stepFinalResult,
            isStepScanned,
        };
    }

    function getDefaultState(): AssessmentStoreData {
        return new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();
    }

    function getDefaultStateWithDefaultAssessmentData(
        assessment: string,
        selectedRequirement: string,
    ): AssessmentStoreData {
        return new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withAssessment(assessmentKey, {
                fullAxeResultsMap: null,
                generatedAssessmentInstancesMap: null,
                manualTestStepResultMap: {},
                testStepStatus: {},
            })
            .withSelectedTestSubview(selectedRequirement)
            .build();
    }

    function getStateWithAssessment(data: AssessmentData): AssessmentStoreData {
        return new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withAssessment(assessmentKey, data)
            .build();
    }

    function createStoreTesterForAssessmentActions(
        actionName: keyof AssessmentActions,
    ): AssessmentStoreTester<AssessmentStoreData, AssessmentActions> {
        const factory = (actions: AssessmentActions) =>
            new AssessmentStore(
                browserMock.object,
                actions,
                assessmentDataConverterMock.object,
                assessmentDataRemoverMock.object,
                assessmentsProviderMock.object,
                indexDBInstanceMock.object,
                null,
                initialAssessmentStoreDataGeneratorMock.object,
                failTestOnErrorLogger,
            );
        return new AssessmentStoreTester(
            AssessmentActions,
            actionName,
            factory,
            indexDBInstanceMock,
        );
    }
});
