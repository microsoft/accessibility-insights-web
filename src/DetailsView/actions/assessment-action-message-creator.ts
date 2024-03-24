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
    RemoveFailureInstancePayload,
    SelectGettingStartedPayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
} from 'background/actions/action-payloads';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { AssessmentMessages, Messages } from 'common/messages';
import { SupportedMouseEvent, TelemetryDataFactory } from 'common/telemetry-data-factory';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { DetailsViewRightContentPanelType } from '../../common/types/store-data/details-view-right-content-panel-type';

export class AssessmentActionMessageCreator extends DevToolActionMessageCreator {
    constructor(
        protected readonly telemetryFactory: TelemetryDataFactory,
        protected readonly dispatcher: ActionMessageDispatcher,
        protected readonly messages: AssessmentMessages,
    ) {
        super(telemetryFactory, dispatcher);
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
            messageType: this.messages.SelectTestRequirement,
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
            messageType: this.messages.SelectNextRequirement,
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
            messageType: this.messages.SelectGettingStarted,
            payload: payload,
        });
    }

    public expandTestNav(visualizationType: VisualizationType): void {
        const payload: ExpandTestNavPayload = {
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.ExpandTestNav,
            payload: payload,
        });
    }

    public collapseTestNav(): void {
        this.dispatcher.dispatchMessage({
            messageType: this.messages.CollapseTestNav,
        });
    }

    public startOverTest(event: SupportedMouseEvent, test: VisualizationType): void {
        const telemetry = this.telemetryFactory.forAssessmentActionFromDetailsView(test, event);
        const payload: ToggleActionPayload = {
            test,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.StartOverTest,
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
                ? this.messages.EnableVisualHelper
                : this.messages.EnableVisualHelperWithoutScan,
            payload,
        });
    }

    public disableVisualHelpersForTest(test: VisualizationType): void {
        const payload: ToggleActionPayload = {
            test,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.DisableVisualHelperForTest,
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
            messageType: this.messages.DisableVisualHelper,
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
            messageType: this.messages.ChangeStatus,
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
            messageType: this.messages.ChangeRequirementStatus,
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
            messageType: this.messages.Undo,
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
            messageType: this.messages.UndoChangeRequirementStatus,
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
            messageType: this.messages.ChangeVisualizationState,
            payload,
        });
    };

    public addResultDescription(description: string): void {
        const payload: AddResultDescriptionPayload = {
            description,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.AddResultDescription,
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
            messageType: this.messages.AddFailureInstance,
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
            messageType: this.messages.RemoveFailureInstance,
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
            messageType: this.messages.EditFailureInstance,
            payload,
        });
    };

    public passUnmarkedInstances(test: VisualizationType, requirement: string): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: AssessmentToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.PassUnmarkedInstances,
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
            messageType: this.messages.ChangeVisualizationStateForAll,
            payload,
        });
    }

    public continuePreviousAssessment = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: this.messages.ContinuePreviousAssessment,
            payload,
        });
    };

    public loadAssessment = (
        assessmentData: VersionedAssessmentData,
        tabId: number,
        detailsViewId: string | undefined,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: LoadAssessmentPayload = {
            telemetry: telemetry,
            versionedAssessmentData: assessmentData,
            tabId,
            detailsViewId: detailsViewId,
        };
        const setDetailsViewRightContentPanelPayload: DetailsViewRightContentPanelType = 'Overview';
        this.dispatcher.dispatchMessage({
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: setDetailsViewRightContentPanelPayload,
        });
        this.dispatcher.dispatchMessage({
            messageType: this.messages.LoadAssessment,
            payload,
        });
    };

    public saveAssessment = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.SaveAssessment,
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
            messageType: this.messages.StartOverAllAssessments,
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
            messageType: this.messages.CancelStartOver,
            payload,
        });
    };

    public cancelStartOverAllAssessments = (event: React.MouseEvent<any>): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: this.messages.CancelStartOverAllAssessments,
            payload,
        });
    };
}
