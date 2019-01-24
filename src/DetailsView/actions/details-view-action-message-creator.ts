// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { IOnDetailsViewPivotSelected, ISelectTestStepPayload } from '../../background/actions/action-payloads';
import { Messages } from '../../common/messages';
import { DevToolActionMessageCreator } from '../../common/message-creators/dev-tool-action-message-creator';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import {
    BaseActionPayload,
    IAddFailureInstancePayload,
    IAssessmentActionInstancePayload,
    IAssessmentToggleActionPayload,
    IChangeAssessmentStepStatusPayload,
    IChangeInstanceSelectionPayload,
    IChangeInstanceStatusPayload,
    IEditFailureInstancePayload,
    IOnDetailsViewOpenPayload,
    IRemoveFailureInstancePayload,
    ISwitchToTargetTabPayLoad,
    IToggleActionPayload,
} from './../../background/actions/action-payloads';
import { IFeatureFlagPayload } from './../../background/actions/feature-flag-actions';
import { TelemetryDataFactory } from './../../common/telemetry-data-factory';
import * as TelemetryEvents from './../../common/telemetry-events';
import { VisualizationType } from './../../common/types/visualization-type';
import { ExportResultType } from './../../common/telemetry-events';
import { DetailsViewRightContentPanelType } from '../components/left-nav/details-view-right-content-panel-type';
import { WindowUtils } from './../../common/window-utils';

const messages = Messages.Visualizations;

export class DetailsViewActionMessageCreator extends DevToolActionMessageCreator {
    private windowUtils: WindowUtils;

    constructor(postMessage: (message: IMessage) => void, tabId: number, telemetryFactory: TelemetryDataFactory, windowUtils: WindowUtils) {
        super(postMessage, tabId, telemetryFactory);
        this.windowUtils = windowUtils;
    }
    public updateIssuesSelectedTargets(selectedTargets: string[]): void {
        const payload: string[] = selectedTargets;
        const message: IMessage = {
            type: messages.Issues.UpdateSelectedTargets,
            tabId: this._tabId,
            payload,
        };

        this.dispatchMessage(message);
    }

    @autobind
    public closePreviewFeaturesPanel(): void {
        const type = Messages.PreviewFeatures.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public closeScopingPanel(): void {
        const type = Messages.Scoping.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public closeSettingsPanel(): void {
        const type = Messages.SettingsPanel.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public setFeatureFlag(featureFlagId: string, enabled: boolean, event: React.MouseEvent<HTMLElement>): void {
        const type = Messages.FeatureFlags.SetFeatureFlag;
        const telemetry = this.telemetryFactory.forFeatureFlagToggle(
            event,
            enabled,
            TelemetryEvents.TelemetryEventSource.DetailsView,
            featureFlagId,
        );
        const payload: IFeatureFlagPayload = {
            feature: featureFlagId,
            enabled: enabled,
            telemetry: telemetry,
        };

        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload: payload,
        });
    }

    public exportResultsClicked(exportResultsType: ExportResultType, exportedHtml: string, event: React.MouseEvent<HTMLElement>): void {
        const telemetryData = this.telemetryFactory.forExportedHtml(
            exportResultsType,
            exportedHtml,
            event,
            TelemetryEvents.TelemetryEventSource.DetailsView,
        );

        this.sendTelemetry(TelemetryEvents.EXPORT_RESULTS, telemetryData);
    }

    @autobind
    public copyIssueDetailsClicked(event: React.MouseEvent<any>): void {
        const telemetryData = this.telemetryFactory.withTriggeredByAndSource(event, TelemetryEvents.TelemetryEventSource.DetailsView);
        this.sendTelemetry(TelemetryEvents.COPY_ISSUE_DETAILS, telemetryData);
    }

    public updateFocusedInstanceTarget(instanceTarget: string[]): void {
        const payload: string[] = instanceTarget;
        const message: IMessage = {
            type: messages.Issues.UpdateFocusedInstance,
            tabId: this._tabId,
            payload,
        };

        this.dispatchMessage(message);
    }

    public selectDetailsView(event: React.MouseEvent<HTMLElement>, type: VisualizationType, pivot: DetailsViewPivotType): void {
        const payload: IOnDetailsViewOpenPayload = {
            telemetry: this.telemetryFactory.forSelectDetailsView(event, type),
            detailsViewType: type,
            pivotType: pivot,
        };

        this.dispatchMessage({
            type: messages.DetailsView.Select,
            tabId: this._tabId,
            payload,
        });
    }

    public selectTestStep(event: React.MouseEvent<HTMLElement>, selectedStep: string, type: VisualizationType): void {
        const payload: ISelectTestStepPayload = {
            telemetry: this.telemetryFactory.forSelectTestStep(event, type, selectedStep),
            selectedStep: selectedStep,
            selectedTest: type,
        };

        this.dispatchMessage({
            type: Messages.Assessment.SelectTestStep,
            tabId: this._tabId,
            payload: payload,
        });
    }

    public sendPivotItemClicked(pivotKey: string, ev?: React.MouseEvent<HTMLElement>): void {
        const telemetry = this.telemetryFactory.forDetailsViewNavPivotActivated(ev, pivotKey);

        const payload: IOnDetailsViewPivotSelected = {
            telemetry: telemetry,
            pivotKey: DetailsViewPivotType[pivotKey],
        };

        this.dispatchMessage({
            type: Messages.Visualizations.DetailsView.PivotSelect,
            tabId: this._tabId,
            payload: payload,
        });
    }

    @autobind
    public switchToTargetTab(event: React.MouseEvent<HTMLElement>): void {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: ISwitchToTargetTabPayLoad = {
            telemetry,
        };
        this.dispatchMessage({
            type: Messages.Tab.Switch,
            tabId: this._tabId,
            payload,
        });
    }

    public startOverAssessment(event: React.MouseEvent<any>, test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.forAssessmentActionFromDetailsView(test, event);
        const payload: IToggleActionPayload = {
            test,
            step,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.StartOver,
            tabId: this._tabId,
            payload,
        });
    }

