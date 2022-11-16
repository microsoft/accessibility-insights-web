// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import { SharedAssessmentActionMessageCreator } from 'DetailsView/actions/shared-assessment-action-message-creator';
import * as React from 'react';

export class AssessmentActionMessageCreator {
    private sharedAssessmentActionMessageCreator: SharedAssessmentActionMessageCreator;

    constructor(sharedAssessmentActionMessageCreator: SharedAssessmentActionMessageCreator) {
        this.sharedAssessmentActionMessageCreator = sharedAssessmentActionMessageCreator;
    }
    public selectRequirement(
        event: React.MouseEvent<HTMLElement>,
        selectedRequirement: string,
        visualizationType: VisualizationType,
    ): void {
        const messageType = Messages.Assessment.SelectTestRequirement;
        this.sharedAssessmentActionMessageCreator.selectRequirement(
            event,
            selectedRequirement,
            visualizationType,
            messageType,
        );
    }

    public selectNextRequirement(
        event: React.MouseEvent<HTMLElement>,
        nextRequirement: string,
        visualizationType: VisualizationType,
    ): void {
        const messageType = Messages.Assessment.SelectNextRequirement;
        this.sharedAssessmentActionMessageCreator.selectNextRequirement(
            event,
            nextRequirement,
            visualizationType,
            messageType,
        );
    }

    public selectGettingStarted(
        event: React.MouseEvent<HTMLElement>,
        visualizationType: VisualizationType,
    ): void {
        const messageType = Messages.Assessment.SelectGettingStarted;
        this.sharedAssessmentActionMessageCreator.selectGettingStarted(
            event,
            visualizationType,
            messageType,
        );
    }

    public expandTestNav(visualizationType: VisualizationType): void {
        const messageType = Messages.Assessment.ExpandTestNav;
        this.sharedAssessmentActionMessageCreator.expandTestNav(visualizationType, messageType);
    }

    public collapseTestNav(): void {
        const messageType = Messages.Assessment.CollapseTestNav;
        this.sharedAssessmentActionMessageCreator.collapseTestNav(messageType);
    }

    public startOverTest(event: SupportedMouseEvent, test: VisualizationType): void {
        const messageType = Messages.Assessment.StartOverTest;
        this.sharedAssessmentActionMessageCreator.startOverTest(event, test, messageType);
    }

    public enableVisualHelper(
        test: VisualizationType,
        requirement: string,
        shouldScan = true,
        sendTelemetry = true,
    ): void {
        const messageType = shouldScan
            ? Messages.Assessment.EnableVisualHelper
            : Messages.Assessment.EnableVisualHelperWithoutScan;
        this.sharedAssessmentActionMessageCreator.enableVisualHelper(
            test,
            requirement,
            sendTelemetry,
            messageType,
        );
    }

    public disableVisualHelpersForTest(test: VisualizationType): void {
        const messageType = Messages.Assessment.DisableVisualHelperForTest;
        this.sharedAssessmentActionMessageCreator.disableVisualHelpersForTest(test, messageType);
    }

    public disableVisualHelper(test: VisualizationType, requirement: string): void {
        const messageType = Messages.Assessment.DisableVisualHelper;
        this.sharedAssessmentActionMessageCreator.disableVisualHelper(
            test,
            requirement,
            messageType,
        );
    }

