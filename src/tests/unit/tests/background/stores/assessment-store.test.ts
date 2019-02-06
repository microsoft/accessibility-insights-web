// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProvider } from '../../../../../assessments/assessments-provider';
import { IAssessment } from '../../../../../assessments/types/iassessment';
import { IAssessmentsProvider } from '../../../../../assessments/types/iassessments-provider';
import {
    AddFailureInstancePayload,
    ChangeAssessmentStepStatusPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    EditFailureInstancePayload,
    RemoveFailureInstancePayload,
    SelectTestStepPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateVisibilityPayload,
} from '../../../../../background/actions/action-payloads';
import { AssessmentActions } from '../../../../../background/actions/assessment-actions';
import { AssessmentDataConverter } from '../../../../../background/assessment-data-converter';
import { AssessmentDataRemover } from '../../../../../background/assessment-data-remover';
import { ChromeAdapter } from '../../../../../background/browser-adapter';
import { AssessmentStore } from '../../../../../background/stores/assessment-store';
import { IAssesssmentVisualizationConfiguration } from '../../../../../common/configs/visualization-configuration-factory';
import { IndexedDBAPI } from '../../../../../common/indexedDB/indexedDB';
import { ITab } from '../../../../../common/itab';
import { StoreNames } from '../../../../../common/stores/store-names';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { IManualTestStatus, ITestStepData, ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    IAssessmentData,
    IAssessmentStoreData,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    ITestStepResult,
} from '../../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { IScanBasePayload, IScanCompletedPayload, IScanUpdatePayload } from '../../../../../injected/analyzers/ianalyzer';
import { ITabStopEvent } from '../../../../../injected/tab-stops-listener';
import { ScanResults } from '../../../../../scanner/iruleresults';
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
let assessmentMock: IMock<IAssessment>;
let getInstanceIdentiferGeneratorMock: IMock<(step: string) => Function>;
let configStub: IAssesssmentVisualizationConfiguration;
let instanceIdentifierGeneratorStub: (instances) => string;

