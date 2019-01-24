// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import '../string-utils';

import { autobind } from '@uifabric/utilities';

import { TestMode } from '../../common/configs/test-mode';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { Messages } from '../../common/messages';
import { NotificationCreator } from '../../common/notification-creator';
import * as TelemetryEvents from '../../common/telemetry-events';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewRightContentPanelType } from '../../DetailsView/components/left-nav/details-view-right-content-panel-type';
import { IScanCompletedPayload } from '../../injected/analyzers/ianalyzer';
import { VisualizationActions } from '../actions/visualization-actions';
import { VisualizationScanResultActions } from '../actions/visualization-scan-result-actions';
import { ChromeFeatureController } from '../chrome-feature-controller';
import { DetailsViewController } from '../details-view-controller';
import { TargetTabController } from '../target-tab-controller';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { ActionHub } from './action-hub';
import {
    BaseActionPayload,
    IAddTabbedElementPayload,
    IOnDetailsViewOpenPayload,
    IOnDetailsViewPivotSelected,
    IPayloadWIthEventName,
    IToggleActionPayload,
    IVisualizationTogglePayload,
} from './action-payloads';
import { DetailsViewActions } from './details-view-actions';
import { InspectActions } from './inspect-actions';
import { PreviewFeaturesActions } from './preview-features-actions';

const visualizationMessages = Messages.Visualizations;

export class ActionCreator {
    private visualizationActions: VisualizationActions;
    private visualizationScanResultActions: VisualizationScanResultActions;
    private detailsViewActions: DetailsViewActions;
    private previewFeaturesActions: PreviewFeaturesActions;
    private registerTypeToPayloadCallback: IRegisterTypeToPayloadCallback;
    private detailsViewController: DetailsViewController;
    private chromeFeatureController: ChromeFeatureController;
    private telemetryEventHandler: TelemetryEventHandler;
    private notificationCreator: NotificationCreator;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private targetTabController: TargetTabController;
    private adhocTestTypeToTelemetryEvent: IDictionaryNumberTo<string> = {
        [VisualizationType.Color]: TelemetryEvents.COLOR_TOGGLE,
        [VisualizationType.Headings]: TelemetryEvents.HEADINGS_TOGGLE,
        [VisualizationType.Issues]: TelemetryEvents.AUTOMATED_CHECKS_TOGGLE,
        [VisualizationType.Landmarks]: TelemetryEvents.LANDMARKS_TOGGLE,
        [VisualizationType.TabStops]: TelemetryEvents.TABSTOPS_TOGGLE,
    };
    private inspectActions: InspectActions;

