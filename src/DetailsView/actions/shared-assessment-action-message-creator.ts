// Copyright (c) Microsoft Corporation. All rights reserved.

import {
    SelectTestSubviewPayload,
    SelectGettingStartedPayload,
    ExpandTestNavPayload,
    ToggleActionPayload,
    AssessmentToggleActionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    AssessmentActionInstancePayload,
    ChangeInstanceSelectionPayload,
    AddResultDescriptionPayload,
    AddFailureInstancePayload,
    RemoveFailureInstancePayload,
    EditFailureInstancePayload,
    BaseActionPayload,
    LoadAssessmentPayload,
} from 'background/actions/action-payloads';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { Messages } from 'common/messages';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';

// Licensed under the MIT License.
export class SharedAssessmentActionMessageCreator extends DevToolActionMessageCreator {
    public selectRequirement(
        event: React.MouseEvent<HTMLElement>,
        selectedRequirement: string,
        visualizationType: VisualizationType,
        messageType: string,
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
            messageType: messageType,
            payload: payload,
        });
    }

    public selectNextRequirement(
        event: React.MouseEvent<HTMLElement>,
        nextRequirement: string,
        visualizationType: VisualizationType,
        messageType: string,
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
            messageType,
            payload: payload,
        });
    }

    public selectGettingStarted(
        event: React.MouseEvent<HTMLElement>,
        visualizationType: VisualizationType,
        messageType: string,
    ): void {
        const payload: SelectGettingStartedPayload = {
            telemetry: this.telemetryFactory.forSelectGettingStarted(event, visualizationType),
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload: payload,
        });
    }

    public expandTestNav(visualizationType: VisualizationType, messageType: string): void {
        const payload: ExpandTestNavPayload = {
            selectedTest: visualizationType,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload: payload,
        });
    }

    public collapseTestNav(messageType: string): void {
        this.dispatcher.dispatchMessage({
            messageType,
        });
    }

    public startOverTest(
        event: SupportedMouseEvent,
        test: VisualizationType,
        messageType: string,
    ): void {
        const telemetry = this.telemetryFactory.forAssessmentActionFromDetailsView(test, event);
        const payload: ToggleActionPayload = {
            test,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public enableVisualHelper(
        test: VisualizationType,
        requirement: string,
        sendTelemetry = true,
        messageType: string,
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
            messageType,
            payload,
        });
    }

    public disableVisualHelpersForTest(test: VisualizationType, messageType: string): void {
        const payload: ToggleActionPayload = {
            test,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public disableVisualHelper(
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ToggleActionPayload = {
            test,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public changeManualTestStatus = (
        status: ManualTestStatus,
        test: VisualizationType,
        requirement: string,
        selector: string,
        messageType: string,
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
            messageType,
            payload,
        });
    };

    public changeManualRequirementStatus = (
        status: ManualTestStatus,
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: ChangeRequirementStatusPayload = {
            test,
            requirement,
            status,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public undoManualTestStatusChange = (
        test: VisualizationType,
        requirement: string,
        selector: string,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: AssessmentActionInstancePayload = {
            test,
            requirement,
            selector,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public undoManualRequirementStatusChange = (
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ChangeRequirementStatusPayload = {
            test: test,
            requirement: requirement,
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public changeAssessmentVisualizationState = (
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
        selector: string,
        messageType: string,
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
            messageType,
            payload,
        });
    };

    public addResultDescription(description: string, messageType: string): void {
        const payload: AddResultDescriptionPayload = {
            description,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public addFailureInstance(
        instanceData: FailureInstanceData,
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: AddFailureInstancePayload = {
            test,
            requirement,
            instanceData,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public removeFailureInstance = (
        test: VisualizationType,
        requirement: string,
        id: string,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.forRequirementFromDetailsView(test, requirement);
        const payload: RemoveFailureInstancePayload = {
            test,
            requirement,
            id,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public editFailureInstance = (
        instanceData: FailureInstanceData,
        test: VisualizationType,
        requirement: string,
        id: string,
        messageType: string,
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
            messageType,
            payload,
        });
    };

    public passUnmarkedInstances(
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: ToggleActionPayload = {
            test,
            requirement,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public changeAssessmentVisualizationStateForAll(
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void {
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
        const payload: Omit<ChangeInstanceSelectionPayload, 'selector'> = {
            test: test,
            requirement: requirement,
            isVisualizationEnabled: isVisualizationEnabled,
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    public continuePreviousAssessment = (
        event: React.MouseEvent<any>,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public loadAssessment = (
        assessmentData: VersionedAssessmentData,
        tabId: number,
        detailsViewId: string,
        messageType: string,
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
            messageType,
            payload,
        });
    };

    public saveAssessment = (event: React.MouseEvent<any>, messageType: string): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public startOverAllAssessments = (event: React.MouseEvent<any>, messageType: string): void => {
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
            messageType,
            payload: startOverAllAssessmentsActionPayload,
        });
    };

    public cancelStartOver = (
        event: React.MouseEvent<any>,
        test: VisualizationType,
        requirement: string,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.forCancelStartOver(event, test, requirement);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };

    public cancelStartOverAllAssessments = (
        event: React.MouseEvent<any>,
        messageType: string,
    ): void => {
        const telemetry = this.telemetryFactory.fromDetailsView(event);
        const payload: BaseActionPayload = {
            telemetry: telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    };
}
