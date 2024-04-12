// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentToggleActionPayload,
    BaseActionPayload,
    OnDetailsViewInitializedPayload,
    OnDetailsViewOpenPayload,
    OnDetailsViewPivotSelected,
    SetAllUrlsPermissionStatePayload,
    SwitchToTargetTabPayload,
    ToggleActionPayload,
} from 'background/actions/action-payloads';
import { FeatureFlagPayload } from 'background/actions/feature-flag-actions';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { Messages } from 'common/messages';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { ReportExportServiceKey } from 'report-export/types/report-export-service';
import { Target } from 'scanner/iruleresults';
import { DetailsViewRightContentPanelType } from '../../common/types/store-data/details-view-right-content-panel-type';

const messages = Messages.Visualizations;

export class DetailsViewActionMessageCreator extends DevToolActionMessageCreator {
    public initialize = (detailsViewId: string): void => {
        const messageType = Messages.Visualizations.DetailsView.Initialize;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: OnDetailsViewInitializedPayload = {
            detailsViewId,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    };

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
        selectedServiceKey: ReportExportServiceKey,
        event: React.MouseEvent<HTMLElement>,
    ): void {
        const telemetryData = this.telemetryFactory.forExportedResults(
            reportExportFormat,
            selectedServiceKey,
            event,
            TelemetryEvents.TelemetryEventSource.DetailsView,
        );

        this.dispatcher.sendTelemetry(TelemetryEvents.EXPORT_RESULTS, telemetryData);
    }

    public exportResultsClickedFastPass(
        tabStopRequirementData: TabStopRequirementState,
        wereAutomatedChecksRun: boolean,
        reportExportFormat: ReportExportFormat,
        selectedServiceKey: ReportExportServiceKey,
        event: React.MouseEvent<HTMLElement>,
    ): void {
        const telemetryData = this.telemetryFactory.forExportedResultsWithFastPassData(
            tabStopRequirementData,
            wereAutomatedChecksRun,
            reportExportFormat,
            selectedServiceKey,
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

    public updateFocusedInstanceTarget(instanceTarget: Target): void {
        const payload: Target = instanceTarget;
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

    public sendPivotItemClicked(pivotKey: string, ev?: React.MouseEvent<HTMLElement>): void {
        const telemetry = ev && this.telemetryFactory.forDetailsViewNavPivotActivated(ev, pivotKey);

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

    public enableFastPassVisualHelperWithoutScan(
        test: VisualizationType,
        requirement?: string,
    ): void {
        const payload: ToggleActionPayload | AssessmentToggleActionPayload = {
            test,
            requirement,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Assessment.EnableVisualHelperWithoutScan,
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

    public detailsViewOpened(selectedPivot: DetailsViewPivotType): void {
        const telemetryData = this.telemetryFactory.forDetailsViewOpened(selectedPivot);
        this.dispatcher.sendTelemetry(TelemetryEvents.DETAILS_VIEW_OPEN, telemetryData);
    }

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

    public rescanVisualizationWithoutTelemetry = (
        test: VisualizationType,
        requirement?: string,
    ) => {
        const payload: ToggleActionPayload | AssessmentToggleActionPayload = {
            test: test,
            requirement,
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

    public confirmDataTransferToAssessment = (event: SupportedMouseEvent) => {
        const payload: BaseActionPayload = {
            telemetry: this.telemetryFactory.withTriggeredByAndSource(
                event,
                TelemetryEvents.TelemetryEventSource.DetailsView,
            ),
        };

        const message: Message = {
            messageType: Messages.DataTransfer.InitiateTransferDataToAssessment,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
    };
}