    constructor(
        actionHub: ActionHub,
        registerTypeToPayloadCallback: IRegisterTypeToPayloadCallback,
        detailsViewController: DetailsViewController,
        chromeFeatureController: ChromeFeatureController,
        telemetryEventHandler: TelemetryEventHandler,
        notificationCreator: NotificationCreator,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        targetTabController: TargetTabController,
    ) {
        this.visualizationActions = actionHub.visualizationActions;
        this.previewFeaturesActions = actionHub.previewFeaturesActions;
        this.detailsViewActions = actionHub.detailsViewActions;
        this.visualizationScanResultActions = actionHub.visualizationScanResultActions;
        this.inspectActions = actionHub.inspectActions;
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
        this.detailsViewController = detailsViewController;
        this.chromeFeatureController = chromeFeatureController;
        this.telemetryEventHandler = telemetryEventHandler;
        this.notificationCreator = notificationCreator;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.targetTabController = targetTabController;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(visualizationMessages.Common.Toggle, this.onVisualizationToggle);
        this.registerTypeToPayloadCallback(visualizationMessages.Common.ScanCompleted, this.onScanCompleted);
        this.registerTypeToPayloadCallback(visualizationMessages.Common.ScrollRequested, this.onScrollRequested);

        this.registerTypeToPayloadCallback(visualizationMessages.Issues.UpdateSelectedTargets, this.onUpdateIssuesSelectedTargets);
        this.registerTypeToPayloadCallback(visualizationMessages.Issues.UpdateFocusedInstance, this.onUpdateFocusedInstance);

        this.registerTypeToPayloadCallback(visualizationMessages.State.InjectionCompleted, this.injectionCompleted);
        this.registerTypeToPayloadCallback(visualizationMessages.State.InjectionStarted, this.injectionStarted);
        this.registerTypeToPayloadCallback(
            visualizationMessages.State.GetCurrentVisualizationToggleState,
            this.getVisualizationToggleCurrentState,
        );
        this.registerTypeToPayloadCallback(visualizationMessages.State.GetCurrentVisualizationResultState, this.getScanResultsCurrentState);

        this.registerTypeToPayloadCallback(visualizationMessages.TabStops.TabbedElementAdded, this.onTabbedElementAdded);
        this.registerTypeToPayloadCallback(visualizationMessages.TabStops.RecordingCompleted, this.onRecordingCompleted);
        this.registerTypeToPayloadCallback(visualizationMessages.TabStops.TerminateScan, this.onRecordingTerminated);

        this.registerTypeToPayloadCallback(visualizationMessages.DetailsView.Open, this.onDetailsViewOpen);
        this.registerTypeToPayloadCallback(visualizationMessages.DetailsView.Select, this.onPivotChildSelected);
        this.registerTypeToPayloadCallback(visualizationMessages.DetailsView.PivotSelect, this.onDetailsViewPivotSelected);
        this.registerTypeToPayloadCallback(visualizationMessages.DetailsView.Close, this.onDetailsViewClosed);
        this.registerTypeToPayloadCallback(visualizationMessages.DetailsView.GetState, this.onGetDetailsViewCurrentState);
        this.registerTypeToPayloadCallback(
            visualizationMessages.DetailsView.SetDetailsViewRightContentPanel,
            this.onSetDetailsViewRightContentPanel,
        );

        this.registerTypeToPayloadCallback(Messages.Telemetry.Send, this.onSendTelemetry);
        this.registerTypeToPayloadCallback(Messages.Telemetry.SendExcludeUrl, this.onSendTelemetryExcludeUrl);

        this.registerTypeToPayloadCallback(Messages.ChromeFeature.configureCommand, this.onOpenConfigureCommandTab);

        this.registerTypeToPayloadCallback(Messages.PreviewFeatures.OpenPanel, this.onOpenPreviewFeaturesPanel);
        this.registerTypeToPayloadCallback(Messages.PreviewFeatures.ClosePanel, this.onClosePreviewFeaturesPanel);

        this.registerTypeToPayloadCallback(Messages.SettingsPanel.OpenPanel, this.onOpenSettingsPanel);
        this.registerTypeToPayloadCallback(Messages.SettingsPanel.ClosePanel, this.onCloseSettingsPanel);

        this.registerTypeToPayloadCallback(Messages.Assessment.AssessmentScanCompleted, this.onAssessmentScanCompleted);
        this.registerTypeToPayloadCallback(Messages.Assessment.StartOver, this.onStartOver);
        this.registerTypeToPayloadCallback(Messages.Assessment.CancelStartOver, this.onCancelStartOver);
        this.registerTypeToPayloadCallback(Messages.Assessment.StartOverAllAssessments, this.onStartOverAllAssessments);
        this.registerTypeToPayloadCallback(Messages.Assessment.CancelStartOverAllAssessments, this.onCancelStartOverAllAssessments);
        this.registerTypeToPayloadCallback(Messages.Assessment.EnableVisualHelper, this.onEnableVisualHelper);
        this.registerTypeToPayloadCallback(Messages.Assessment.DisableVisualHelperForTest, this.onDisableVisualHelpersForTest);
        this.registerTypeToPayloadCallback(Messages.Assessment.DisableVisualHelper, this.onDisableVisualHelper);
        this.registerTypeToPayloadCallback(Messages.Assessment.EnableVisualHelperWithoutScan, this.onEnableVisualHelperWithoutScan);

        this.registerTypeToPayloadCallback(Messages.Inspect.SetHoveredOverSelector, this.onSetHoveredOverSelector);
    }

    @autobind
    private onEnableVisualHelperWithoutScan(payload: IToggleActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.ENABLE_VISUAL_HELPER;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.visualizationActions.enableVisualizationWithoutScan.invoke(payload);
    }

    @autobind
    private onEnableVisualHelper(payload: IToggleActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.ENABLE_VISUAL_HELPER;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.visualizationActions.enableVisualization.invoke(payload);
    }

