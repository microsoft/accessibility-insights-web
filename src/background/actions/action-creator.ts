// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { NotificationCreator } from 'common/notification-creator';
import { StoreNames } from 'common/stores/store-names';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { DictionaryNumberTo } from 'types/common-types';
import { VisualizationActions } from '../actions/visualization-actions';
import { VisualizationScanResultActions } from '../actions/visualization-scan-result-actions';
import { ExtensionDetailsViewController } from '../extension-details-view-controller';
import { Interpreter } from '../interpreter';
import { TargetTabController } from '../target-tab-controller';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { ActionHub } from './action-hub';
import {
    AddTabbedElementPayload,
    BaseActionPayload,
    OnDetailsViewOpenPayload,
    OnDetailsViewPivotSelected,
    RescanVisualizationPayload,
    ToggleActionPayload,
    VisualizationTogglePayload,
} from './action-payloads';
import { InspectActions } from './inspect-actions';

const visualizationMessages = Messages.Visualizations;

export class ActionCreator {
    private visualizationActions: VisualizationActions;
    private visualizationScanResultActions: VisualizationScanResultActions;
    private adHocTestTypeToTelemetryEvent: DictionaryNumberTo<string> = {
        [VisualizationType.Color]: TelemetryEvents.COLOR_TOGGLE,
        [VisualizationType.Headings]: TelemetryEvents.HEADINGS_TOGGLE,
        [VisualizationType.Issues]: TelemetryEvents.AUTOMATED_CHECKS_TOGGLE,
        [VisualizationType.Landmarks]: TelemetryEvents.LANDMARKS_TOGGLE,
        [VisualizationType.TabStops]: TelemetryEvents.TABSTOPS_TOGGLE,
        [VisualizationType.NeedsReview]: TelemetryEvents.NEEDS_REVIEW_TOGGLE,
    };
    private inspectActions: InspectActions;
    private cardSelectionActions: CardSelectionActions;
    private unifiedScanResultActions: UnifiedScanResultActions;
    private sidePanelActions: SidePanelActions;

