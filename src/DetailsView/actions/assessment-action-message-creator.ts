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
    LoadAssessmentPayload,
    OnDetailsViewInitializedPayload,
    RemoveFailureInstancePayload,
    SelectGettingStartedPayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
} from 'background/actions/action-payloads';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { ReportExportFormat } from 'common/extension-telemetry-events';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { Messages } from 'common/messages';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { ReportExportServiceKey } from 'report-export/types/report-export-service';
import { DetailsViewRightContentPanelType } from '../../common/types/store-data/details-view-right-content-panel-type';

export class AssessmentActionMessageCreator extends DevToolActionMessageCreator {
    public initialize = (detailsViewId: string): void => {
        const messageType = Messages.Visualizations.Assessment.Initialize;
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

    public loadAssessment = (
        assessmentData: VersionedAssessmentData,
        tabId: number,
        detailsViewId: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: LoadAssessmentPayload = {
            telemetry: telemetry,
            versionedAssessmentData: assessmentData,
            tabId,
            detailsViewId,
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
}