    @autobind
    private onDisableVisualHelpersForTest(payload: IToggleActionPayload): void {
        this.visualizationActions.disableVisualization.invoke(payload.test);
    }

    @autobind
    private onDisableVisualHelper(payload: IToggleActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.DISABLE_VISUAL_HELPER;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.visualizationActions.disableVisualization.invoke(payload.test);
    }

    @autobind
    private onStartOver(payload: IToggleActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.START_OVER_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.visualizationActions.disableVisualization.invoke(payload.test);
    }

    @autobind
    private onCancelStartOver(payload: BaseActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.CANCEL_START_OVER_ASSESSMENT;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
    }

    @autobind
    private onStartOverAllAssessments(payload: IToggleActionPayload, tabId: number): void {
        const eventName = TelemetryEvents.START_OVER_ALL_ASSESSMENTS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.visualizationActions.disableAssessmentVisualizations.invoke(null);
    }

    @autobind
    private onCancelStartOverAllAssessments(payload: BaseActionPayload, tabId: number) {
        const eventName = TelemetryEvents.CANCEL_START_OVER_ALL_ASSESSMENTS;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
    }

    @autobind
    private onDetailsViewClosed(): void {
        this.visualizationActions.disableAssessmentVisualizations.invoke(null);
    }

    @autobind
    private onAssessmentScanCompleted(payload: IScanCompletedPayload<any>, tabId: number): void {
        const eventName = TelemetryEvents.ASSESSMENT_SCAN_COMPLETED;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
        this.visualizationActions.scanCompleted.invoke(null);
        this.notificationCreator.createNotificationByVisualizationKey(payload.selectorMap, payload.key, payload.testType);
        this.targetTabController.showTargetTab(tabId, payload.testType, payload.key);
    }

