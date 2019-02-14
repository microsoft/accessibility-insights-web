// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { forEach, isEmpty } from 'lodash/index';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { IndexedDBDataKeys } from '../../background/IndexedDBDataKeys';
import { IndexedDBAPI } from '../../common/indexedDB/indexedDB';
import { StoreNames } from '../../common/stores/store-names';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { IScanBasePayload, IScanCompletedPayload, IScanUpdatePayload } from '../../injected/analyzers/ianalyzer';
import { SelectTestStepPayload, UpdateVisibilityPayload } from '../actions/action-payloads';
import { AssessmentDataConverter } from '../assessment-data-converter';
import { InitialAssessmentStoreDataGenerator } from '../intial-assessment-store-data-generator';
import { IAssessment } from './../../assessments/types/iassessment';
import {
    IAssessmentData,
    IGeneratedAssessmentInstance,
    ITestStepResult,
    IUserCapturedInstance,
} from '../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from './../../common/types/visualization-type';
import {
    AddFailureInstancePayload,
    AssessmentActionInstancePayload,
    ChangeAssessmentStepStatusPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    EditFailureInstancePayload,
    RemoveFailureInstancePayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
} from './../actions/action-payloads';
import { AssessmentActions } from './../actions/assessment-actions';
import { AssessmentDataRemover } from './../assessment-data-remover';
import { BrowserAdapter } from './../browser-adapter';
import { BaseStore } from './base-store';

export class AssessmentStore extends BaseStore<IAssessmentStoreData> {
    private assessmentActions: AssessmentActions;
    private assessmentDataConverter: AssessmentDataConverter;
    private assessmentDataRemover: AssessmentDataRemover;
    private assessmentsProvider: IAssessmentsProvider;
    private idbInstance: IndexedDBAPI;
    private browserAdapter: BrowserAdapter;
    private persistedData: IAssessmentStoreData;
    private initialAssessmentStoreDataGenerator;