    public enableVisualHelper(test: VisualizationType, step: string, shouldScan = true, sendTelemetry = true): void {
        const telemetry = sendTelemetry ? this.telemetryFactory.forAssessmentActionFromDetailsViewNoTriggeredBy(test) : null;
        const payload: IAssessmentToggleActionPayload = {
            test,
            step,
            telemetry,
        };

        this.dispatchMessage({
            type: shouldScan ? Messages.Assessment.EnableVisualHelper : Messages.Assessment.EnableVisualHelperWithoutScan,
            tabId: this._tabId,
            payload,
        });
    }

    public disableVisualHelpersForTest(test: VisualizationType): void {
        const payload: IToggleActionPayload = {
            test,
        };

        this.dispatchMessage({
            type: Messages.Assessment.DisableVisualHelperForTest,
            tabId: this._tabId,
            payload,
        });
    }

    public disableVisualHelper(test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.forTestStepFromDetailsView(test, step);
        const payload: IToggleActionPayload = {
            test,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.DisableVisualHelper,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public changeManualTestStatus(status: ManualTestStatus, test: VisualizationType, step: string, selector: string): void {
        const telemetry = this.telemetryFactory.forTestStepFromDetailsView(test, step);
        const payload: IChangeInstanceStatusPayload = {
            test,
            step,
            status,
            selector,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.ChangeStatus,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public changeManualTestStepStatus(status: ManualTestStatus, test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.forTestStepFromDetailsView(test, step);
        const payload: IChangeAssessmentStepStatusPayload = {
            test,
            step,
            status,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.ChangeStepStatus,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public undoManualTestStatusChange(test: VisualizationType, step: string, selector: string): void {
        const telemetry = this.telemetryFactory.forTestStepFromDetailsView(test, step);
        const payload: IAssessmentActionInstancePayload = {
            test,
            step,
            selector,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.Undo,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public undoManualTestStepStatusChange(test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: IChangeAssessmentStepStatusPayload = {
            test: test,
            step: step,
            telemetry: telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.UndoChangeStepStatus,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public changeAssessmentVisualizationState(
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        step: string,
        selector: string,
    ): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: IChangeInstanceSelectionPayload = {
            test,
            step,
            isVisualizationEnabled,
            selector,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.ChangeVisualizationState,
            tabId: this._tabId,
            payload,
        });
    }

    public addFailureInstance(description: string, test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.forTestStepFromDetailsView(test, step);
        const payload: IAddFailureInstancePayload = {
            test,
            step,
            description,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.AddFailureInstance,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public removeFailureInstance(test: VisualizationType, step: string, id: string): void {
        const telemetry = this.telemetryFactory.forTestStepFromDetailsView(test, step);
        const payload: IRemoveFailureInstancePayload = {
            test,
            step,
            id,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.RemoveFailureInstance,
            tabId: this._tabId,
            payload,
        });
    }

    public detailsViewOpened(selectedPivot: DetailsViewPivotType): void {
        const telemetryData = this.telemetryFactory.forDetailsViewOpened(selectedPivot);
        this.sendTelemetryExcludingUrl(TelemetryEvents.DETAILS_VIEW_OPEN, telemetryData);
    }

    @autobind
    public editFailureInstance(description: string, test: VisualizationType, step: string, id: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: IEditFailureInstancePayload = {
            test,
            step,
            id,
            description,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.EditFailureInstance,
            tabId: this._tabId,
            payload,
        });
    }

    public passUnmarkedInstances(test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: IToggleActionPayload = {
            test,
            step,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.PassUnmarkedInstances,
            tabId: this._tabId,
            payload,
        });
    }

    public changeAssessmentVisualizationStateForAll(isVisualizationEnabled: boolean, test: VisualizationType, step: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: IChangeInstanceSelectionPayload = {
            test: test,
            step: step,
            isVisualizationEnabled: isVisualizationEnabled,
            selector: null,
            telemetry: telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.ChangeVisualizationStateForAll,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public continuePreviousAssessment(event: React.MouseEvent<any>): void {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatchMessage({
            type: Messages.Assessment.ContinuePreviousAssessment,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public startOverAllAssessments(event: React.MouseEvent<any>): void {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatchMessage({
            type: Messages.Assessment.StartOverAllAssessments,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public cancelStartOver(event: React.MouseEvent<any>, test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.forCancelStartOver(event, test, requirement);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatchMessage({
            type: Messages.Assessment.CancelStartOver,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public cancelStartOverAllAssessments(event: React.MouseEvent<any>): void {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatchMessage({
            type: Messages.Assessment.CancelStartOverAllAssessments,
            tabId: this._tabId,
            payload,
        });
    }

    public changeRightContentPanel(viewType: DetailsViewRightContentPanelType): void {
        const payload: DetailsViewRightContentPanelType = viewType;
        const message = {
            tabId: this._tabId,
            type: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: payload,
        };

        this.dispatchMessage(message);
    }
}
