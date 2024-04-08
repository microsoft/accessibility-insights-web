// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    AssessmentActionInstancePayload,
    AssessmentToggleActionPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    ExpandTestNavPayload,
    LoadAssessmentPayload,
    OnDetailsViewInitializedPayload,
    RemoveFailureInstancePayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
    TransferAssessmentPayload,
    UpdateSelectedDetailsViewPayload,
} from 'background/actions/action-payloads';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { AssessmentDataConverter } from 'background/assessment-data-converter';
import { AssessmentDataRemover } from 'background/assessment-data-remover';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { InitialAssessmentStoreDataGenerator } from 'background/initial-assessment-store-data-generator';
import { AssessmentStore } from 'background/stores/assessment-store';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { AssessmentVisualizationConfiguration } from 'common/configs/assessment-visualization-configuration';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { StoreNames } from 'common/stores/store-names';
import {
    AssessmentData,
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
    ManualTestStepResult,
    PersistedTabInfo,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    ManualTestStatus,
    ManualTestStatusData,
    TestStepData,
} from 'common/types/store-data/manual-test-status';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ScanBasePayload,
    ScanCompletedPayload,
    ScanUpdatePayload,
} from 'injected/analyzers/analyzer';
import { cloneDeep } from 'lodash';
import { getIncludedAlwaysRules } from 'scanner/get-rule-inclusions';
import { ScanResults } from 'scanner/iruleresults';
import { AssessmentDataBuilder } from 'tests/unit/common/assessment-data-builder';
import { AssessmentsStoreDataBuilder } from 'tests/unit/common/assessment-store-data-builder';
import { AssessmentStoreTester } from 'tests/unit/common/assessment-store-tester';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { createStoreWithNullParams } from 'tests/unit/common/store-tester';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import type { Tabs } from 'webextension-polyfill';

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
            StoreNames.AssessmentStore,
            IndexedDBDataKeys.assessmentStore,
        );

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
            StoreNames.AssessmentStore,
            IndexedDBDataKeys.assessmentStore,
        );

        const actualState = testObject.getDefaultState();

        expect(actualState).toEqual(defaultStateStub);
    });

    test('getDefaultState with persistedData', () => {
        const targetTab: PersistedTabInfo = {
            id: 1,
            url: 'url',
            title: 'title',
            detailsViewId: 'testId',
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

        expectedState.assessments['assessment-1'].manualTestStepResultMap[expectedTestStep].status =
            2;

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
            StoreNames.AssessmentStore,
            IndexedDBDataKeys.assessmentStore,
        );
        const actualState = testObject.getDefaultState();

        expect(actualState).toEqual(expectedState);
    });

    test('on getCurrentState', async () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        const storeTester = createStoreTesterForAssessmentActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on resetData: only reset data for one test', async () => {
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
        setupDataGeneratorMock(null, expectedState, Times.exactly(2));
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

        const storeTester =
            createStoreTesterForAssessmentActions('resetData').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('on resetData: only reset data for one test with persisted data', async () => {
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

        // Called with persisted data from initialize
        setupDataGeneratorMock(initialState, getDefaultState(), Times.once());
        // Called without persisted data from resetData
        setupDataGeneratorMock(null, expectedState, Times.once());

        const payload: ToggleActionPayload = {
            test: assessmentType,
        };

        const storeTester = createStoreTesterForAssessmentActions(
            'resetData',
            initialState,
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('test that tests indexedDB and also reset', async () => {
        const expectedInstanceMap = {};
        const expectedManualTestStepResultMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', expectedManualTestStepResultMap)
            .with('testStepStatus', getSampleTestStepsData())
            .build();

        const initialState = getStateWithAssessment(assessmentData);
        const finalState = getDefaultStateWithDefaultAssessmentData(assessmentKey, requirementKey);
        setupDataGeneratorMock(null, finalState, Times.exactly(2));
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

        const storeTester =
            createStoreTesterForAssessmentActions('resetData').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('test for null indexedDB instance and also reset', async () => {
        const expectedInstanceMap = {};
        const expectedManualTestStepResultMap = {};

        const assessmentData = new AssessmentDataBuilder()
            .with('generatedAssessmentInstancesMap', expectedInstanceMap)
            .with('manualTestStepResultMap', expectedManualTestStepResultMap)
            .with('testStepStatus', getSampleTestStepsData())
            .build();

        const initialState = getStateWithAssessment(assessmentData);
        const finalState = getDefaultStateWithDefaultAssessmentData(assessmentKey, requirementKey);
        setupDataGeneratorMock(null, finalState, Times.exactly(2));
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

        const storeTester = createStoreTesterForAssessmentActions('resetData')
            .withActionParam(payload)
            .withPostListenerMock(indexDBInstanceMock);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onResetAllAssessmentsData', async () => {
        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab = {
            id: tabId,
            url,
            title,
        } as Tabs.Tab;
        browserMock
            .setup(b => b.getTab(tabId))
            .returns(async () => tab)
            .verifiable();
        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestType(VisualizationType.Color)
            .withTargetTab(oldTabId, null, null, 'testId')
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title, 'testId')
            .build();

        setupDataGeneratorMock(null, getDefaultState(), Times.exactly(2));

        const storeTester =
            createStoreTesterForAssessmentActions('resetAllAssessmentsData').withActionParam(tabId);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onResetAllAssessmentsData with persisted data', async () => {
        const persisted: AssessmentStoreData = {
            persistedTabInfo: null,
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
                selectedTestType: null,
                selectedTestSubview: null,
            },
            resultDescription: '',
        };

        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab = {
            id: tabId,
            url,
            title,
        } as Tabs.Tab;
        browserMock
            .setup(b => b.getTab(tabId))
            .returns(async () => tab)
            .verifiable();

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestType(VisualizationType.Color)
            .withTargetTab(oldTabId, null, null)
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title)
            .build();

        // Called with persisted data from initialize
        setupDataGeneratorMock(persisted, getDefaultState(), Times.once());
        // Called without persisted data from resetAllAssessmentsData
        setupDataGeneratorMock(null, getDefaultState(), Times.once());

        const storeTester = createStoreTesterForAssessmentActions(
            'resetAllAssessmentsData',
            persisted,
        ).withActionParam(tabId);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onContinuePreviousAssessment', async () => {
        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab = {
            id: tabId,
            url,
            title,
        } as Tabs.Tab;
        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());
        browserMock.setup(adapter => adapter.getTab(tabId)).returns(async () => tab);

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(oldTabId, null, null, 'testId')
            .build();

        const finalState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withTargetTab(tabId, url, title, 'testId')
            .build();

        const storeTester = createStoreTesterForAssessmentActions(
            'continuePreviousAssessment',
        ).withActionParam(tabId);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    describe('onLoadAssessment', () => {
        const oldTabId = 1;
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const detailsViewId = 'testId';

        const tab = {
            id: tabId,
            url,
            title,
        } as Tabs.Tab;

        beforeEach(() => {
            browserMock.setup(adapter => adapter.getTab(tabId)).returns(async () => tab);
        });

        test('with tab info', async () => {
            const initialState = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            )
                .withTargetTab(oldTabId, null, null, 'oldId')
                .build();

            const payload: LoadAssessmentPayload = {
                tabId,
                versionedAssessmentData: {
                    version: -1,
                    assessmentData: initialState,
                },
                detailsViewId,
            };

            const finalState = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            )
                .withTargetTab(tabId, url, title, detailsViewId)
                .build();

            setupDataGeneratorMock(payload.versionedAssessmentData.assessmentData, initialState);

            const storeTester =
                createStoreTesterForAssessmentActions('loadAssessment').withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        });

        test('without tab info', async () => {
            const initialState = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            ).build();

            const payload: LoadAssessmentPayload = {
                tabId,
                versionedAssessmentData: {
                    version: -1,
                    assessmentData: initialState,
                },
                detailsViewId,
            };

            const finalState = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            )
                .withTargetTab(tabId, url, title, detailsViewId)
                .build();

            setupDataGeneratorMock(payload.versionedAssessmentData.assessmentData, initialState);

            const storeTester =
                createStoreTesterForAssessmentActions('loadAssessment').withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        });
    });

    test('onScanCompleted with an assisted requirement', async () => {
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
                    getIncludedAlwaysRules,
                ),
            )
            .returns(() => expectedInstanceMap);

        const storeTester =
            createStoreTesterForAssessmentActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanCompleted with a manual requirement uses getInitialManualTestStatus to set status', async () => {
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
                    getIncludedAlwaysRules,
                ),
            )
            .returns(() => fullInstanceMap);

        const storeTester =
            createStoreTesterForAssessmentActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);

        mockGetInitialManualTestStatus.verifyAll();
    });

    test('onScanCompleted with a manual requirement skips getInitialManualTestStatus for requirements that already have a status', async () => {
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
                    getIncludedAlwaysRules,
                ),
            )
            .returns(() => expectedInstanceMap);

        const storeTester =
            createStoreTesterForAssessmentActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanUpdate', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('scanUpdate').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onTrackingCompleted', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('trackingCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on selectTestStep', async () => {
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
            .withExpandedTest(visualizationType)
            .build();

        const payload: SelectTestSubviewPayload = {
            selectedTestSubview: requirement,
            selectedTest: visualizationType,
        };

        assessmentsProviderMock.setup(apm => apm.all()).returns(() => assessmentsProvider.all());

        const storeTester =
            createStoreTesterForAssessmentActions('selectTestSubview').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on expandTestNav', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('expandTestNav').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on collapseTestNav', async () => {
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

        const storeTester = createStoreTesterForAssessmentActions('collapseTestNav');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    describe('onUpdateTargetTabId', () => {
        const tabId = 1000;
        const url = 'url';
        const title = 'title';
        const tab = {
            id: tabId,
            url,
            title,
        } as Tabs.Tab;

        it.each([undefined, { tabId: 2000 }])('with persisted tab=%s', async persistedTab => {
            const storeDataBuilder = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            );
            if (persistedTab !== undefined) {
                storeDataBuilder.withTargetTab(persistedTab.tabId, undefined, undefined, undefined);
            }
            const initialState = storeDataBuilder.build();

            const finalState = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            )
                .withTargetTab(tabId, url, title)
                .build();

            browserMock
                .setup(b => b.getTab(tabId))
                .returns(async () => tab)
                .verifiable();

            const storeTester =
                createStoreTesterForAssessmentActions('updateTargetTabId').withActionParam(tabId);
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        });

        test('with no tab id change', async () => {
            browserMock.setup(b => b.getTab(It.isAny())).verifiable(Times.never());
            const initialState = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            )
                .withTargetTab(tabId, undefined, undefined, undefined)
                .build();

            const storeTester =
                createStoreTesterForAssessmentActions('updateTargetTabId').withActionParam(tabId);
            await storeTester.testListenerToNeverBeCalled(initialState, initialState);
        });
    });

    test('on changeInstanceStatus, test step status updated', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('changeInstanceStatus').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeStepStatus: user marked as pass', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('changeRequirementStatus').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeStepStatus: user marked as fail', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('changeRequirementStatus').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
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
        async ({ supportsVisualization, startsEnabled, payloadEnabled, expectedFinalEnabled }) => {
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

            const storeTester = createStoreTesterForAssessmentActions(
                'changeAssessmentVisualizationState',
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        },
    );

    test('changeAssessmentVisualizationStateForAll enables all visualizations that support it', async () => {
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

        const storeTester = createStoreTesterForAssessmentActions(
            'changeAssessmentVisualizationStateForAll',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoInstanceStatusChange', async () => {
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

        const payload: AssessmentActionInstancePayload = {
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

        const storeTester = createStoreTesterForAssessmentActions(
            'undoInstanceStatusChange',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on undoStepStatusChange', async () => {
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

        const storeTester = createStoreTesterForAssessmentActions(
            'undoRequirementStatusChange',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeInstanceStatus: update test step status, do not go through all instances', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('changeInstanceStatus').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addFailureInstance', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('addFailureInstance').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on removeFailureInstance', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('removeFailureInstance').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on editFailureInstance', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('editFailureInstance').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on passUnmarkedInstance', async () => {
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

        const payload: AssessmentToggleActionPayload = {
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

        const storeTester =
            createStoreTesterForAssessmentActions('passUnmarkedInstance').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivotChild, full payload', async () => {
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

        const storeTester = createStoreTesterForAssessmentActions(
            'updateSelectedPivotChild',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivotChild: details view type is null', async () => {
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

        const storeTester = createStoreTesterForAssessmentActions(
            'updateSelectedPivotChild',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, finalState);
        assessmentsProviderMock.verifyAll();
    });

    test('on updateSelectedPivotChild: when selected pivot is not assessment', async () => {
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

        const storeTester = createStoreTesterForAssessmentActions(
            'updateSelectedPivotChild',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, finalState);
        assessmentsProviderMock.verifyAll();
    });

    test('verify the ManualTestStatus Priorities', () => {
        expect(ManualTestStatus.PASS < ManualTestStatus.UNKNOWN).toBeTruthy();
        expect(ManualTestStatus.UNKNOWN < ManualTestStatus.FAIL).toBeTruthy();
    });

    test('onAddResultDescription', async () => {
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

        const storeTester =
            createStoreTesterForAssessmentActions('addResultDescription').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onTransferAssessment', async () => {
        const testStepStub = 'some-test-step';
        const assessmentStubData = {
            resultDescription: 'some description ',
        } as AssessmentStoreData;

        const payload: TransferAssessmentPayload = {
            assessmentData: assessmentStubData,
        };

        const initialState = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        )
            .withSelectedTestSubview(testStepStub)
            .build();

        const defaultStateStub = new AssessmentsStoreDataBuilder(
            assessmentsProvider,
            assessmentDataConverterMock.object,
        ).build();

        const assessmentData = new AssessmentDataBuilder()
            .with('testStepStatus', getSampleTestStepsData())
            .build();

        const storeDataFromGeneration = getStateWithAssessment(assessmentData);
        const finalState = getStateWithAssessment(assessmentData);
        finalState.assessmentNavState = defaultStateStub.assessmentNavState;

        setupDataGeneratorMock(assessmentStubData, storeDataFromGeneration);
        setupDataGeneratorMock(null, defaultStateStub, Times.exactly(2));

        const storeTester = createStoreTesterForAssessmentActions(
            'loadAssessmentFromTransfer',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    it.each([true, false])(
        'onUpdateDetailsViewId with includeStartData=%s',
        async includeStartData => {
            const payload: OnDetailsViewInitializedPayload = {
                detailsViewId: 'testId',
            } as OnDetailsViewInitializedPayload;
            const tabId = 1000;
            const url = 'url';
            const title = 'title';

            const initialDataBuilder = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            );
            if (includeStartData) {
                initialDataBuilder.withTargetTab(tabId, url, title, 'initialId');
            }
            const initialState = initialDataBuilder.build();

            const finalDataBuilder = new AssessmentsStoreDataBuilder(
                assessmentsProvider,
                assessmentDataConverterMock.object,
            );
            let finalState: AssessmentStoreData;
            if (includeStartData) {
                finalDataBuilder.withTargetTab(tabId, url, title, payload.detailsViewId);
                finalState = finalDataBuilder.build();
            } else {
                finalState = finalDataBuilder.build();
                // Set this manually so we don't have extra undefined fields
                finalState.persistedTabInfo = { detailsViewId: payload.detailsViewId };
            }

            const storeTester =
                createStoreTesterForAssessmentActions('updateDetailsViewId').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        },
    );

    function setupDataGeneratorMock(
        persistedData: AssessmentStoreData,
        initialData: AssessmentStoreData,
        times: Times = Times.once(),
    ): void {
        initialAssessmentStoreDataGeneratorMock
            .setup(im => im.generateInitialState(persistedData))
            .returns(() => initialData)
            .verifiable(times);
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
        persistedData: AssessmentStoreData = null,
    ): AssessmentStoreTester<AssessmentStoreData, AssessmentActions> {
        const factory = (actions: AssessmentActions) =>
            new AssessmentStore(
                browserMock.object,
                actions,
                assessmentDataConverterMock.object,
                assessmentDataRemoverMock.object,
                assessmentsProviderMock.object,
                indexDBInstanceMock.object,
                persistedData,
                initialAssessmentStoreDataGeneratorMock.object,
                failTestOnErrorLogger,
                StoreNames.AssessmentStore,
                IndexedDBDataKeys.assessmentStore,
            );
        return new AssessmentStoreTester(
            AssessmentActions,
            actionName,
            factory,
            indexDBInstanceMock,
        );
    }
});