const assessmentKey: string = 'assessment-1';
const stepKey: string = 'assessment-1-step-1';
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
        } as IAssesssmentVisualizationConfiguration;

        assessmentsProvider = CreateTestAssessmentProvider();
        assessmentsProviderMock = Mock.ofType(AssessmentsProvider, MockBehavior.Strict);
        assessmentMock = Mock.ofInstance({
            getVisualizationConfiguration: () => {
                return null;
            },
        } as IAssessment);
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
            targetTab: null,
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
        const targetTab = { id: 1, url: 'url', title: 'title' };
        const expectedTestType = -1 as VisualizationType;
        const expectedTestStep: string = 'assessment-1-step-1';
        const assessmentProvider = CreateTestAssessmentProvider();
        const assessments = assessmentProvider.all();

        const persisted: IAssessmentStoreData = {
            targetTab,
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
            targetTab,
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
            targetTab: null,
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
        } as IAssesssmentVisualizationConfiguration;

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
                    key: stepKey,
                },
            ],
        } as IAssessment;

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
        } as IAssesssmentVisualizationConfiguration;

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
                    key: stepKey,
                },
            ],
        } as IAssessment;

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
        } as IAssesssmentVisualizationConfiguration;

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
                    key: stepKey,
                },
            ],
        } as IAssessment;

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
        const tab: ITab = {
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
            .withTargetTab(oldTabId, null, null)
            .build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withTargetTab(tabId, url, title)
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
        const tab: ITab = {
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
            .withTargetTab(oldTabId, null, null)
            .build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withTargetTab(tabId, url, title)
            .build();

        createStoreTesterForAssessmentActions('resetAllAssessmentsData')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanCompleted', () => {
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();

        const payload: IScanCompletedPayload<any> = {
            selectorMap: {},
            scanResult: {} as ScanResults,
            testType: assessmentType,
            key: stepKey,
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

        getInstanceIdentiferGeneratorMock.setup(giim => giim(stepKey)).returns(() => instanceIdentifierGeneratorStub);

        assessmentDataConverterMock
            .setup(a => a.generateAssessmentInstancesMap(null, payload.selectorMap, stepKey, instanceIdentifierGeneratorStub, It.isAny()))
            .returns(() => expectedInstanceMap);

        createStoreTesterForAssessmentActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanUpdate', () => {
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();

        const payload: IScanUpdatePayload = {
            testType: assessmentType,
            key: stepKey,
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
            .setup(apm => apm.getStep(assessmentType, stepKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, stepKey));

        assessmentsProviderMock.setup(apm => apm.forType(payload.testType)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        getInstanceIdentiferGeneratorMock.setup(giim => giim(stepKey)).returns(() => instanceIdentifierGeneratorStub);

        const currentInstancesMap = null;

        assessmentDataConverterMock
            .setup(a =>
                a.generateAssessmentInstancesMapForEvents(currentInstancesMap, payload.results, stepKey, instanceIdentifierGeneratorStub),
            )
            .returns(() => expectedInstanceMap);

        createStoreTesterForAssessmentActions('scanUpdate')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onTrackingCompleted', () => {
        const instanceKey = 'instance-1';
        const initialInstanceMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            [instanceKey]: {
                testStepResults: {
                    [stepKey]: {
                        status: 2,
                    } as ITestStepResult,
                },
            } as IGeneratedAssessmentInstance,
        };
        const initialAssessmentData = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', initialInstanceMap).build();
        const finalAssessmentData = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', {}).build();
        const payload: IScanBasePayload = {
            testType: assessmentType,
            key: stepKey,
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
        const step = 'test-step';
        const initialState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object).build();
        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withSelectedTestType(type)
            .withSelectedTestStep(step)
            .build();

        const payload: SelectTestStepPayload = {
            selectedStep: step,
            selectedTest: type,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        createStoreTesterForAssessmentActions('selectTestStep')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onUpdateTargetTabId', () => {
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab: ITab = {
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
            .withTargetTab(tabId, url, title)
            .build();

        createStoreTesterForAssessmentActions('updateTargetTabId')
            .withActionParam(tabId)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onUpdateTargetTabId: tab is null', () => {
        const tabId = 1000;
        const tab: ITab = null;
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
        const generatedAssessmentInstancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [stepKey]: {
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap)
            .with('testStepStatus', {
                [stepKey]: getDefaultTestStepData(),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceStatusPayload = {
            test: assessmentType,
            step: stepKey,
            selector: 'selector',
            status: ManualTestStatus.PASS,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, stepKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, stepKey));

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstanceMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstanceMap.selector.testStepResults[stepKey] = {
            status: ManualTestStatus.PASS,
            originalStatus: ManualTestStatus.UNKNOWN,
        };

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('testStepStatus', {
                [stepKey]: generateTestStepData(ManualTestStatus.PASS, false),
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
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [
                        {
                            id: '1',
                            description: 'aaa',
                        },
                    ],
                },
            })
            .with('testStepStatus', {
                [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeAssessmentStepStatusPayload = {
            test: assessmentType,
            step: stepKey,
            status: ManualTestStatus.PASS,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.PASS,
                    id: stepKey,
                    instances: [],
                },
            })
            .with('testStepStatus', {
                [stepKey]: generateTestStepData(ManualTestStatus.PASS, false),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeStepStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeStepStatus: user marked as fail', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.PASS,
                    id: stepKey,
                    instances: [],
                },
            })
            .with('testStepStatus', {
                [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false),
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeAssessmentStepStatusPayload = {
            test: assessmentType,
            step: stepKey,
            status: ManualTestStatus.FAIL,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);
        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [],
                },
            })
            .with('testStepStatus', {
                [stepKey]: getDefaultTestStepData(),
            })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeStepStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeAssessmentVisualizationState', () => {
        const generatedAssessmentInstancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [stepKey]: {
                        isVisualizationEnabled: true,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', generatedAssessmentInstancesMap).build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceSelectionPayload = {
            test: assessmentType,
            step: stepKey,
            isVisualizationEnabled: true,
            selector: 'selector',
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector.testStepResults[stepKey].isVisualizationEnabled = true;

        const expectedAssessment = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', expectedInstancesMap).build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeAssessmentVisualizationState')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateInstanceVisibility', () => {
        const generatedAssessmentInstancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [stepKey]: {
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
            .withSelectedTestStep(stepKey)
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
        expectedInstancesMap.selector.testStepResults[stepKey].isVisible = false;

        const expectedAssessment = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', expectedInstancesMap).build();

        const finalState = new AssessmentsStoreDataBuilder(assessmentsProvider, assessmentDataConverterMock.object)
            .withAssessment(assessmentKey, expectedAssessment)
            .withSelectedTestStep(stepKey)
            .build();

        createStoreTesterForAssessmentActions('updateInstanceVisibility')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeAssessmentVisualizationStateForAll', () => {
        const generatedAssessmentInstancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector1: {
                testStepResults: {
                    [stepKey]: {
                        isVisualizationEnabled: true,
                    },
                },
            } as any,
            selector2: {
                testStepResults: {
                    [stepKey]: {
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
            step: stepKey,
            isVisualizationEnabled: true,
            selector: null,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector2.testStepResults[stepKey].isVisualizationEnabled = true;

        const expectedAssessment = new AssessmentDataBuilder().with('generatedAssessmentInstancesMap', expectedInstancesMap).build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeAssessmentVisualizationStateForAll')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoInstanceStatusChange', () => {
        const generatedAssessmentInstancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector: {
                testStepResults: {
                    [stepKey]: {
                        status: ManualTestStatus.UNKNOWN,
                        originalStatus: ManualTestStatus.FAIL,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', _.cloneDeep(generatedAssessmentInstancesMap))
            .with('testStepStatus', { [stepKey]: generateTestStepData(ManualTestStatus.UNKNOWN, false) })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ToggleActionPayload = {
            test: assessmentType,
            step: stepKey,
            selector: 'selector',
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, stepKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, stepKey));

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap.selector.testStepResults[stepKey].status = ManualTestStatus.FAIL;
        expectedInstancesMap.selector.testStepResults[stepKey].originalStatus = null;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .with('testStepStatus', { [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('undoInstanceStatusChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoStepStatusChange', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.PASS,
                    id: stepKey,
                    instances: [
                        {
                            id: 'id',
                            description: 'comment',
                        },
                    ],
                },
            })
            .with('testStepStatus', { [stepKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeAssessmentStepStatusPayload = {
            test: assessmentType,
            step: stepKey,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.UNKNOWN,
                    id: stepKey,
                    instances: [],
                },
            })
            .with('testStepStatus', { [stepKey]: getDefaultTestStepData() })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('undoStepStatusChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeInstanceStatus: update test step status, do not go through all instances', () => {
        const selector = 'test-selector';
        const generatedAssessmentInstancesMap = {
            [selector]: {
                testStepResults: {
                    [stepKey]: {
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
            } as any,
        };

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', _.cloneDeep(generatedAssessmentInstancesMap))
            .with('testStepStatus', { [stepKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ChangeInstanceStatusPayload = {
            test: assessmentType,
            step: stepKey,
            selector,
            status: ManualTestStatus.FAIL,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentsProviderMock
            .setup(apm => apm.getStep(assessmentType, stepKey))
            .returns(() => assessmentsProvider.getStep(assessmentType, stepKey));

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedInstancesMap = _.cloneDeep(generatedAssessmentInstancesMap);
        expectedInstancesMap[selector].testStepResults[stepKey].originalStatus = ManualTestStatus.UNKNOWN;
        expectedInstancesMap[selector].testStepResults[stepKey].status = ManualTestStatus.FAIL;

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstancesMap)
            .with('testStepStatus', { [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
            .build();

        const finalState = getStateWithAssessment(expectedAssessment);

        createStoreTesterForAssessmentActions('changeInstanceStatus')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addFailureInstance', () => {
        const assessmentData = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [],
                },
            })
            .with('testStepStatus', { [stepKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: AddFailureInstancePayload = {
            test: assessmentType,
            step: stepKey,
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
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [failureInstance],
                },
            })
            .with('testStepStatus', { [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
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
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [failureInstance],
                },
            })
            .with('testStepStatus', { [stepKey]: getDefaultTestStepData() })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: RemoveFailureInstancePayload = {
            test: assessmentType,
            step: stepKey,
            id: '1',
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [],
                },
            })
            .with('testStepStatus', { [stepKey]: getDefaultTestStepData() })
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
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
                    instances: [failureInstance],
                },
            })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: EditFailureInstancePayload = {
            test: assessmentType,
            step: stepKey,
            id: '1',
            description: newDescription,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('manualTestStepResultMap', {
                [stepKey]: {
                    status: ManualTestStatus.FAIL,
                    id: stepKey,
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
        const generatedAssessmentInstancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector1: {
                testStepResults: {
                    [stepKey]: {
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
                    [stepKey]: {
                        isVisualizationEnabled: false,
                        status: ManualTestStatus.UNKNOWN,
                    },
                },
                target: [],
                html: '',
            } as IGeneratedAssessmentInstance,
            selector3: {
                testStepResults: {
                    [stepKey]: {
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
            .with('testStepStatus', { [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
            .build();

        const initialState = getStateWithAssessment(assessmentData);

        const payload: ToggleActionPayload = {
            test: assessmentType,
            step: stepKey,
        };

        assessmentsProviderMock.setup(apm => apm.forType(payload.test)).returns(() => assessmentMock.object);

        assessmentMock.setup(am => am.getVisualizationConfiguration()).returns(() => configStub);

        const expectedAssessment = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', {
                selector1: {
                    testStepResults: {
                        [stepKey]: {
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
                        [stepKey]: {
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
                        [stepKey]: {
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
            .with('testStepStatus', { [stepKey]: generateTestStepData(ManualTestStatus.FAIL, false) })
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
            .withSelectedTestStep(stepKey)
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

    function getSampleTestStepsData(): IManualTestStatus {
        const defaultData = {
            ['assessment-1-step-1']: getDefaultTestStepData(),
            ['assessment-1-step-2']: getDefaultTestStepData(),
            ['assessment-1-step-3']: getDefaultTestStepData(),
        };

        return defaultData;
    }

    function getDefaultTestStepData(): ITestStepData {
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

    function generateTestStepData(stepFinalResult: ManualTestStatus, isStepScanned: boolean): ITestStepData {
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

    function createStoreTesterForAssessmentActions(actionName: keyof AssessmentActions) {
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