    @autobind
    private onOpenPreviewFeaturesPanel(payload: BaseActionPayload, tabId: number): void {
        this.previewFeaturesActions.openPreviewFeatures.invoke(null);
        this.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.PREVIEW_FEATURES_OPEN, payload, tabId);
    }

    @autobind
    private onClosePreviewFeaturesPanel(payload: BaseActionPayload, tabId: number): void {
        this.previewFeaturesActions.closePreviewFeatures.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.PREVIEW_FEATURES_CLOSE, payload, tabId);
    }

    @autobind
    private onOpenSettingsPanel(payload: BaseActionPayload, tabId: number): void {
        this.detailsViewActions.openSettingsPanel.invoke(null);
        this.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SETTINGS_PANEL_OPEN, payload, tabId);
    }

    @autobind
    private onCloseSettingsPanel(payload: BaseActionPayload, tabId: number): void {
        this.detailsViewActions.closeSettingsPanel.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SETTINGS_PANEL_CLOSE, payload, tabId);
    }

    @autobind
    private onTabbedElementAdded(payload: IAddTabbedElementPayload): void {
        this.visualizationScanResultActions.addTabbedElement.invoke(payload);
    }

    @autobind
    private onRecordingCompleted(payload: BaseActionPayload, tabId: number): void {
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.TABSTOPS_RECORDING_COMPLETE, payload, tabId);
    }

    @autobind
    private onRecordingTerminated(payload: BaseActionPayload, tabId: number): void {
        this.visualizationScanResultActions.disableTabStop.invoke(payload);
    }

    @autobind
    private onOpenConfigureCommandTab(payload: BaseActionPayload, tabId: number): void {
        this.chromeFeatureController.openCommandConfigureTab();
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.SHORTCUT_CONFIGURE_OPEN, payload, tabId);
    }

    @autobind
    private onUpdateIssuesSelectedTargets(payload: string[], tabId: number) {
        this.visualizationScanResultActions.updateIssuesSelectedTargets.invoke(payload);
    }

    @autobind
    private onUpdateFocusedInstance(payload: string[], tabId: number): void {
        this.visualizationActions.updateFocusedInstance.invoke(payload);
    }

    @autobind
    private onScanCompleted(payload: IScanCompletedPayload<any>, tabId: number): void {
        const telemetryEventName = TelemetryEvents.ADHOC_SCAN_COMPLETED;
        this.telemetryEventHandler.publishTelemetry(telemetryEventName, payload, tabId);
        this.visualizationScanResultActions.scanCompleted.invoke(payload);
        this.visualizationActions.scanCompleted.invoke(null);
        this.notificationCreator.createNotificationByVisualizationKey(payload.selectorMap, payload.key, payload.testType);
        this.targetTabController.showTargetTab(tabId, payload.testType, payload.key);
    }

    @autobind
    private onScrollRequested(payload: BaseActionPayload, tabId: number): void {
        this.visualizationActions.scrollRequested.invoke(null);
    }

    @autobind
    private onDetailsViewOpen(payload: IOnDetailsViewOpenPayload, tabId: number): void {
        if (this.shouldEnableToggleOnDetailsViewOpen(payload.detailsViewType)) {
            this.enableToggleOnDetailsViewOpen(payload.detailsViewType, tabId);
        }

        this.onPivotChildSelected(payload, tabId);
    }

    private shouldEnableToggleOnDetailsViewOpen(visualizationType: VisualizationType): boolean {
        return (
            visualizationType != null &&
            visualizationType !== VisualizationType.TabStops &&
            this.visualizationConfigurationFactory.getConfiguration(visualizationType).testMode !== TestMode.Assessments
        );
    }

    private enableToggleOnDetailsViewOpen(test: VisualizationType, tabId: number): void {
        const _payload: IVisualizationTogglePayload = this.createVisualizationTogglePayloadWithNullTelemetry(test);
        this.onVisualizationToggle(_payload, tabId);
    }

    private createVisualizationTogglePayloadWithNullTelemetry(test: VisualizationType): IVisualizationTogglePayload {
        return {
            test,
            enabled: true,
            telemetry: null,
        };
    }

    @autobind
    private onPivotChildSelected(payload: IOnDetailsViewOpenPayload, tabId: number): void {
        this.previewFeaturesActions.closePreviewFeatures.invoke(null);
        this.visualizationActions.updateSelectedPivotChild.invoke(payload);
        this.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.PIVOT_CHILD_SELECTED, payload, tabId);
    }

    @autobind
    private onDetailsViewPivotSelected(payload: IOnDetailsViewPivotSelected, tabId: number): void {
        this.visualizationActions.updateSelectedPivot.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.DETAILS_VIEW_PIVOT_ACTIVATED, payload, tabId);
    }

    @autobind
    private showDetailsView(tabId: number): void {
        this.detailsViewController.showDetailsView(tabId);
    }

    @autobind
    private onVisualizationToggle(payload: IVisualizationTogglePayload, tabId: number): void {
        const telemetryEvent = this.adhocTestTypeToTelemetryEvent[payload.test];
        this.telemetryEventHandler.publishTelemetry(telemetryEvent, payload, tabId);

        if (payload.enabled) {
            this.visualizationActions.enableVisualization.invoke(payload);
        } else {
            this.visualizationActions.disableVisualization.invoke(payload.test);
        }
    }

    @autobind
    private onSendTelemetry(payload: IPayloadWIthEventName, tabId: number) {
        const eventName = payload.eventName;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId);
    }

    @autobind
    private onSendTelemetryExcludeUrl(payload: IPayloadWIthEventName, tabId: number) {
        const eventName = payload.eventName;
        this.telemetryEventHandler.publishTelemetry(eventName, payload, tabId, false);
    }

    @autobind
    private injectionCompleted() {
        this.visualizationActions.injectionCompleted.invoke(null);
    }

    @autobind
    private injectionStarted() {
        this.visualizationActions.injectionStarted.invoke(null);
    }

    @autobind
    private getVisualizationToggleCurrentState() {
        this.visualizationActions.getCurrentState.invoke(null);
    }

    @autobind
    private getScanResultsCurrentState() {
        this.visualizationScanResultActions.getCurrentState.invoke(null);
    }

    @autobind
    private onSetHoveredOverSelector(payload: string[]): void {
        this.inspectActions.setHoveredOverSelector.invoke(payload);
    }

    @autobind
    private onSetDetailsViewRightContentPanel(payload: DetailsViewRightContentPanelType): void {
        this.detailsViewActions.setSelectedDetailsViewRightContentPanel.invoke(payload);
    }

    @autobind
    private onGetDetailsViewCurrentState() {
        this.detailsViewActions.getCurrentState.invoke(null);
    }
}
