// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProvider } from '../../../../../assessments/assessments-provider';
import { Assessment } from '../../../../../assessments/types/iassessment';
import { IAssessmentsProvider } from '../../../../../assessments/types/iassessments-provider';
import {
    AddFailureInstancePayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    RemoveFailureInstancePayload,
    SelectRequirementPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateVisibilityPayload,
} from '../../../../../background/actions/action-payloads';
import { AssessmentActions } from '../../../../../background/actions/assessment-actions';
import { AssessmentDataConverter } from '../../../../../background/assessment-data-converter';
import { AssessmentDataRemover } from '../../../../../background/assessment-data-remover';
import { ChromeAdapter } from '../../../../../background/browser-adapter';
import { AssessmentStore } from '../../../../../background/stores/assessment-store';
import { AssesssmentVisualizationConfiguration } from '../../../../../common/configs/visualization-configuration-factory';
import { IndexedDBAPI } from '../../../../../common/indexedDB/indexedDB';
import { Tab } from '../../../../../common/itab';
import { StoreNames } from '../../../../../common/stores/store-names';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { ManualTestStatus, ManualTestStatusData, TestStepData } from '../../../../../common/types/manual-test-status';
import {
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    ITestStepResult,
    PersistedTabInfo,
} from '../../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { ScanBasePayload, ScanCompletedPayload, ScanUpdatePayload } from '../../../../../injected/analyzers/analyzer';
import { ITabStopEvent } from '../../../../../injected/tab-stops-listener';
import { ScanResults } from '../../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { AssessmentDataBuilder } from '../../../common/assessment-data-builder';
import { AssessmentsStoreDataBuilder } from '../../../common/assessment-store-data-builder';
import { AssessmentStoreTester } from '../../../common/assessment-store-tester';
import { createStoreWithNullParams } from '../../../common/store-tester';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

let browserMock: IMock<ChromeAdapter>;
let assessmentDataConverterMock: IMock<AssessmentDataConverter>;
let assessmentDataRemoverMock: IMock<AssessmentDataRemover>;
let assessmentsProvider: IAssessmentsProvider;
let assessmentsProviderMock: IMock<IAssessmentsProvider>;
let indexDBInstanceMock: IMock<IndexedDBAPI>;
let assessmentMock: IMock<Assessment>;
let getInstanceIdentiferGeneratorMock: IMock<(step: string) => Function>;
let configStub: AssesssmentVisualizationConfiguration;
let instanceIdentifierGeneratorStub: (instances) => string;

const assessmentKey: string = 'assessment-1';
const requirementKey: string = 'assessment-1-step-1';
const assessmentType = -1 as VisualizationType;

