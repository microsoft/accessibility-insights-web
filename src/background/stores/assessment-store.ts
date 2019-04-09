// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { forEach, isEmpty } from 'lodash';

import { AssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';
import { StoreNames } from '../../common/stores/store-names';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import {
    AssessmentStoreData,
    IAssessmentData,
    IGeneratedAssessmentInstance,
    ITestStepResult,
    IUserCapturedInstance,
} from '../../common/types/store-data/assessment-result-data';
import { ScanBasePayload, ScanCompletedPayload, ScanUpdatePayload } from '../../injected/analyzers/analyzer';
import { DictionaryStringTo } from '../../types/common-types';
import { SelectRequirementPayload, UpdateVisibilityPayload } from '../actions/action-payloads';
import { AssessmentDataConverter } from '../assessment-data-converter';
import { InitialAssessmentStoreDataGenerator } from '../initial-assessment-store-data-generator';
import { VisualizationType } from './../../common/types/visualization-type';
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
import { BrowserAdapter } from './../browser-adapter';
import { BaseStoreImpl } from './base-store-impl';

export class AssessmentStore extends BaseStoreImpl<AssessmentStoreData> {
    private assessmentActions: AssessmentActions;
    private assessmentDataConverter: AssessmentDataConverter;
    private assessmentDataRemover: AssessmentDataRemover;
    private assessmentsProvider: AssessmentsProvider;
    private idbInstance: IndexedDBAPI;
    private browserAdapter: BrowserAdapter;
    private persistedData: AssessmentStoreData;

    constructor(
        browserAdapter: BrowserAdapter,
        assessmentActions: AssessmentActions,
        assessmentDataConverter: AssessmentDataConverter,
        assessmentDataRemover: AssessmentDataRemover,
        assessmentsProvider: AssessmentsProvider,
        idbInstance: IndexedDBAPI,
        persistedData: AssessmentStoreData,
        private readonly initialAssessmentStoreDataGenerator: InitialAssessmentStoreDataGenerator,
    ) {
        super(StoreNames.AssessmentStore);

        this.browserAdapter = browserAdapter;
        this.assessmentActions = assessmentActions;
        this.assessmentDataConverter = assessmentDataConverter;
        this.assessmentsProvider = assessmentsProvider;
        this.assessmentDataRemover = assessmentDataRemover;
        this.idbInstance = idbInstance;
        this.persistedData = persistedData;
    }

    public generateDefaultState(persistedData: AssessmentStoreData = null): AssessmentStoreData {
        return this.initialAssessmentStoreDataGenerator.generateInitialState(persistedData);
    }

    public getDefaultState(): AssessmentStoreData {
        return this.generateDefaultState(this.persistedData);
    }

    private async persistAssessmentData(assessmentStoreData: AssessmentStoreData): Promise<boolean> {
        return await this.idbInstance.setItem(IndexedDBDataKeys.assessmentStore, assessmentStoreData);
    }

    /**
     * overriding emitChanged to persist assessment store
     * into indexedDB
     */
    protected emitChanged(): void {
        const assessmentStoreData = this.getState();

        // tslint:disable-next-line:no-floating-promises - grandfathered-in pre-existing violation
        this.persistAssessmentData(assessmentStoreData);

        super.emitChanged();
    }

    protected addActionListeners(): void {
        this.assessmentActions.getCurrentState.addListener(this.onGetCurrentState);
        this.assessmentActions.scanCompleted.addListener(this.onScanCompleted);
        this.assessmentActions.scanUpdate.addListener(this.onScanUpdate);
        this.assessmentActions.resetData.addListener(this.onResetData);
        this.assessmentActions.resetAllAssessmentsData.addListener(this.onResetAllAssessmentsData);
        this.assessmentActions.selectRequirement.addListener(this.onSelectTestStep);
        this.assessmentActions.changeInstanceStatus.addListener(this.onChangeInstanceStatus);
        this.assessmentActions.changeRequirementStatus.addListener(this.onChangeStepStatus);
        this.assessmentActions.undoRequirementStatusChange.addListener(this.onUndoStepStatusChange);
        this.assessmentActions.undoInstanceStatusChange.addListener(this.onUndoInstanceStatusChange);
        this.assessmentActions.changeAssessmentVisualizationState.addListener(this.onChangeAssessmentVisualizationState);
        this.assessmentActions.addFailureInstance.addListener(this.onAddFailureInstance);
        this.assessmentActions.removeFailureInstance.addListener(this.onRemoveFailureInstance);
        this.assessmentActions.editFailureInstance.addListener(this.onEditFailureInstance);
        this.assessmentActions.changeAssessmentVisualizationStateForAll.addListener(this.onChangeAssessmentVisualizationStateForAll);
        this.assessmentActions.updateInstanceVisibility.addListener(this.onUpdateInstanceVisibility);
        this.assessmentActions.passUnmarkedInstance.addListener(this.onPassUnmarkedInstances);
        this.assessmentActions.trackingCompleted.addListener(this.onTrackingCompleted);
        this.assessmentActions.updateSelectedPivotChild.addListener(this.onUpdateSelectedTest);
        this.assessmentActions.updateTargetTabId.addListener(this.onUpdateTargetTabId);
        this.assessmentActions.continuePreviousAssessment.addListener(this.onContinuePreviousAssessment);
    }

    private updateTargetTabWithId(tabId: number): void {
        this.browserAdapter.getTab(tabId, tab => {
            if (tab === null) {
                return;
            }

            this.state.persistedTabInfo = {
                id: tab.id,
                url: tab.url,
                title: tab.title,
                appRefreshed: false,
            };

            this.emitChanged();
        });
    }

    @autobind
    private onContinuePreviousAssessment(tabId: number): void {
        this.updateTargetTabWithId(tabId);
    }

    @autobind
    private onUpdateTargetTabId(tabId: number): void {
        if (this.state.persistedTabInfo == null || this.state.persistedTabInfo.id !== tabId) {
            this.updateTargetTabWithId(tabId);
        }
    }

    @autobind
    private onUpdateSelectedTest(payload: UpdateSelectedDetailsViewPayload): void {
        if (payload.pivotType === DetailsViewPivotType.assessment && payload.detailsViewType != null) {
            this.state.assessmentNavState.selectedTestType = payload.detailsViewType;
            this.state.assessmentNavState.selectedTestStep = this.getDefaultTestStepForTest(payload.detailsViewType);
            this.emitChanged();
        }
    }

    @autobind
    private onTrackingCompleted(payload: ScanBasePayload): void {
        const test = payload.testType;
        const step = payload.key;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        this.assessmentDataRemover.deleteDataFromGeneratedMapWithStepKey(assessmentData.generatedAssessmentInstancesMap, step);

        this.emitChanged();
    }

    @autobind
    private onPassUnmarkedInstances(payload: AssessmentActionInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        forEach(Object.keys(assessmentData.generatedAssessmentInstancesMap), key => {
            const testStepResult: ITestStepResult =
                assessmentData.generatedAssessmentInstancesMap[key].testStepResults[payload.requirement];
            if (testStepResult && testStepResult.status === ManualTestStatus.UNKNOWN && testStepResult.originalStatus == null) {
                testStepResult.originalStatus = testStepResult.status;
                testStepResult.status = ManualTestStatus.PASS;
            }
        });

        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.requirement);
        this.emitChanged();
    }

    @autobind
    private onEditFailureInstance(payload: EditFailureInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const instances = assessmentData.manualTestStepResultMap[payload.requirement].instances;
        for (let instanceIndex = 0; instanceIndex < instances.length; instanceIndex++) {
            const instance = instances[instanceIndex];
            if (instance.id === payload.id) {
                instance.description = payload.description;
                break;
            }
        }

        this.emitChanged();
    }

    @autobind
    private onRemoveFailureInstance(payload: RemoveFailureInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.requirement].instances = assessmentData.manualTestStepResultMap[
            payload.requirement
        ].instances.filter(instance => {
            return instance.id !== payload.id;
        });
        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);

        this.emitChanged();
    }

    @autobind
    private onAddFailureInstance(payload: AddFailureInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const newInstance: IUserCapturedInstance = this.assessmentDataConverter.generateFailureInstance(payload.description);
        assessmentData.manualTestStepResultMap[payload.requirement].instances.push(newInstance);
        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);

        this.emitChanged();
    }

    @autobind
    private onChangeAssessmentVisualizationStateForAll(payload: ChangeInstanceSelectionPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentDataMap = config.getAssessmentData(this.state).generatedAssessmentInstancesMap;
        forEach(assessmentDataMap, val => {
            const stepResult = val.testStepResults[payload.requirement];

            if (stepResult != null) {
                stepResult.isVisualizationEnabled = payload.isVisualizationEnabled;
            }
        });

        this.emitChanged();
    }

    @autobind
    private onChangeStepStatus(payload: ChangeRequirementStatusPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.requirement].status = payload.status;

        if (payload.status === ManualTestStatus.PASS) {
            assessmentData.manualTestStepResultMap[payload.requirement].instances = [];
        }

        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);
        this.emitChanged();
    }

    @autobind
    private onUndoStepStatusChange(payload: ChangeRequirementStatusPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.requirement].status = ManualTestStatus.UNKNOWN;
        assessmentData.manualTestStepResultMap[payload.requirement].instances = [];
        this.updateManualTestStepStatus(assessmentData, payload.requirement, payload.test);
        this.emitChanged();
    }

    @autobind
    private onChangeAssessmentVisualizationState(payload: ChangeInstanceSelectionPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: ITestStepResult =
            assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[payload.requirement];
        stepResult.isVisualizationEnabled = payload.isVisualizationEnabled;

        this.emitChanged();
    }

    @autobind
    private onUpdateInstanceVisibility(payload: UpdateVisibilityPayload): void {
        const step = this.state.assessmentNavState.selectedTestStep;
        payload.payloadBatch.forEach(updateInstanceVisibilityPayload => {
            const config = this.assessmentsProvider.forType(updateInstanceVisibilityPayload.test).getVisualizationConfiguration();
            const assessmentData = config.getAssessmentData(this.state);
            if (assessmentData.generatedAssessmentInstancesMap == null) {
                return;
            }
            const testStepResult: ITestStepResult =
                assessmentData.generatedAssessmentInstancesMap[updateInstanceVisibilityPayload.selector].testStepResults[step];
            testStepResult.isVisible = updateInstanceVisibilityPayload.isVisible;
        });

        this.emitChanged();
    }

    @autobind
    private onUndoInstanceStatusChange(payload: AssessmentActionInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: ITestStepResult =
            assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[payload.requirement];
        stepResult.status = stepResult.originalStatus;
        stepResult.originalStatus = null;
        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.requirement);
        this.emitChanged();
    }

    @autobind
    private onChangeInstanceStatus(payload: ChangeInstanceStatusPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: ITestStepResult =
            assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[payload.requirement];
        if (stepResult.originalStatus == null) {
            stepResult.originalStatus = stepResult.status;
        }
        stepResult.status = payload.status;
        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.requirement);
        this.emitChanged();
    }

    @autobind
    private onSelectTestStep(payload: SelectRequirementPayload): void {
        this.state.assessmentNavState.selectedTestType = payload.selectedTest;
        this.state.assessmentNavState.selectedTestStep = payload.selectedRequirement;
        this.emitChanged();
    }

    @autobind
    private onScanCompleted(payload: ScanCompletedPayload<any>): void {
        const test = payload.testType;
        const step = payload.key;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const stepConfig = this.assessmentsProvider.getStep(test, step);
        const assessmentData = config.getAssessmentData(this.state);
        const { generatedAssessmentInstancesMap: currentGeneratedMap } = assessmentData;
        const generatedAssessmentInstancesMap = this.assessmentDataConverter.generateAssessmentInstancesMap(
            currentGeneratedMap,
            payload.selectorMap,
            step,
            config.getInstanceIdentiferGenerator(step),
            stepConfig.getInstanceStatus,
        );
        assessmentData.generatedAssessmentInstancesMap = generatedAssessmentInstancesMap;
        assessmentData.testStepStatus[step].isStepScanned = true;
        this.updateTestStepStatusOnScanUpdate(assessmentData, step, test);
        this.emitChanged();
    }

    @autobind
    private onScanUpdate(payload: ScanUpdatePayload): void {
        const test = payload.testType;
        const step = payload.key;
        const config = this.assessmentsProvider.forType(test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const { generatedAssessmentInstancesMap: currentGeneratedMap } = assessmentData;
        const generatedAssessmentInstancesMap = this.assessmentDataConverter.generateAssessmentInstancesMapForEvents(
            currentGeneratedMap,
            payload.results,
            step,
            config.getInstanceIdentiferGenerator(step),
        );
        assessmentData.generatedAssessmentInstancesMap = generatedAssessmentInstancesMap;
        this.updateTestStepStatusOnScanUpdate(assessmentData, step, test);
        this.emitChanged();
    }

    @autobind
    private onResetData(payload: ToggleActionPayload): void {
        const test = this.assessmentsProvider.forType(payload.test);
        const config = test.getVisualizationConfiguration();
        const defaultTestStatus: IAssessmentData = config.getAssessmentData(this.generateDefaultState());
        this.state.assessments[test.key] = defaultTestStatus;
        this.state.assessmentNavState.selectedTestStep = test.requirements[0].key;
        this.emitChanged();
    }

    @autobind
    private onResetAllAssessmentsData(targetTabId: number): void {
        this.state = this.generateDefaultState();
        this.updateTargetTabWithId(targetTabId);
    }

    private getDefaultTestStepForTest(testType: VisualizationType): string {
        return this.assessmentsProvider.forType(testType).requirements[0].key;
    }

    private updateTestStepStatusOnScanUpdate(assessmentData: IAssessmentData, testStepName: string, testType: VisualizationType): void {
        const isManual = this.assessmentsProvider.getStep(testType, testStepName).isManual;
        if (isManual !== true) {
            this.updateTestStepStatusForGeneratedInstances(assessmentData, testStepName);
        }
    }

    private getGroupResult(instanceMap: DictionaryStringTo<IGeneratedAssessmentInstance>, testStepName: string): ManualTestStatus {
        let groupResult = ManualTestStatus.PASS;
        for (let keyIndex = 0; keyIndex < Object.keys(instanceMap).length; keyIndex++) {
            const key = Object.keys(instanceMap)[keyIndex];
            const testStepResult: ITestStepResult = instanceMap[key].testStepResults[testStepName];

            if (!testStepResult) {
                continue;
            }

            if (testStepResult.status === ManualTestStatus.UNKNOWN && testStepResult.originalStatus == null) {
                return ManualTestStatus.UNKNOWN;
            }

            groupResult = Math.max(groupResult, testStepResult.status);
        }

        return groupResult;
    }

    private updateTestStepStatusForGeneratedInstances(assessmentData: IAssessmentData, testStepName: string): void {
        const instanceMap = assessmentData.generatedAssessmentInstancesMap;
        const groupResult: ManualTestStatus = this.getGroupResult(instanceMap, testStepName);
        assessmentData.testStepStatus[testStepName].stepFinalResult = groupResult;
    }

    private updateManualTestStepStatus(assessmentData: IAssessmentData, testStepName: string, testType: VisualizationType): void {
        const manualResult = assessmentData.manualTestStepResultMap[testStepName];
        const testStepStatus = assessmentData.testStepStatus[testStepName];

        if (manualResult.status === ManualTestStatus.FAIL) {
            const hasFailureInstances: boolean = !isEmpty(manualResult.instances);
            testStepStatus.stepFinalResult = hasFailureInstances ? ManualTestStatus.FAIL : ManualTestStatus.UNKNOWN;
        } else {
            testStepStatus.stepFinalResult = manualResult.status;
        }
    }
}
