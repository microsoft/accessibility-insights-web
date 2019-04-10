// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import {
    AddFailureInstancePayload,
    AssessmentActionInstancePayload,
    AssessmentToggleActionPayload,
    BaseActionPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    OnDetailsViewOpenPayload,
    OnDetailsViewPivotSelected,
    RemoveFailureInstancePayload,
    SelectRequirementPayload,
    SwitchToTargetTabPayload,
    ToggleActionPayload,
} from '../../background/actions/action-payloads';
import { FeatureFlagPayload } from '../../background/actions/feature-flag-actions';
import { Message } from '../../common/message';
import { DevToolActionMessageCreator } from '../../common/message-creators/dev-tool-action-message-creator';
import { Messages } from '../../common/messages';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import * as TelemetryEvents from '../../common/telemetry-events';
import { ExportResultType } from '../../common/telemetry-events';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import { WindowUtils } from '../../common/window-utils';
import { DetailsViewRightContentPanelType } from '../components/left-nav/details-view-right-content-panel-type';

const messages = Messages.Visualizations;

export class DetailsViewActionMessageCreator extends DevToolActionMessageCreator {
    private windowUtils: WindowUtils;

    constructor(postMessage: (message: Message) => void, tabId: number, telemetryFactory: TelemetryDataFactory, windowUtils: WindowUtils) {
        super(postMessage, tabId, telemetryFactory);
        this.windowUtils = windowUtils;
    }
    public updateIssuesSelectedTargets(selectedTargets: string[]): void {
        const payload: string[] = selectedTargets;
        const message: Message = {
            type: messages.Issues.UpdateSelectedTargets,
            tabId: this._tabId,
            payload,
        };

        this.dispatchMessage(message);
    }

    @autobind
    public closePreviewFeaturesPanel(): void {
        const messageType = Messages.PreviewFeatures.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public closeScopingPanel(): void {
        const messageType = Messages.Scoping.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public closeSettingsPanel(): void {
        const messageType = Messages.SettingsPanel.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public setFeatureFlag(featureFlagId: string, enabled: boolean, event: React.MouseEvent<HTMLElement>): void {
        const messageType = Messages.FeatureFlags.SetFeatureFlag;
        const telemetry = this.telemetryFactory.forFeatureFlagToggle(
            event,
            enabled,
            TelemetryEvents.TelemetryEventSource.DetailsView,
            featureFlagId,
        );
        const payload: FeatureFlagPayload = {
            feature: featureFlagId,
            enabled: enabled,
            telemetry: telemetry,
        };

        this.dispatchMessage({
            type: messageType,
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
        const message: Message = {
            type: messages.Issues.UpdateFocusedInstance,
            tabId: this._tabId,
            payload,
        };

        this.dispatchMessage(message);
    }

    public selectDetailsView(
        event: React.MouseEvent<HTMLElement>,
        visualizationType: VisualizationType,
        pivot: DetailsViewPivotType,
    ): void {
        const payload: OnDetailsViewOpenPayload = {
            telemetry: this.telemetryFactory.forSelectDetailsView(event, visualizationType),
            detailsViewType: visualizationType,
            pivotType: pivot,
        };

        this.dispatchMessage({
            type: messages.DetailsView.Select,
            tabId: this._tabId,
            payload,
        });
    }

    public selectRequirement(
        event: React.MouseEvent<HTMLElement>,
        selectedRequirement: string,
        visualizationType: VisualizationType,
    ): void {
        const payload: SelectRequirementPayload = {
            telemetry: this.telemetryFactory.forSelectRequirement(event, visualizationType, selectedRequirement),
            selectedRequirement: selectedRequirement,
            selectedTest: visualizationType,
        };

        this.dispatchMessage({
            type: Messages.Assessment.SelectTestRequirement,
            tabId: this._tabId,
            payload: payload,
        });
    }

    public sendPivotItemClicked(pivotKey: string, ev?: React.MouseEvent<HTMLElement>): void {
        const telemetry = this.telemetryFactory.forDetailsViewNavPivotActivated(ev, pivotKey);

        const payload: OnDetailsViewPivotSelected = {
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
        const payload: SwitchToTargetTabPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: Messages.Tab.Switch,
            tabId: this._tabId,
            payload,
        });
    }

    public startOverAssessment(event: React.MouseEvent<any>, test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.forAssessmentActionFromDetailsView(test, event);
        const payload: ToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.StartOver,
            tabId: this._tabId,
            payload,
        });
    }

    public enableVisualHelper(test: VisualizationType, requirement: string, shouldScan = true, sendTelemetry = true): void {
        const telemetry = sendTelemetry ? this.telemetryFactory.forAssessmentActionFromDetailsViewNoTriggeredBy(test) : null;
        const payload: AssessmentToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatchMessage({
            type: shouldScan ? Messages.Assessment.EnableVisualHelper : Messages.Assessment.EnableVisualHelperWithoutScan,
            tabId: this._tabId,
            payload,
        });
    }

    public disableVisualHelpersForTest(test: VisualizationType): void {
        const payload: ToggleActionPayload = {
            test,
        };

        this.dispatchMessage({
            type: Messages.Assessment.DisableVisualHelperForTest,
            tabId: this._tabId,
            payload,
        });
    }

    public disableVisualHelper(test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ToggleActionPayload = {
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
    public changeManualTestStatus(status: ManualTestStatus, test: VisualizationType, requirement: string, selector: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ChangeInstanceStatusPayload = {
            test,
            requirement,
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
    public changeManualRequirementStatus(status: ManualTestStatus, test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ChangeRequirementStatusPayload = {
            test,
            requirement,
            status,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.ChangeRequirementStatus,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public undoManualTestStatusChange(test: VisualizationType, requirement: string, selector: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: AssessmentActionInstancePayload = {
            test,
            requirement,
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
    public undoManualRequirementStatusChange(test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ChangeRequirementStatusPayload = {
            test: test,
            requirement: requirement,
            telemetry: telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.UndoChangeRequirementStatus,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public changeAssessmentVisualizationState(
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ChangeInstanceSelectionPayload = {
            test,
            requirement,
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

    public addFailureInstance(description: string, test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: AddFailureInstancePayload = {
            test,
            requirement,
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
    public removeFailureInstance(test: VisualizationType, requirement: string, id: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: RemoveFailureInstancePayload = {
            test,
            requirement,
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
        this.sendTelemetry(TelemetryEvents.DETAILS_VIEW_OPEN, telemetryData);
    }

    @autobind
    public editFailureInstance(description: string, test: VisualizationType, requirement: string, id: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: EditFailureInstancePayload = {
            test,
            requirement,
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

    public passUnmarkedInstances(test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatchMessage({
            type: Messages.Assessment.PassUnmarkedInstances,
            tabId: this._tabId,
            payload,
        });
    }

    public changeAssessmentVisualizationStateForAll(isVisualizationEnabled: boolean, test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ChangeInstanceSelectionPayload = {
            test: test,
            requirement: requirement,
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