describe('AssessmentStoreTest', () => {
    beforeEach(() => {
        instanceIdentifierGeneratorStub = () => null;
        browserMock = Mock.ofType(ChromeAdapter);
        assessmentDataConverterMock = Mock.ofType(AssessmentDataConverter);
        assessmentDataRemoverMock = Mock.ofType(AssessmentDataRemover);
        getInstanceIdentiferGeneratorMock = Mock.ofInstance(step => null);
        configStub = {
            getAssessmentData: data => data.assessments[assessmentKey],
            getInstanceIdentiferGenerator: getInstanceIdentiferGeneratorMock.object,
        } as AssesssmentVisualizationConfiguration;

        assessmentsProvider = CreateTestAssessmentProvider();
        assessmentsProviderMock = Mock.ofType(AssessmentsProvider, MockBehavior.Strict);
        assessmentMock = Mock.ofInstance({
            getVisualizationConfiguration: () => {
                return null;
            },
        } as Assessment);
        assessmentDataConverterMock
            .setup(adcm => adcm.getNewManualTestStepResult(It.isAny()))
            .returns(step => getDefaultManualTestStepResult(step));

        indexDBInstanceMock = Mock.ofInstance(
            {
                setItem: (key, value) => null,
                getItem: key => null,
            } as IndexedDBAPI,
            MockBehavior.Strict,
        );
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
        assessmentsProviderMock
            .setup(ap => ap.all())
            .returns(() => [])
            .verifiable(Times.once());
        const testObject = new AssessmentStore(
            null,
            null,
            assessmentDataConverterMock.object,
            assessmentDataRemoverMock.object,
            assessmentsProviderMock.object,
            null,
            null,
        );

        const actualState = testObject.getDefaultState();

        const expectedState: Partial<IAssessmentStoreData> = {
            persistedTabInfo: null,
            assessments: {},
            assessmentNavState: {
                selectedTestType: null,
                selectedTestStep: null,
            },
        };

        expect(actualState).toEqual(expectedState);
        assessmentsProviderMock.verifyAll();
    });

    test('getDefaultState with persistedData', () => {
        const targetTab: PersistedTabInfo = { id: 1, url: 'url', title: 'title', appRefreshed: true };
        const expectedTestType = -1 as VisualizationType;
        const expectedTestStep: string = 'assessment-1-step-1';
        const assessmentProvider = CreateTestAssessmentProvider();
        const assessments = assessmentProvider.all();

        const persisted: IAssessmentStoreData = {
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
                selectedTestStep: expectedTestStep,
            },
        };

        const testObject = new AssessmentStore(
            null,
            null,
            assessmentDataConverterMock.object,
            assessmentDataRemoverMock.object,
            assessmentProvider,
            null,
            persisted,
        );
        const actualState = testObject.getDefaultState();

        const defaultValues: Partial<IAssessmentData> = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: null,
            manualTestStepResultMap: null,
        };

        const expectedState: IAssessmentStoreData = {
            persistedTabInfo: targetTab,
            assessments: {},
            assessmentNavState: {
                selectedTestType: expectedTestType,
                selectedTestStep: expectedTestStep,
            },
        };

        assessments.forEach(assessment => {
            expectedState.assessments[assessment.key] = {
                ...defaultValues,
                manualTestStepResultMap: {},
                testStepStatus: {},
            } as IAssessmentData;

            assessment.steps.forEach(step => {
                const assessmentData = expectedState.assessments[assessment.key];
                assessmentData.testStepStatus[step.key] = getDefaultTestStepData();
                assessmentData.manualTestStepResultMap[step.key] = getDefaultManualTestStepResult(step.key);
            });
        });

        expectedState.assessments['assessment-1'].manualTestStepResultMap[expectedTestStep].status = 2;

        expect(actualState).toEqual(expectedState);
    });

    test('getDefaultState with 2 assessments', () => {
        const expectedTestType = -1 as VisualizationType;
        const expectedTestStep: string = 'assessment-1-step-1';

        const assessmentProvider = CreateTestAssessmentProvider();
        const assessments = assessmentProvider.all();

        const testObject = new AssessmentStore(
            null,
            null,
            assessmentDataConverterMock.object,
            assessmentDataRemoverMock.object,
            assessmentProvider,
            null,
            null,
        );
        const actualState = testObject.getDefaultState();

        const defaultValues: Partial<IAssessmentData> = {
            fullAxeResultsMap: null,
            generatedAssessmentInstancesMap: null,
            manualTestStepResultMap: null,
        };

        const expectedState: IAssessmentStoreData = {
            persistedTabInfo: null,
            assessments: {},
            assessmentNavState: {
                selectedTestType: expectedTestType,
                selectedTestStep: expectedTestStep,
            },
        };

        assessments.forEach(assessment => {
            expectedState.assessments[assessment.key] = {
                ...defaultValues,
                manualTestStepResultMap: {},
                testStepStatus: {},
            } as IAssessmentData;

            assessment.steps.forEach(step => {
                const assessmentData = expectedState.assessments[assessment.key];
                assessmentData.testStepStatus[step.key] = getDefaultTestStepData();
                assessmentData.manualTestStepResultMap[step.key] = getDefaultManualTestStepResult(step.key);
            });
        });

        expect(expectedState).toEqual(actualState);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreTesterForAssessmentActions('getCurrentState').testListenerToBeCalledOnce(initialState, finalState);
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

        const finalState = getDefaultState();
        const getVisualizationConfigurationMock = Mock.ofInstance(() => {});
        const visualizationConfigStub = {
            getAssessmentData: state => {
                return state.assessments[assessmentKey];
            },
        } as AssesssmentVisualizationConfiguration;

        getVisualizationConfigurationMock
            .setup(gvcm => gvcm())
            .returns(() => {
                return visualizationConfigStub;
            });

        const assessmentStub = {
            getVisualizationConfiguration: getVisualizationConfigurationMock.object,
            key: assessmentKey,
            steps: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock.setup(apm => apm.forType(assessmentType)).returns(() => assessmentStub);

        const payload: ToggleActionPayload = {
            test: assessmentType,
        };

        createStoreTesterForAssessmentActions('resetData')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
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

        const finalState = getDefaultState();
        const getVisualizationConfigurationMock = Mock.ofInstance(() => {});
        const visualizationConfigStub = {
            getAssessmentData: state => {
                return state.assessments[assessmentKey];
            },
        } as AssesssmentVisualizationConfiguration;

        getVisualizationConfigurationMock
            .setup(gvcm => gvcm())
            .returns(() => {
                return visualizationConfigStub;
            });

        const assessmentStub = {
            getVisualizationConfiguration: getVisualizationConfigurationMock.object,
            key: assessmentKey,
            steps: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock.setup(apm => apm.forType(assessmentType)).returns(() => assessmentStub);

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

        const finalState = getDefaultState();
        const getVisualizationConfigurationMock = Mock.ofInstance(() => {});
        const visualizationConfigStub = {
            getAssessmentData: state => {
                return state.assessments[assessmentKey];
            },
        } as AssesssmentVisualizationConfiguration;

        getVisualizationConfigurationMock
            .setup(gvcm => gvcm())
            .returns(() => {
                return visualizationConfigStub;
            });

        const assessmentStub = {
            getVisualizationConfiguration: getVisualizationConfigurationMock.object,
            key: assessmentKey,
            steps: [
                {
                    key: requirementKey,
                },
            ],
        } as Assessment;

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock.setup(apm => apm.forType(assessmentType)).returns(() => assessmentStub);

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
        browserMock
            .setup(b => b.getTab(tabId, It.isAny()))
            .returns((id, cb) => cb(tab))
            .verifiable();
        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestType(VisualizationType.Color)
            .withTargetTab(oldTabId, null, null, true)
            .build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withTargetTab(tabId, url, title, false)
            .build();

        createStoreTesterForAssessmentActions('resetAllAssessmentsData')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
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
        browserMock
            .setup(b => b.getTab(tabId, It.isAny()))
            .returns((id, cb) => cb(tab))
            .verifiable();
        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withTargetTab(oldTabId, null, null, true)
            .build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withTargetTab(tabId, url, title, false)
            .build();

        createStoreTesterForAssessmentActions('resetAllAssessmentsData')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanCompleted', () => {
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();

        const payload: ScanCompletedPayload<any> = {
            selectorMap: {},
            scanResult: {} as ScanResults,
            testType: assessmentType,
            key: requirementKey,
        };

        const expectedInstanceMap = {};
        const expectedManualTestStepResultMap = {
            'assessment-1-step-1': { status: 1, id: 'assessment-1-step-1', instances: [] },
            'assessment-1-step-2': { status: 1, id: 'assessment-1-step-2', instances: [] },
            'assessment-1-step-3': { status: 1, id: 'assessment-1-step-3', instances: [] },
        };
        const stepMapStub = assessmentsProvider.getStepMap(assessmentType);
        const initialManualTestStepResultMap = initialState.assessments[assessmentKey].manualTestStepResultMap;
        const stepConfig = assessmentsProvider.getStep(assessmentType, 'assessment-1-step-1');

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', expectedManualTestStepResultMap)
            .with('testStepStatus', {
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.PASS, true),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .build();

        const finalState = getStateWithAssessment(assessmentData);

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock.setup(apm => apm.getStepMap(assessmentType)).returns(() => stepMapStub);

        assessmentsProviderMock.setup(apm => apm.getStep(assessmentType, 'assessment-1-step-1')).returns(() => stepConfig);

        assessmentsProviderMock.setup(apm => apm.forType(payload.testType)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock.setup(giim => giim(requirementKey)).returns(() => instanceIdentifierGeneratorStub);

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMap(null, payload.selectorMap, requirementKey, instanceIdentifierGeneratorStub, It.isAny()),
            )
            .returns(() => expectedInstanceMap);

        createStoreTesterForAssessmentActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanUpdate', () => {
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();

        const payload: ScanUpdatePayload = {
            testType: assessmentType,
            key: requirementKey,
            results: {} as ITabStopEvent[],
        };

        const expectedInstanceMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', initialState.assessments[assessmentKey].manualTestStepResultMap)
            .with('testStepStatus', {
                ['assessment-1-step-1']: generateTestStepData(ManualTestStatus.PASS, false),
                ['assessment-1-step-2']: getDefaultTestStepData(),
                ['assessment-1-step-3']: getDefaultTestStepData(),
            })
            .build();

        const finalState = getStateWithAssessment(assessmentData);

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock.setup(apm => apm.getStepMap(assessmentType)).returns(() => assessmentsProvider.getStepMap(assessmentType));

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentsProviderMock.setup(apm => apm.forType(payload.testType)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock.setup(giim => giim(requirementKey)).returns(() => instanceIdentifierGeneratorStub);

        const currentInstancesMap = null;

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMapForEvents(
                    currentInstancesMap,
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
        const initialInstanceMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
            [instanceKey]: {
                testStepResults: {
                    [requirementKey]: {
                        status: 2,
                    } as ITestStepResult,
                },
            } as IGeneratedAssessmentInstance,
        };
        const initialAssessmentData = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', initialInstanceMap).build();
        const finalAssessmentData = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', {}).build();
        const payload: ScanBasePayload = {
            testType: assessmentType,
            key: requirementKey,
        };

        const initialState = getStateWithAssessment(initialAssessmentData);
        const finalState = getStateWithAssessment(finalAssessmentData);

        assessmentsProviderMock.setup(apm => apm.forType(payload.testType)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const currentInstancesMap = null;

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
        const type = 1 as VisualizationType;
        const requirement = 'test-step';
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestType(type)
            .withSelectedTestStep(requirement)
            .build();

        const payload: SelectRequirementPayload = {
            selectedRequirement: requirement,
            selectedTest: type,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        createStoreTesterForAssessmentActions('selectRequirement')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
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
        browserMock
            .setup(b => b.getTab(tabId, It.isAny()))
            .returns((id, cb) => cb(tab))
            .verifiable();
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withTargetTab(tabId, url, title, false)
            .build();

        createStoreTesterForAssessmentActions('updateTargetTabId')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onUpdateTargetTabId: tab is null', () => {
        const tabId = 1000;
        const tab: Tab = null;
        browserMock
            .setup(b => b.getTab(tabId, It.isAny()))
            .returns((id, cb) => cb(tab))
            .verifiable();
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();

        createStoreTesterForAssessmentActions('updateTargetTabId')
            .withActionParam(tabId)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    test('on changeInstanceStatus, test step status updated', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
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

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstanceMap = _.cloneDeep(generatedAssessmentInstancesMap);
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

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

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

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

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

    test('on changeAssessmentVisualizationState', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: true,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap).build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceSelectionPayload = {
            test: assessmentType,
            requirement: requirementKey,
            isVisualizationEnabled: true,
            selector: 'selector',
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector.testStepResults[requirementKey].isVisualizationEnabled = true;

        const expectedAssessment = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', expectedInstancesMap).build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeAssessmentVisualizationState')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateInstanceVisibility', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: true,
                        isVisible: true,
                    },
                    ['assessment-1-step-2']: {
                        isVisualizationEnabled: true,
                        isVisible: true,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', _.cloneDeep(generatedAssessmentInstancesMap))
            .build();

        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withAssessment(assessmentKey, assessmentData)
            .withSelectedTestStep(requirementKey)
            .build();

        const payload: UpdateVisibilityPayload = {
            payloadBatch: [
                {
                    test: assessmentType,
                    selector: 'selector',
                    isVisible: false,
                },
            ],
        };

        assessmentsProviderMock.setup(apm => apm.forType(assessmentType)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector.testStepResults[requirementKey].isVisible = false;

        const expectedAssessment = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', expectedInstancesMap).build();

        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withAssessment(assessmentKey, expectedAssessment)
            .withSelectedTestStep(requirementKey)
            .build();

        createStoreTesterForAssessmentActions('updateInstanceVisibility')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeAssessmentVisualizationStateForAll', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector1: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: true,
                    },
                },
            } as any,
            selector2: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                    },
                },
            } as any,
            selector3: {
                testStepResults: {},
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', _.cloneDeep(generatedAssessmentInstancesMap))
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceSelectionPayload = {
            test: assessmentType,
            requirement: requirementKey,
            isVisualizationEnabled: true,
            selector: null,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector2.testStepResults[requirementKey].isVisualizationEnabled = true;

        const expectedAssessment = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', expectedInstancesMap).build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeAssessmentVisualizationStateForAll')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoInstanceStatusChange', () => {
        const generatedAssessmentInstancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
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
            .with('generatedAssessmentInstancesMap', _.cloneDeep(generatedAssessmentInstancesMap))
            .with('testStepStatus', { [requirementKey]: generateTestStepData(ManualTestStatus.UNKNOWN, false) })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ToggleActionPayload = {
            test: assessmentType,
            requirement: requirementKey,
            selector: 'selector',
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector.testStepResults[requirementKey].status = ManualTestStatus.FAIL;
        expectedInstancesMap.selector.testStepResults[requirementKey].originalStatus = null;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .with('testStepStatus', { [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
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

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

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
            .with('generatedAssessmentInstancesMap', _.cloneDeep(generatedAssessmentInstancesMap))
            .with('testStepStatus', { [requirementKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceStatusPayload = {
            test: assessmentType,
            requirement: requirementKey,
            selector,
            status: ManualTestStatus.FAIL,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, requirementKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, requirementKey));

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap[selector].testStepResults[requirementKey].originalStatus = ManualTestStatus.UNKNOWN;
        expectedInstancesMap[selector].testStepResults[requirementKey].status = ManualTestStatus.FAIL;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .with('testStepStatus', { [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
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
            description: 'description',
        };

        const failureInstance = {
            id: '1',
            description: 'description',
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        assessmentDataConverterMock.setup(a => a.generateFailureInstance(payload.description)).returns(description => failureInstance);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [requirementKey]: {
                    status: ManualTestStatus.FAIL,
                    id: requirementKey,
                    instances: [failureInstance],
                },
            })
            .with('testStepStatus', { [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
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

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

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
        const failureInstance = {
            id: '1',
            description: oldDescription,
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
            description: newDescription,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

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
        const generatedAssessmentInstancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
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
            } as IGeneratedAssessmentInstance,
            selector2: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
                target: [],
                html: '',
            } as IGeneratedAssessmentInstance,
            selector3: {
                testStepResults: {
                    [requirementKey]: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.FAIL,
                    },
                },
                target: [],
                html: '',
            } as IGeneratedAssessmentInstance,
            selector4: {
                testStepResults: {
                    ['someOtherKey']: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.FAIL,
                    },
                },
                target: [],
                html: '',
            } as IGeneratedAssessmentInstance,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap)
            .with('testStepStatus', { [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ToggleActionPayload = {
            test: assessmentType,
            requirement: requirementKey,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

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
                } as IGeneratedAssessmentInstance,
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
                } as IGeneratedAssessmentInstance,
                selector3: {
                    testStepResults: {
                        [requirementKey]: {
                            isVisualizationEnabled: false,
                            status: ManualTestStatus.FAIL,
                        },
                    },
                    target: [],
                    html: '',
                } as IGeneratedAssessmentInstance,
                selector4: {
                    testStepResults: {
                        ['someOtherKey']: {
                            isVisualizationEnabled: false,
                            status: ManualTestStatus.FAIL,
                        },
                    },
                    target: [],
                    html: '',
                } as IGeneratedAssessmentInstance,
            })
            .with('testStepStatus', { [requirementKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
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

        assessmentsProviderMock.setup(apm => apm.forType(testType)).returns(() => assessmentsProvider.forType(testType));

        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestStep('step')
            .withSelectedTestType(VisualizationType.Color)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestStep(requirementKey)
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

        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestStep('step')
            .withSelectedTestType(selectedTest)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestStep('step')
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
            pivotType: DetailsViewPivotType.allTest,
        };

        assessmentsProviderMock.setup(apm => apm.forType(assessmentType)).verifiable(Times.never());

        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestStep('step')
            .withSelectedTestType(VisualizationType.Color)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestStep('step')
            .withSelectedTestType(VisualizationType.Color)
            .build();

        createStoreTesterForAssessmentActions('updateSelectedPivotChild')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
        assessmentsProviderMock.verifyAll();
    });

    test('verify the MaunalTestStatus Priorities', () => {
        expect(ManualTestStatus.PASS < ManualTestStatus.UNKNOWN).toBeTruthy();
        expect(ManualTestStatus.UNKNOWN < ManualTestStatus.FAIL).toBeTruthy();
    });

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

    function getDefaultManualTestStepResult(stepName: string): IManualTestStepResult {
        return {
            status: ManualTestStatus.UNKNOWN,
            id: stepName,
            instances: [],
        };
    }

    function generateTestStepData(stepFinalResult: ManualTestStatus, isStepScanned: boolean): TestStepData {
        return {
            stepFinalResult,
            isStepScanned,
        };
    }

    function getDefaultState(): IAssessmentStoreData {
        return new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();
    }

    function getStateWithAssessment(data: IAssessmentData): IAssessmentStoreData {
        return new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withAssessment(assessmentKey, data)
            .build();
    }

    function createStoreTesterForAssessmentActions(
        actionName: keyof AssessmentActions,
    ): AssessmentStoreTester<IAssessmentStoreData, AssessmentActions> {
        const factory = (actions: AssessmentActions) =>
            new AssessmentStore(
                browserMock.object,
                actions,
                assessmentDataConverterMock.object,
                assessmentDataRemoverMock.object,
                assessmentsProviderMock.object,
                indexDBInstanceMock.object,
                null,
            );

        return new AssessmentStoreTester(AssessmentActions, actionName, factory, indexDBInstanceMock);
    }
});
