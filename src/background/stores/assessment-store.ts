// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import {
    AssessmentData,
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    TestStepResult,
    UserCapturedInstance,
} from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ScanBasePayload,
    ScanCompletedPayload,
    ScanUpdatePayload,
} from 'injected/analyzers/analyzer';
import { forEach, isEmpty, pickBy } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import {
    AddResultDescriptionPayload,
    ExpandTestNavPayload,
    LoadAssessmentPayload,
    OnDetailsViewInitializedPayload,
    SelectTestSubviewPayload,
} from '../actions/action-payloads';
import { AssessmentDataConverter } from '../assessment-data-converter';
import { InitialAssessmentStoreDataGenerator } from '../initial-assessment-store-data-generator';
import {
    AddFailureInstancePayload,
    AssessmentActionInstancePayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    RemoveFailureInstancePayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
} from './../actions/action-payloads';
import { AssessmentActions } from './../actions/assessment-actions';
import { AssessmentDataRemover } from './../assessment-data-remover';

export class AssessmentStore extends PersistentStore<AssessmentStoreData> {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly assessmentActions: AssessmentActions,
        private readonly assessmentDataConverter: AssessmentDataConverter,
        private readonly assessmentDataRemover: AssessmentDataRemover,
        private readonly assessmentsProvider: AssessmentsProvider,
        protected readonly idbInstance: IndexedDBAPI,
        protected readonly persistedData: AssessmentStoreData,
        private readonly initialAssessmentStoreDataGenerator: InitialAssessmentStoreDataGenerator,
        protected readonly logger: Logger,
    ) {
        super(
            StoreNames.AssessmentStore,
            persistedData,
            idbInstance,
            IndexedDBDataKeys.assessmentStore,
            logger,
            true,
        );
    }

    protected override generateDefaultState(
        persistedData: AssessmentStoreData,
    ): AssessmentStoreData {
        return this.initialAssessmentStoreDataGenerator.generateInitialState(persistedData);
    }

    public override getDefaultState(): AssessmentStoreData {
        return this.generateDefaultState(this.persistedState);
    }

    protected addActionListeners(): void {
        this.assessmentActions.getCurrentState.addListener(this.onGetCurrentState);
        this.assessmentActions.scanCompleted.addListener(this.onScanCompleted);
        this.assessmentActions.scanUpdate.addListener(this.onScanUpdate);
        this.assessmentActions.resetData.addListener(this.onResetData);
        this.assessmentActions.resetAllAssessmentsData.addListener(this.onResetAllAssessmentsData);
        this.assessmentActions.selectTestSubview.addListener(this.onSelectTestSubview);
        this.assessmentActions.expandTestNav.addListener(this.onExpandTestNav);
        this.assessmentActions.collapseTestNav.addListener(this.onCollapseTestNav);
        this.assessmentActions.changeInstanceStatus.addListener(this.onChangeInstanceStatus);
        this.assessmentActions.changeRequirementStatus.addListener(this.onChangeStepStatus);
        this.assessmentActions.undoRequirementStatusChange.addListener(this.onUndoStepStatusChange);
        this.assessmentActions.undoInstanceStatusChange.addListener(
            this.onUndoInstanceStatusChange,
        );
        this.assessmentActions.changeAssessmentVisualizationState.addListener(
            this.onChangeAssessmentVisualizationState,
        );
        this.assessmentActions.addFailureInstance.addListener(this.onAddFailureInstance);
        this.assessmentActions.addResultDescription.addListener(this.onAddResultDescription);
        this.assessmentActions.removeFailureInstance.addListener(this.onRemoveFailureInstance);
        this.assessmentActions.editFailureInstance.addListener(this.onEditFailureInstance);
        this.assessmentActions.changeAssessmentVisualizationStateForAll.addListener(
            this.onChangeAssessmentVisualizationStateForAll,
        );
        this.assessmentActions.passUnmarkedInstance.addListener(this.onPassUnmarkedInstances);
        this.assessmentActions.trackingCompleted.addListener(this.onTrackingCompleted);
        this.assessmentActions.updateSelectedPivotChild.addListener(this.onUpdateSelectedTest);
        this.assessmentActions.updateTargetTabId.addListener(this.onUpdateTargetTabId);
        this.assessmentActions.continuePreviousAssessment.addListener(
            this.onContinuePreviousAssessment,
        );
        this.assessmentActions.loadAssessment.addListener(this.onLoadAssessment);
        this.assessmentActions.updateDetailsViewId.addListener(this.onUpdateDetailsViewId);
    }

    private updateTargetTabWithId(tabId: number): void {
        this.browserAdapter.getTab(
            tabId,
            tab => {
                this.state.persistedTabInfo = {
                    id: tab.id,
                    url: tab.url,
                    title: tab.title,
                    detailsViewId: this.state.persistedTabInfo?.detailsViewId,
                };

                this.emitChanged();
            },
            () => {
                throw new Error(`tab with Id ${tabId} not found`);
            },
        );
    }

    private onContinuePreviousAssessment = async (tabId: number): Promise<void> => {
        this.updateTargetTabWithId(tabId);
    };

    private onLoadAssessment = async (payload: LoadAssessmentPayload): Promise<void> => {
        this.state = this.initialAssessmentStoreDataGenerator.generateInitialState(
            payload.versionedAssessmentData.assessmentData,
        );
        if (this.state.persistedTabInfo !== undefined) {
            this.state.persistedTabInfo.detailsViewId = payload.detailsViewId;
        } else {
            this.state.persistedTabInfo = { detailsViewId: payload.detailsViewId };
        }
        this.updateTargetTabWithId(payload.tabId);
    };

    private onUpdateTargetTabId = async (tabId: number): Promise<void> => {
        if (this.state.persistedTabInfo == null || this.state.persistedTabInfo.id !== tabId) {
            this.updateTargetTabWithId(tabId);
        }
    };

    private onUpdateSelectedTest = async (
        payload: UpdateSelectedDetailsViewPayload,
    ): Promise<void> => {
        if (
            payload.pivotType === DetailsViewPivotType.assessment &&
            payload.detailsViewType != null
        ) {
            this.state.assessmentNavState.selectedTestType = payload.detailsViewType;
            this.state.assessmentNavState.selectedTestSubview = this.getDefaultTestStepForTest(
                payload.detailsViewType,
            );
            this.emitChanged();
        }
    };

    private onTrackingCompleted = async (payload: ScanBasePayload): Promise<void> => {
        const test = payload.testType;
        const step = payload.key;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        this.assessmentDataRemover.deleteDataFromGeneratedMapWithStepKey(
            assessmentData.generatedAssessmentInstancesMap,
            step,
        );

        this.emitChanged();
    };

    private onPassUnmarkedInstances = async (
        payload: AssessmentActionInstancePayload,
    ): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        forEach(Object.keys(assessmentData.generatedAssessmentInstancesMap), key => {
            const testStepResult: TestStepResult =
                assessmentData.generatedAssessmentInstancesMap[key].testStepResults[
                    payload.requirement
                ];
            if (
                testStepResult &&
                testStepResult.status === ManualTestStatus.UNKNOWN &&
                testStepResult.originalStatus == null
            ) {
                testStepResult.originalStatus = testStepResult.status;
                testStepResult.status = ManualTestStatus.PASS;
            }
        });

        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.requirement);
        this.emitChanged();
    };

    private onEditFailureInstance = async (payload: EditFailureInstancePayload): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();

        const assessmentData = config.getAssessmentData(this.state);
        const requirementInstances =
            assessmentData.manualTestStepResultMap[payload.requirement].instances;

        const instanceToEdit = requirementInstances.find(instance => instance.id === payload.id);

        if (instanceToEdit) {
            instanceToEdit.description = payload.instanceData.failureDescription;
            instanceToEdit.html = payload.instanceData.snippet;
            instanceToEdit.selector = payload.instanceData.path;
        }

        this.emitChanged();
    };

    private onRemoveFailureInstance = async (
        payload: RemoveFailureInstancePayload,
    ): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);

        const requirement = assessmentData.manualTestStepResultMap[payload.requirement];

        requirement.instances = requirement.instances.filter(
            instance => instance.id !== payload.id,
        );

        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);

        this.emitChanged();
    };

    private onAddFailureInstance = async (payload: AddFailureInstancePayload): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const newInstance: UserCapturedInstance =
            this.assessmentDataConverter.generateFailureInstance(
                payload.instanceData.failureDescription,
                payload.instanceData.path,
                payload.instanceData.snippet,
            );
        assessmentData.manualTestStepResultMap[payload.requirement].instances.push(newInstance);
        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);

        this.emitChanged();
    };

    private onAddResultDescription = async (
        payload: AddResultDescriptionPayload,
    ): Promise<void> => {
        this.state.resultDescription = payload.description;
        this.emitChanged();
    };

    private onChangeAssessmentVisualizationStateForAll = async (
        payload: ChangeInstanceSelectionPayload,
    ): Promise<void> => {
        const { test, requirement } = payload;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const assessmentDataMap = config.getAssessmentData(
            this.state,
        ).generatedAssessmentInstancesMap;

        forEach(assessmentDataMap, val => {
            const stepResult = val.testStepResults[requirement];

            if (stepResult != null) {
                stepResult.isVisualizationEnabled =
                    stepResult.isVisualizationSupported && payload.isVisualizationEnabled;
            }
        });

        this.emitChanged();
    };

    private onChangeStepStatus = async (payload: ChangeRequirementStatusPayload): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.requirement].status = payload.status;

        if (payload.status === ManualTestStatus.PASS) {
            assessmentData.manualTestStepResultMap[payload.requirement].instances = [];
        }

        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);
        this.emitChanged();
    };

    private onUndoStepStatusChange = async (
        payload: ChangeRequirementStatusPayload,
    ): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.requirement].status =
            ManualTestStatus.UNKNOWN;
        assessmentData.manualTestStepResultMap[payload.requirement].instances = [];
        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);
        this.emitChanged();
    };

    private onChangeAssessmentVisualizationState = async (
        payload: ChangeInstanceSelectionPayload,
    ): Promise<void> => {
        const { test, requirement } = payload;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const instance = assessmentData.generatedAssessmentInstancesMap[payload.selector];
        const stepResult: TestStepResult = instance.testStepResults[requirement];

        stepResult.isVisualizationEnabled =
            stepResult.isVisualizationSupported && payload.isVisualizationEnabled;

        this.emitChanged();
    };

    private onUndoInstanceStatusChange = async (
        payload: AssessmentActionInstancePayload,
    ): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: TestStepResult =
            assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[
                payload.requirement
            ];
        stepResult.status = stepResult.originalStatus;
        stepResult.originalStatus = null;
        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.requirement);
        this.emitChanged();
    };

    private onChangeInstanceStatus = async (
        payload: ChangeInstanceStatusPayload,
    ): Promise<void> => {
        const config = this.assessmentsProvider
            .forType(payload.test)
            .getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: TestStepResult =
            assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[
                payload.requirement
            ];
        if (stepResult.originalStatus == null) {
            stepResult.originalStatus = stepResult.status;
        }
        stepResult.status = payload.status;
        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.requirement);
        this.emitChanged();
    };

    private onSelectTestSubview = async (payload: SelectTestSubviewPayload): Promise<void> => {
        this.state.assessmentNavState.selectedTestType = payload.selectedTest;
        this.state.assessmentNavState.selectedTestSubview = payload.selectedTestSubview;
        this.emitChanged();
    };

    private onExpandTestNav = async (payload: ExpandTestNavPayload): Promise<void> => {
        this.state.assessmentNavState.expandedTestType = payload.selectedTest;
        this.emitChanged();
    };

    private onCollapseTestNav = async (): Promise<void> => {
        this.state.assessmentNavState.expandedTestType = null;
        this.emitChanged();
    };

    private onScanCompleted = async (payload: ScanCompletedPayload<any>): Promise<void> => {
        const test = payload.testType;
        const step = payload.key;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const stepConfig = this.assessmentsProvider.getStep(test, step);
        const assessmentData = config.getAssessmentData(this.state);
        const { generatedAssessmentInstancesMap: currentGeneratedMap } = assessmentData;
        const generatedAssessmentInstancesMap =
            this.assessmentDataConverter.generateAssessmentInstancesMap(
                currentGeneratedMap,
                payload.selectorMap,
                step,
                config.getInstanceIdentiferGenerator(step),
                stepConfig.getInstanceStatus,
                stepConfig.isVisualizationSupportedForResult,
            );
        assessmentData.generatedAssessmentInstancesMap = generatedAssessmentInstancesMap;
        assessmentData.testStepStatus[step].isStepScanned = true;
        assessmentData.scanIncompleteWarnings = payload.scanIncompleteWarnings;
        this.updateTestStepStatusOnScanUpdate(assessmentData, step, test);
        this.emitChanged();
    };

    private onScanUpdate = async (payload: ScanUpdatePayload): Promise<void> => {
        const test = payload.testType;
        const step = payload.key;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const { generatedAssessmentInstancesMap: currentGeneratedMap } = assessmentData;
        const generatedAssessmentInstancesMap =
            this.assessmentDataConverter.generateAssessmentInstancesMapForEvents(
                currentGeneratedMap,
                payload.results,
                step,
                config.getInstanceIdentiferGenerator(step),
            );
        assessmentData.generatedAssessmentInstancesMap = generatedAssessmentInstancesMap;
        this.updateTestStepStatusOnScanUpdate(assessmentData, step, test);
        this.emitChanged();
    };

    private onResetData = async (payload: ToggleActionPayload): Promise<void> => {
        const test = this.assessmentsProvider.forType(payload.test);
        const config = test.getVisualizationConfiguration();
        const defaultTestStatus: AssessmentData = config.getAssessmentData(
            this.generateDefaultState(null),
        );
        this.state.assessments[test.key] = defaultTestStatus;
        this.state.assessmentNavState.selectedTestSubview = test.requirements[0].key;
        this.emitChanged();
    };

    private onResetAllAssessmentsData = async (targetTabId: number): Promise<void> => {
        const detailsViewId = this.state.persistedTabInfo.detailsViewId;
        this.state = this.generateDefaultState(null);
        this.state.persistedTabInfo = { detailsViewId };
        this.updateTargetTabWithId(targetTabId);
    };

    private onUpdateDetailsViewId = async (
        payload: OnDetailsViewInitializedPayload,
    ): Promise<void> => {
        if (!this.state.persistedTabInfo) {
            this.state.persistedTabInfo = { detailsViewId: payload.detailsViewId };
        } else {
            this.state.persistedTabInfo.detailsViewId = payload.detailsViewId;
        }
        this.emitChanged();
    };

    private getDefaultTestStepForTest(testType: VisualizationType): string {
        return this.assessmentsProvider.forType(testType).requirements[0].key;
    }

    private updateTestStepStatusOnScanUpdate(
        assessmentData: AssessmentData,
        testStepName: string,
        testType: VisualizationType,
    ): void {
        const step = this.assessmentsProvider.getStep(testType, testStepName);
        const { isManual, getInitialManualTestStatus } = step;

        if (isManual) {
            this.applyInitialManualTestStatus(
                assessmentData,
                testStepName,
                testType,
                getInitialManualTestStatus,
            );
        } else {
            this.updateTestStepStatusForGeneratedInstances(assessmentData, testStepName);
        }
    }

    private applyInitialManualTestStatus(
        assessmentData: AssessmentData,
        testStepName: string,
        testType: VisualizationType,
        getInitialManualTestStatus: (InstanceIdToInstanceDataMap) => ManualTestStatus,
    ): void {
        const originalStatus = assessmentData.manualTestStepResultMap[testStepName].status;
        if (originalStatus !== ManualTestStatus.UNKNOWN) {
            return; // Never override an explicitly set status
        }

        const allInstances = assessmentData.generatedAssessmentInstancesMap;
        const instancesWithResultsForTestStep = pickBy(
            allInstances,
            (value, key) => value.testStepResults[testStepName] != null,
        );

        const status = getInitialManualTestStatus(instancesWithResultsForTestStep);
        assessmentData.manualTestStepResultMap[testStepName].status = status;
        this.updateManualTestStepStatus(assessmentData, testStepName, testType);
    }

    private getGroupResult(
        instanceMap: DictionaryStringTo<GeneratedAssessmentInstance>,
        testStepName: string,
    ): ManualTestStatus {
        let groupResult = ManualTestStatus.PASS;
        for (let keyIndex = 0; keyIndex < Object.keys(instanceMap).length; keyIndex++) {
            const key = Object.keys(instanceMap)[keyIndex];
            const testStepResult: TestStepResult = instanceMap[key].testStepResults[testStepName];

            if (!testStepResult) {
                continue;
            }

            if (
                testStepResult.status === ManualTestStatus.UNKNOWN &&
                testStepResult.originalStatus == null
            ) {
                return ManualTestStatus.UNKNOWN;
            }

            groupResult = Math.max(groupResult, testStepResult.status);
        }

        return groupResult;
    }

    private updateTestStepStatusForGeneratedInstances(
        assessmentData: AssessmentData,
        testStepName: string,
    ): void {
        const instanceMap = assessmentData.generatedAssessmentInstancesMap;
        const groupResult: ManualTestStatus = this.getGroupResult(instanceMap, testStepName);
        assessmentData.testStepStatus[testStepName].stepFinalResult = groupResult;
    }

    private updateManualTestStepStatus(
        assessmentData: AssessmentData,
        testStepName: string,
        testType: VisualizationType,
    ): void {
        const manualResult = assessmentData.manualTestStepResultMap[testStepName];
        const testStepStatus = assessmentData.testStepStatus[testStepName];

        if (manualResult.status === ManualTestStatus.FAIL) {
            const hasFailureInstances: boolean = !isEmpty(manualResult.instances);
            testStepStatus.stepFinalResult = hasFailureInstances
                ? ManualTestStatus.FAIL
                : ManualTestStatus.UNKNOWN;
        } else {
            testStepStatus.stepFinalResult = manualResult.status;
        }
    }
}