    constructor(
        private readonly interpreter: Interpreter,
        readonly actionHub: ActionHub,
        private readonly detailsViewController: ExtensionDetailsViewController,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly notificationCreator: NotificationCreator,
        private readonly visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private readonly targetTabController: TargetTabController,
        private readonly logger: Logger,
    ) {
        this.visualizationActions = actionHub.visualizationActions;
        this.visualizationScanResultActions = actionHub.visualizationScanResultActions;
        this.inspectActions = actionHub.inspectActions;
        this.cardSelectionActions = actionHub.cardSelectionActions;
        this.unifiedScanResultActions = actionHub.scanResultActions;
        this.sidePanelActions = actionHub.sidePanelActions;
    }

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.Common.Toggle,
            this.onVisualizationToggle,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.Common.ScanCompleted,
            this.onAdHocScanCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.Common.ScrollRequested,
            this.onScrollRequested,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.Common.RescanVisualization,
            this.onRescanVisualization,
        );

        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.Issues.UpdateFocusedInstance,
            this.onUpdateFocusedInstance,
        );

        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.VisualizationStore),
            this.getVisualizationToggleCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            this.getScanResultsCurrentState,
        );

        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.TabStops.TabbedElementAdded,
            this.onTabbedElementAdded,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.TabStops.RecordingCompleted,
            this.onRecordingCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.TabStops.TerminateScan,
            this.onRecordingTerminated,
        );

        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.DetailsView.Open,
            this.onDetailsViewOpen,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.DetailsView.Select,
            this.onPivotChildSelected,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.DetailsView.PivotSelect,
            this.onDetailsViewPivotSelected,
        );
        this.interpreter.registerTypeToPayloadCallback(
            visualizationMessages.DetailsView.Close,
            this.onDetailsViewClosed,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.AssessmentScanCompleted,
            this.onAssessmentScanCompleted,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.StartOverTest,
            this.onStartOver,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.CancelStartOver,
            this.onCancelStartOver,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.StartOverAllAssessments,
            this.onStartOverAllAssessments,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.CancelStartOverAllAssessments,
            this.onCancelStartOverAllAssessments,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.EnableVisualHelper,
            this.onEnableVisualHelper,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.DisableVisualHelperForTest,
            this.onDisableVisualHelpersForTest,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.DisableVisualHelper,
            this.onDisableVisualHelper,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Assessment.EnableVisualHelperWithoutScan,
            this.onEnableVisualHelperWithoutScan,
        );

        this.interpreter.registerTypeToPayloadCallback(
            Messages.Inspect.SetHoveredOverSelector,
            this.onSetHoveredOverSelector,
        );
    }

    private onEnableVisualHelperWithoutScan = (payload: ToggleActionPayload): void => {
        this.visualizationActions.enableVisualizationWithoutScan.invoke(payload);
    };

    private onEnableVisualHelper = (payload: ToggleActionPayload): void => {
        this.visualizationActions.enableVisualization.invoke(payload);
    };

    private onDisableVisualHelpersForTest = (payload: ToggleActionPayload): void => {
        this.visualizationActions.disableVisualization.invoke(payload.test);
    };

    private onDisableVisualHelper = (payload: ToggleActionPayload): void => {
        const eventName = TelemetryEvents.DISABLE_VISUAL_HELPER;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.visualizationActions.disableVisualization.invoke(payload.test);
    };

    private onStartOver = (payload: ToggleActionPayload): void => {
        const eventName = TelemetryEvents.START_OVER_TEST;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.visualizationActions.disableVisualization.invoke(payload.test);
    };

    private onCancelStartOver = (payload: BaseActionPayload): void => {
        const eventName = TelemetryEvents.CANCEL_START_OVER_TEST;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    };

    private onStartOverAllAssessments = (payload: ToggleActionPayload): void => {
        const eventName = TelemetryEvents.START_OVER_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.visualizationActions.disableAssessmentVisualizations.invoke(null);
    };

    private onCancelStartOverAllAssessments = (payload: BaseActionPayload): void => {
        const eventName = TelemetryEvents.CANCEL_START_OVER_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    };

    private onDetailsViewClosed = (): void => {
        this.visualizationActions.disableAssessmentVisualizations.invoke(null);
    };

    private onAssessmentScanCompleted = async (
        payload: ScanCompletedPayload<any>,
        tabId: number,
    ): Promise<void> => {
        const eventName = TelemetryEvents.ASSESSMENT_SCAN_COMPLETED;
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
        this.visualizationActions.scanCompleted.invoke(null);
        this.notificationCreator.createNotificationByVisualizationKey(
            payload.selectorMap,
            payload.key,
            payload.testType,
            payload.scanIncompleteWarnings,
        );
        await this.targetTabController.showTargetTab(tabId, payload.testType, payload.key);
    };

    private onTabbedElementAdded = (payload: AddTabbedElementPayload): void => {
        this.visualizationScanResultActions.addTabbedElement.invoke(payload);
    };

    private onRecordingCompleted = (payload: BaseActionPayload): void => {
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.TABSTOPS_RECORDING_COMPLETE,
            payload,
        );
    };

    private onRecordingTerminated = (payload: BaseActionPayload): void => {
        this.visualizationScanResultActions.disableTabStop.invoke(payload);
    };

    private onUpdateFocusedInstance = (payload: string[]): void => {
        this.visualizationActions.updateFocusedInstance.invoke(payload);
    };

    private onAdHocScanCompleted = async (
        payload: ScanCompletedPayload<any>,
        tabId: number,
    ): Promise<void> => {
        const telemetryEventName = TelemetryEvents.ADHOC_SCAN_COMPLETED;
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload);
        this.visualizationScanResultActions.scanCompleted.invoke(payload);
        this.visualizationActions.scanCompleted.invoke(null);
        this.notificationCreator.createNotificationByVisualizationKey(
            payload.selectorMap,
            payload.key,
            payload.testType,
            payload.scanIncompleteWarnings,
        );
        await this.targetTabController.showTargetTab(tabId, payload.testType, payload.key);
    };

    private onScrollRequested = (): void => {
        this.visualizationActions.scrollRequested.invoke(null);
        this.cardSelectionActions.resetFocusedIdentifier.invoke(null);
    };

    private onDetailsViewOpen = async (
        payload: OnDetailsViewOpenPayload,
        tabId: number,
    ): Promise<void> => {
        if (this.shouldEnableToggleOnDetailsViewOpen(payload.detailsViewType)) {
            this.enableToggleOnDetailsViewOpen(payload.detailsViewType, tabId);
        }

        await this.onPivotChildSelected(payload, tabId);
    };

    private shouldEnableToggleOnDetailsViewOpen(visualizationType: VisualizationType): boolean {
        return (
            visualizationType != null &&
            visualizationType !== VisualizationType.TabStops &&
            this.visualizationConfigurationFactory.getConfiguration(visualizationType).testMode !==
                TestMode.Assessments
        );
    }

    private enableToggleOnDetailsViewOpen(test: VisualizationType, tabId: number): void {
        const payload: VisualizationTogglePayload =
            this.createVisualizationTogglePayloadWithNullTelemetry(test);
        this.onVisualizationToggle(payload);
    }

    private createVisualizationTogglePayloadWithNullTelemetry(
        test: VisualizationType,
    ): VisualizationTogglePayload {
        return {
            test,
            enabled: true,
            telemetry: null,
        };
    }

    private onPivotChildSelected = async (
        payload: OnDetailsViewOpenPayload,
        tabId: number,
    ): Promise<void> => {
        this.sidePanelActions.closeSidePanel.invoke('PreviewFeatures');
        this.visualizationActions.updateSelectedPivotChild.invoke(payload);
        await this.detailsViewController
            .showDetailsView(tabId)
            .catch(e => this.logger.error(e.message));
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.PIVOT_CHILD_SELECTED, payload);
    };

    private onDetailsViewPivotSelected = (payload: OnDetailsViewPivotSelected): void => {
        this.visualizationActions.updateSelectedPivot.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(
            TelemetryEvents.DETAILS_VIEW_PIVOT_ACTIVATED,
            payload,
        );
    };

    private onVisualizationToggle = (payload: VisualizationTogglePayload): void => {
        const telemetryEvent = this.adHocTestTypeToTelemetryEvent[payload.test];
        this.telemetryEventHandler.publishTelemetry(telemetryEvent, payload);
        this.unifiedScanResultActions.startScan.invoke(null);

        if (payload.enabled) {
            this.visualizationActions.enableVisualization.invoke(payload);
        } else {
            this.visualizationActions.disableVisualization.invoke(payload.test);
        }
    };

    private onRescanVisualization = (payload: RescanVisualizationPayload) => {
        this.visualizationActions.disableVisualization.invoke(payload.test);
        this.visualizationActions.enableVisualization.invoke(payload);
        this.unifiedScanResultActions.startScan.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.RESCAN_VISUALIZATION, payload);
    };

    private getVisualizationToggleCurrentState = (): void => {
        this.visualizationActions.getCurrentState.invoke(null);
    };

    private getScanResultsCurrentState = (): void => {
        this.visualizationScanResultActions.getCurrentState.invoke(null);
    };

    private onSetHoveredOverSelector = (payload: string[]): void => {
        this.inspectActions.setHoveredOverSelector.invoke(payload);
    };
}