    constructor(
        browserAdapter: BrowserAdapter,
        assessmentActions: AssessmentActions,
        assessmentDataConverter: AssessmentDataConverter,
        assessmentDataRemover: AssessmentDataRemover,
        assessmentsProvider: IAssessmentsProvider,
        idbInstance: IndexedDBAPI,
        persistedData: IAssessmentStoreData,
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

    public generateDefaultState(persistedData: IAssessmentStoreData = null): IAssessmentStoreData {
        this.initialAssessmentStoreDataGenerator = new InitialAssessmentStoreDataGenerator(this.assessmentsProvider);
        return this.initialAssessmentStoreDataGenerator.generateInitalState(persistedData);
    }

    public getDefaultState(): IAssessmentStoreData {
        return this.generateDefaultState(this.persistedData);
    }

    private async persistAssessmentData(assessmentStoreData: IAssessmentStoreData): Promise<boolean> {
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
        this.assessmentActions.selectTestStep.addListener(this.onSelectTestStep);
        this.assessmentActions.changeInstanceStatus.addListener(this.onChangeInstanceStatus);
        this.assessmentActions.changeStepStatus.addListener(this.onChangeStepStatus);
        this.assessmentActions.undoStepStatusChange.addListener(this.onUndoStepStatusChange);
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
    private onTrackingCompleted(payload: IScanBasePayload): void {
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
            const testStepResult: ITestStepResult = assessmentData.generatedAssessmentInstancesMap[key].testStepResults[payload.step];
            if (testStepResult && testStepResult.status === ManualTestStatus.UNKNOWN && testStepResult.originalStatus == null) {
                testStepResult.originalStatus = testStepResult.status;
                testStepResult.status = ManualTestStatus.PASS;
            }
        });

        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.step);
        this.emitChanged();
    }

    @autobind
    private onEditFailureInstance(payload: EditFailureInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const instances = assessmentData.manualTestStepResultMap[payload.step].instances;
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
        assessmentData.manualTestStepResultMap[payload.step].instances = assessmentData.manualTestStepResultMap[
            payload.step
        ].instances.filter(instance => {
            return instance.id !== payload.id;
        });
        this.updateManualTestStepStatus(assessmentData, payload.step, payload.test);

        this.emitChanged();
    }

    @autobind
    private onAddFailureInstance(payload: AddFailureInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const newInstance: IUserCapturedInstance = this.assessmentDataConverter.generateFailureInstance(payload.description);
        assessmentData.manualTestStepResultMap[payload.step].instances.push(newInstance);
        this.updateManualTestStepStatus(assessmentData, payload.step, payload.test);

        this.emitChanged();
    }

    @autobind
    private onChangeAssessmentVisualizationStateForAll(payload: ChangeInstanceSelectionPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentDataMap = config.getAssessmentData(this.state).generatedAssessmentInstancesMap;
        forEach(assessmentDataMap, val => {
            const stepResult = val.testStepResults[payload.step];

            if (stepResult != null) {
                stepResult.isVisualizationEnabled = payload.isVisualizationEnabled;
            }
        });

        this.emitChanged();
    }

    @autobind
    private onChangeStepStatus(payload: ChangeAssessmentStepStatusPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.step].status = payload.status;

        if (payload.status === ManualTestStatus.PASS) {
            assessmentData.manualTestStepResultMap[payload.step].instances = [];
        }

        this.updateManualTestStepStatus(assessmentData, payload.step, payload.test);
        this.emitChanged();
    }

    @autobind
    private onUndoStepStatusChange(payload: ChangeAssessmentStepStatusPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        assessmentData.manualTestStepResultMap[payload.step].status = ManualTestStatus.UNKNOWN;
        assessmentData.manualTestStepResultMap[payload.step].instances = [];
        this.updateManualTestStepStatus(assessmentData, payload.step, payload.test);
        this.emitChanged();
    }

    @autobind
    private onChangeAssessmentVisualizationState(payload: ChangeInstanceSelectionPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: ITestStepResult = assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[payload.step];
        stepResult.isVisualizationEnabled = payload.isVisualizationEnabled;

        this.emitChanged();
    }

    @autobind
    private onUpdateInstanceVisibility(payload: UpdateVisibilityPayload): void {
        const step = this.state.assessmentNavState.selectedTestStep;
        const config = this.assessmentsProvider.forType(this.state.assessmentNavState.selectedTestType).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);

        if (assessmentData.generatedAssessmentInstancesMap == null) {
            return;
        }

        payload.payloadBatch.forEach(payload => {
            const testStepResult: ITestStepResult = assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[step];
            testStepResult.isVisible = payload.isVisible;
        });

        this.emitChanged();
    }

    @autobind
    private onUndoInstanceStatusChange(payload: AssessmentActionInstancePayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: ITestStepResult = assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[payload.step];
        stepResult.status = stepResult.originalStatus;
        stepResult.originalStatus = null;
        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.step);
        this.emitChanged();
    }

    @autobind
    private onChangeInstanceStatus(payload: ChangeInstanceStatusPayload): void {
        const config = this.assessmentsProvider.forType(payload.test).getVisualizationConfiguration();
        const assessmentData = config.getAssessmentData(this.state);
        const stepResult: ITestStepResult = assessmentData.generatedAssessmentInstancesMap[payload.selector].testStepResults[payload.step];
        if (stepResult.originalStatus == null) {
            stepResult.originalStatus = stepResult.status;
        }
        stepResult.status = payload.status;
        this.updateTestStepStatusForGeneratedInstances(assessmentData, payload.step);
        this.emitChanged();
    }

    @autobind
    private onSelectTestStep(payload: SelectTestStepPayload): void {
        this.state.assessmentNavState.selectedTestType = payload.selectedTest;
        this.state.assessmentNavState.selectedTestStep = payload.selectedStep;
        this.emitChanged();
    }

    @autobind
    private onScanCompleted(payload: IScanCompletedPayload<any>): void {
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
    private onScanUpdate(payload: IScanUpdatePayload): void {
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
        this.state.assessmentNavState.selectedTestStep = test.steps[0].key;
        this.emitChanged();
    }

    @autobind
    private onResetAllAssessmentsData(targetTabId: number): void {
        this.state = this.generateDefaultState();
        this.updateTargetTabWithId(targetTabId);
    }

    private getDefaultTestStepForTest(testType: VisualizationType): string {
        return this.assessmentsProvider.forType(testType).steps[0].key;
    }

    private updateTestStepStatusOnScanUpdate(assessmentData: IAssessmentData, testStepName: string, testType: VisualizationType): void {
        const isManual = this.assessmentsProvider.getStep(testType, testStepName).isManual;
        if (isManual !== true) {
            this.updateTestStepStatusForGeneratedInstances(assessmentData, testStepName);
        }
    }

    private getGroupResult(instanceMap: IDictionaryStringTo<IGeneratedAssessmentInstance>, testStepName: string): ManualTestStatus {
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
