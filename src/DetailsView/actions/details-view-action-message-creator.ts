// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    AssessmentActionInstancePayload,
    AssessmentToggleActionPayload,
    BaseActionPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    ExpandTestNavPayload,
    OnDetailsViewOpenPayload,
    OnDetailsViewPivotSelected,
    RemoveFailureInstancePayload,
    SelectGettingStartedPayload,
    SelectTestSubviewPayload,
    SetAllUrlsPermissionStatePayload,
    SwitchToTargetTabPayload,
    ToggleActionPayload,
    LoadAssessmentPayload,
} from 'background/actions/action-payloads';
import { FeatureFlagPayload } from 'background/actions/feature-flag-actions';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { Messages } from 'common/messages';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { DetailsViewRightContentPanelType } from '../components/left-nav/details-view-right-content-panel-type';

const messages = Messages.Visualizations;

export class DetailsViewActionMessageCreator extends DevToolActionMessageCreator {
    public closePreviewFeaturesPanel = (): void => {
        const messageType = Messages.PreviewFeatures.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    };

    public closeScopingPanel = (): void => {
        const messageType = Messages.Scoping.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    };

    public closeSettingsPanel = (): void => {
        const messageType = Messages.SettingsPanel.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    };

    public setFeatureFlag = (
        featureFlagId: string,
        enabled: boolean,
        event: React.MouseEvent<HTMLElement>,
    ): void => {
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

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload: payload,
        });
    };

    public exportResultsClicked(
        reportExportFormat: ReportExportFormat,
        exportedHtml: string,
        event: React.MouseEvent<HTMLElement>,
    ): void {
        const telemetryData = this.telemetryFactory.forExportedHtml(
            reportExportFormat,
            exportedHtml,
            event,
            TelemetryEvents.TelemetryEventSource.DetailsView,
        );

        this.dispatcher.sendTelemetry(TelemetryEvents.EXPORT_RESULTS, telemetryData);
    }

    public copyIssueDetailsClicked = (event: SupportedMouseEvent): void => {
        const telemetryData = this.telemetryFactory.withTriggeredByAndSource(
            event,
            TelemetryEvents.TelemetryEventSource.DetailsView,
        );
        this.dispatcher.sendTelemetry(TelemetryEvents.COPY_ISSUE_DETAILS, telemetryData);
    };

    public updateFocusedInstanceTarget(instanceTarget: string[]): void {
        const payload: string[] = instanceTarget;
        const message: Message = {
            messageType: messages.Issues.UpdateFocusedInstance,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
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

        this.dispatcher.dispatchMessage({
            messageType: messages.DetailsView.Select,
            payload,
        });
    }

    public selectRequirement(
        event: React.MouseEvent<HTMLElement>,
        selectedRequirement: string,
        visualizationType: VisualizationType,
    ): void {
        const payload: SelectTestSubviewPayload = {
            telemetry: this.telemetryFactory.forSelectRequirement(
                event,
                visualizationType,
                selectedRequirement,
            ),
            selectedTestSubview: selectedRequirement,
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.SelectTestRequirement,
            payload: payload,
        });
    }

    public selectNextRequirement(
        event: React.MouseEvent<HTMLElement>,
        nextRequirement: string,
        visualizationType: VisualizationType,
    ): void {
        const payload: SelectTestSubviewPayload = {
            telemetry: this.telemetryFactory.forSelectRequirement(
                event,
                visualizationType,
                nextRequirement,
            ),
            selectedTestSubview: nextRequirement,
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.SelectNextRequirement,
            payload: payload,
        });
    }

    public selectGettingStarted(
        event: React.MouseEvent<HTMLElement>,
        visualizationType: VisualizationType,
    ): void {
        const payload: SelectGettingStartedPayload = {
            telemetry: this.telemetryFactory.forSelectGettingStarted(event, visualizationType),
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.SelectGettingStarted,
            payload: payload,
        });
    }

    public expandTestNav(visualizationType: VisualizationType): void {
        const payload: ExpandTestNavPayload = {
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.ExpandTestNav,
            payload: payload,
        });
    }

    public collapseTestNav(): void {
        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.CollapseTestNav,
        });
    }

    public sendPivotItemClicked(pivotKey: string, ev?: React.MouseEvent<HTMLElement>): void {
        const telemetry = this.telemetryFactory.forDetailsViewNavPivotActivated(ev, pivotKey);

        const payload: OnDetailsViewPivotSelected = {
            telemetry: telemetry,
            pivotKey: DetailsViewPivotType[pivotKey],
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.DetailsView.PivotSelect,
            payload: payload,
        });
    }

    public switchToTargetTab = (event: React.MouseEvent<HTMLElement>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: SwitchToTargetTabPayload = {
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Tab.Switch,
            payload,
        });
    };

    public startOverTest(event: SupportedMouseEvent, test: VisualizationType): void {
        const telemetry = this.telemetryFactory.forAssessmentActionFromDetailsView(test, event);
        const payload: ToggleActionPayload = {
            test,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.StartOverTest,
            payload,
        });
    }

    public enableVisualHelper(
        test: VisualizationType,
        requirement: string,
        shouldScan = true,
        sendTelemetry = true,
    ): void {
        const telemetry = sendTelemetry
            ? this.telemetryFactory.forAssessmentActionFromDetailsViewNoTriggeredBy(test)
            : undefined;
        const payload: AssessmentToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: shouldScan
                ? Messages.Assessment.EnableVisualHelper
                : Messages.Assessment.EnableVisualHelperWithoutScan,
            payload,
        });
    }

    public disableVisualHelpersForTest(test: VisualizationType): void {
        const payload: ToggleActionPayload = {
            test,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.DisableVisualHelperForTest,
            payload,
        });
    }

    public disableVisualHelper(test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ToggleActionPayload = {
            test,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.DisableVisualHelper,
            payload,
        });
    }

    public changeManualTestStatus = (
        status: ManualTestStatus,
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ChangeInstanceStatusPayload = {
            test,
            requirement,
            status,
            selector,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.ChangeStatus,
            payload,
        });
    };

    public changeManualRequirementStatus = (
        status: ManualTestStatus,
        test: VisualizationType,
        requirement: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ChangeRequirementStatusPayload = {
            test,
            requirement,
            status,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.ChangeRequirementStatus,
            payload,
        });
    };

    public undoManualTestStatusChange = (
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: AssessmentActionInstancePayload = {
            test,
            requirement,
            selector,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.Undo,
            payload,
        });
    };

    public undoManualRequirementStatusChange = (
        test: VisualizationType,
        requirement: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ChangeRequirementStatusPayload = {
            test: test,
            requirement: requirement,
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.UndoChangeRequirementStatus,
            payload,
        });
    };

    public changeAssessmentVisualizationState = (
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ChangeInstanceSelectionPayload = {
            test,
            requirement,
            isVisualizationEnabled,
            selector,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.ChangeVisualizationState,
            payload,
        });
    };

    public addResultDescription(description: string): void {
        const payload: AddResultDescriptionPayload = {
            description,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.AddResultDescription,
            payload,
        });
    }

    public addPathForValidation = (path: string) => {
        const payload = path;

        this.dispatcher.dispatchMessage({
            messageType: Messages.PathSnippet.AddPathForValidation,
            payload,
        });
    };

    public clearPathSnippetData = () => {
        this.dispatcher.dispatchMessage({
            messageType: Messages.PathSnippet.ClearPathSnippetData,
        });
    };

    public addFailureInstance(
        instanceData: FailureInstanceData,
        test: VisualizationType,
        requirement: string,
    ): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: AddFailureInstancePayload = {
            test,
            requirement,
            instanceData,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.AddFailureInstance,
            payload,
        });
    }

    public removeFailureInstance = (
        test: VisualizationType,
        requirement: string,
        id: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: RemoveFailureInstancePayload = {
            test,
            requirement,
            id,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.RemoveFailureInstance,
            payload,
        });
    };

    public detailsViewOpened(selectedPivot: DetailsViewPivotType): void {
        const telemetryData = this.telemetryFactory.forDetailsViewOpened(selectedPivot);
        this.dispatcher.sendTelemetry(TelemetryEvents.DETAILS_VIEW_OPEN, telemetryData);
    }

    public editFailureInstance = (
        instanceData: FailureInstanceData,
        test: VisualizationType,
        requirement: string,
        id: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: EditFailureInstancePayload = {
            test,
            requirement,
            id,
            instanceData,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.EditFailureInstance,
            payload,
        });
    };

    public passUnmarkedInstances(test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.PassUnmarkedInstances,
            payload,
        });
    }

    public changeAssessmentVisualizationStateForAll(
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
    ): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: Omit<ChangeInstanceSelectionPayload, 'selector'> = {
            test: test,
            requirement: requirement,
            isVisualizationEnabled: isVisualizationEnabled,
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.ChangeVisualizationStateForAll,
            payload,
        });
    }

    public continuePreviousAssessment = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.ContinuePreviousAssessment,
            payload,
        });
    };

    public loadAssessment = (assessmentData: VersionedAssessmentData, tabId: number): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: LoadAssessmentPayload = {
            telemetry: telemetry,
            versionedAssessmentData: assessmentData,
            tabId,
        };
        const setDetailsViewRightContentPanelPayload: DetailsViewRightContentPanelType = 'Overview';
        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: setDetailsViewRightContentPanelPayload,
        });
        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.LoadAssessment,
            payload,
        });
    };

    public saveAssessment = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.SaveAssessment,
            payload,
        });
    };

    public startOverAllAssessments = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const setDetailsViewRightContentPanelPayload: DetailsViewRightContentPanelType = 'Overview';
        const startOverAllAssessmentsActionPayload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: setDetailsViewRightContentPanelPayload,
        });
        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.StartOverAllAssessments,
            payload: startOverAllAssessmentsActionPayload,
        });
    };

    public cancelStartOver = (
        event: React.MouseEvent<any>,
        test: VisualizationType,
        requirement: string,
    ): void => {
        const telemetry = this.telemetryFactory.forCancelStartOver(event, test, requirement);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.CancelStartOver,
            payload,
        });
    };

    public cancelStartOverAllAssessments = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.CancelStartOverAllAssessments,
            payload,
        });
    };

    public changeRightContentPanel(viewType: DetailsViewRightContentPanelType): void {
        const payload: DetailsViewRightContentPanelType = viewType;
        const message = {
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: payload,
        };

        this.dispatcher.dispatchMessage(message);
    }

    public rescanVisualization = (test: VisualizationType, event: SupportedMouseEvent) => {
        const payload: ToggleActionPayload = {
            test: test,
            telemetry: this.telemetryFactory.withTriggeredByAndSource(
                event,
                TelemetryEvents.TelemetryEventSource.DetailsView,
            ),
        };

        const message: Message = {
            messageType: Messages.Visualizations.Common.RescanVisualization,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
    };

    public setAllUrlsPermissionState = (
        event: SupportedMouseEvent,
        hasAllUrlAndFilePermissions: boolean,
    ) => {
        const payload: SetAllUrlsPermissionStatePayload = {
            hasAllUrlAndFilePermissions,
            telemetry: this.telemetryFactory.forSetAllUrlPermissionState(
                event,
                TelemetryEvents.TelemetryEventSource.DetailsView,
                hasAllUrlAndFilePermissions,
            ),
        };

        const message: Message = {
            messageType: Messages.PermissionsState.SetPermissionsState,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
    };

    public leftNavPanelExpanded = (event: SupportedMouseEvent) => {
        this.dispatcher.sendTelemetry(
            TelemetryEvents.LEFT_NAV_PANEL_EXPANDED,
            this.telemetryFactory.forLeftNavPanelExpanded(event),
        );
    };
}