    public changeManualTestStatus = (
        status: ManualTestStatus,
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void => {
        const messageType = Messages.Assessment.ChangeStatus;
        this.sharedAssessmentActionMessageCreator.changeManualTestStatus(
            status,
            test,
            requirement,
            selector,
            messageType,
        );
    };

    public changeManualRequirementStatus = (
        status: ManualTestStatus,
        test: VisualizationType,
        requirement: string,
    ): void => {
        const messageType = Messages.Assessment.ChangeRequirementStatus;
        this.sharedAssessmentActionMessageCreator.changeManualRequirementStatus(
            status,
            test,
            requirement,
            messageType,
        );
    };

    public undoManualTestStatusChange = (
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void => {
        const messageType = Messages.Assessment.Undo;
        this.sharedAssessmentActionMessageCreator.undoManualTestStatusChange(
            test,
            requirement,
            selector,
            messageType,
        );
    };

    public undoManualRequirementStatusChange = (
        test: VisualizationType,
        requirement: string,
    ): void => {
        const messageType = Messages.Assessment.UndoChangeRequirementStatus;
        this.sharedAssessmentActionMessageCreator.undoManualRequirementStatusChange(
            test,
            requirement,
            messageType,
        );
    };

    public changeAssessmentVisualizationState = (
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
        selector: string,
    ): void => {
        const messageType = Messages.Assessment.ChangeVisualizationState;
        this.sharedAssessmentActionMessageCreator.changeAssessmentVisualizationState(
            isVisualizationEnabled,
            test,
            requirement,
            selector,
            messageType,
        );
    };

    public addResultDescription(description: string): void {
        const messageType = Messages.Assessment.AddResultDescription;
        this.sharedAssessmentActionMessageCreator.addResultDescription(description, messageType);
    }

    public addFailureInstance(
        instanceData: FailureInstanceData,
        test: VisualizationType,
        requirement: string,
    ): void {
        const messageType = Messages.Assessment.AddFailureInstance;
        this.sharedAssessmentActionMessageCreator.addFailureInstance(
            instanceData,
            test,
            requirement,
            messageType,
        );
    }

    public removeFailureInstance = (
        test: VisualizationType,
        requirement: string,
        id: string,
    ): void => {
        const messageType = Messages.Assessment.RemoveFailureInstance;
        this.sharedAssessmentActionMessageCreator.removeFailureInstance(
            test,
            requirement,
            id,
            messageType,
        );
    };

    public editFailureInstance = (
        instanceData: FailureInstanceData,
        test: VisualizationType,
        requirement: string,
        id: string,
    ): void => {
        const messageType = Messages.Assessment.EditFailureInstance;
        this.sharedAssessmentActionMessageCreator.editFailureInstance(
            instanceData,
            test,
            requirement,
            id,
            messageType,
        );
    };

    public passUnmarkedInstances(test: VisualizationType, requirement: string): void {
        const messageType = Messages.Assessment.PassUnmarkedInstances;
        this.sharedAssessmentActionMessageCreator.passUnmarkedInstances(
            test,
            requirement,
            messageType,
        );
    }

    public changeAssessmentVisualizationStateForAll(
        isVisualizationEnabled: boolean,
        test: VisualizationType,
        requirement: string,
    ): void {
        const messageType = Messages.Assessment.ChangeVisualizationStateForAll;
        this.sharedAssessmentActionMessageCreator.changeAssessmentVisualizationStateForAll(
            isVisualizationEnabled,
            test,
            requirement,
            messageType,
        );
    }

    public continuePreviousAssessment = (event: React.MouseEvent<any>): void => {
        const messageType = Messages.Assessment.ContinuePreviousAssessment;
        this.sharedAssessmentActionMessageCreator.continuePreviousAssessment(event, messageType);
    };

    public loadAssessment = (
        assessmentData: VersionedAssessmentData,
        tabId: number,
        detailsViewId: string,
    ): void => {
        const messageType = Messages.Assessment.LoadAssessment;
        this.sharedAssessmentActionMessageCreator.loadAssessment(
            assessmentData,
            tabId,
            detailsViewId,
            messageType,
        );
    };

    public saveAssessment = (event: React.MouseEvent<any>): void => {
        const messageType = Messages.Assessment.SaveAssessment;
        this.sharedAssessmentActionMessageCreator.saveAssessment(event, messageType);
    };

    public startOverAllAssessments = (event: React.MouseEvent<any>): void => {
        const messageType = Messages.Assessment.StartOverAllAssessments;
        this.sharedAssessmentActionMessageCreator.startOverAllAssessments(event, messageType);
    };

    public cancelStartOver = (
        event: React.MouseEvent<any>,
        test: VisualizationType,
        requirement: string,
    ): void => {
        const messageType = Messages.Assessment.CancelStartOver;
        this.sharedAssessmentActionMessageCreator.cancelStartOver(
            event,
            test,
            requirement,
            messageType,
        );
    };

    public cancelStartOverAllAssessments = (event: React.MouseEvent<any>): void => {
        const messageType = Messages.Assessment.CancelStartOverAllAssessments;
        this.sharedAssessmentActionMessageCreator.cancelStartOverAllAssessments(event, messageType);
    };
}
