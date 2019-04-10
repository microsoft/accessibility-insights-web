// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { ActionCreator } from '../../../../../background/actions/action-creator';
import { ActionHub } from '../../../../../background/actions/action-hub';
import {
    AddTabbedElementPayload,
    BaseActionPayload,
    ChangeInstanceStatusPayload,
    OnDetailsViewOpenPayload,
    OnDetailsViewPivotSelected,
    ToggleActionPayload,
    VisualizationTogglePayload,
} from '../../../../../background/actions/action-payloads';
import { DetailsViewActions } from '../../../../../background/actions/details-view-actions';
import { DevToolActions } from '../../../../../background/actions/dev-tools-actions';
import { InspectActions } from '../../../../../background/actions/inspect-actions';
import { ScopingActions } from '../../../../../background/actions/scoping-actions';
import { VisualizationActions } from '../../../../../background/actions/visualization-actions';
import { VisualizationScanResultActions } from '../../../../../background/actions/visualization-scan-result-actions';
import { ChromeFeatureController } from '../../../../../background/chrome-feature-controller';
import { DetailsViewController } from '../../../../../background/details-view-controller';
import { ContentScriptInjector } from '../../../../../background/injector/content-script-injector';
import { TargetTabController } from '../../../../../background/target-tab-controller';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { Action } from '../../../../../common/flux/action';
import { PayloadCallback } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { NotificationCreator } from '../../../../../common/notification-creator';
import * as TelemetryEvents from '../../../../../common/telemetry-events';
import {
    BaseTelemetryData,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    SettingsOpenTelemetryData,
    TelemetryEventSource,
    ToggleTelemetryData,
    TriggeredBy,
} from '../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { ScanCompletedPayload } from '../../../../../injected/analyzers/analyzer';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { AssessmentActions } from './../../../../../background/actions/assessment-actions';
import { PreviewFeaturesActions } from './../../../../../background/actions/preview-features-actions';

const VisualizationMessage = Messages.Visualizations;
const PreviewFeaturesMessage = Messages.PreviewFeatures;

describe('ActionCreatorTest', () => {
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    test('registerCallback for tab stops visualization toggle (to enable)', () => {
        const actionName = 'enableVisualization';
        const test = VisualizationType.TabStops;
        const tabId = 1;
        const enabled = true;

        const telemetry: ToggleTelemetryData = {
            enabled,
            triggeredBy: 'test' as TriggeredBy,
            source: testSource,
        };

        const payload: VisualizationTogglePayload = {
            enabled,
            test,
            telemetry,
        };

        const args = [payload, tabId];

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload)
            .setupSwithToTab(tabId)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for tab stops visualization toggle (to disabled)', () => {
        const actionName = 'disableVisualization';
        const test = VisualizationType.TabStops;
        const tabId = 1;
        const enabled = false;

        const telemetry: ToggleTelemetryData = {
            enabled,
            triggeredBy: 'test' as TriggeredBy,
            source: testSource,
        };

        const payload: VisualizationTogglePayload = {
            enabled,
            test,
            telemetry,
        };

        const args = [payload, tabId];

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, test)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for visualization toggle (to enable)', () => {
        const actionName = 'enableVisualization';
        const test = VisualizationType.Headings;
        const tabId = 1;
        const enabled = true;

        const telemetry: ToggleTelemetryData = {
            enabled,
            triggeredBy: 'test' as TriggeredBy,
            source: testSource,
        };

        const payload: VisualizationTogglePayload = {
            enabled,
            test,
            telemetry,
        };

        const args = [payload, tabId];

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for visualization toggle (to disable)', () => {
        const actionName = 'disableVisualization';
        const test = VisualizationType.Headings;
        const tabId = 1;
        const enabled = false;

        const telemetry: ToggleTelemetryData = {
            enabled,
            triggeredBy: 'test' as TriggeredBy,
            source: testSource,
        };

        const payload: VisualizationTogglePayload = {
            enabled,
            test,
            telemetry,
        };

        const args = [payload, tabId];

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, test)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == null', () => {
        const tabId = 1;
        const viewType = null;
        const pivotType = DetailsViewPivotType.allTest;
        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType: pivotType,
            telemetry: telemetry,
        };

        const updateViewActionName = 'updateSelectedPivotChild';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();
        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == Headings', () => {
        const tabId = 1;
        const viewType = VisualizationType.Headings;
        const pivotType = DetailsViewPivotType.allTest;
        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType: pivotType,
            telemetry: telemetry,
        };

        const updateViewActionName = 'updateSelectedPivotChild';
        const enableVisualizationActionName = 'enableVisualization';
        const enableVisualizationTelemetryPayload: VisualizationTogglePayload = {
            enabled: true,
            test: viewType,
            telemetry: null,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(enableVisualizationActionName)
            .setupVisualizationActionWithInvokeParameter(enableVisualizationActionName, enableVisualizationTelemetryPayload)
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, enableVisualizationTelemetryPayload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == Issues', () => {
        const tabId = 1;
        const viewType = VisualizationType.Issues;
        const pivotType = DetailsViewPivotType.fastPass;
        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType: pivotType,
            telemetry: telemetry,
        };

        const updateViewActionName = 'updateSelectedPivotChild';
        const enablingIssuesActionName = 'enableVisualization';
        const enableVisualizationTelemetryPayload: VisualizationTogglePayload = {
            enabled: true,
            test: viewType,
            telemetry: null,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupActionOnVisualizationActions(enablingIssuesActionName)
            .setupVisualizationActionWithInvokeParameter(enablingIssuesActionName, enableVisualizationTelemetryPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupTelemetrySend(TelemetryEvents.AUTOMATED_CHECKS_TOGGLE, enableVisualizationTelemetryPayload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == Color', () => {
        const tabId = 1;
        const viewType = VisualizationType.Color;
        const pivotType = DetailsViewPivotType.allTest;
        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType,
            telemetry,
        };

        const updateViewActionName = 'updateSelectedPivotChild';
        const enablingColorActionName = 'enableVisualization';

        const enableVisualizationTelemetryPayload: VisualizationTogglePayload = {
            enabled: true,
            test: viewType,
            telemetry: null,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupActionOnVisualizationActions(enablingColorActionName)
            .setupVisualizationActionWithInvokeParameter(enablingColorActionName, enableVisualizationTelemetryPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupTelemetrySend(TelemetryEvents.COLOR_TOGGLE, enableVisualizationTelemetryPayload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == Landmarks', () => {
        const tabId = 1;
        const viewType = VisualizationType.Landmarks;
        const pivotType = DetailsViewPivotType.allTest;
        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType: pivotType,
            telemetry: telemetry,
        };

        const updateViewActionName = 'updateSelectedPivotChild';
        const enablingIssuesActionName = 'enableVisualization';

        const enableVisualizationTelemetryPayload: VisualizationTogglePayload = {
            enabled: true,
            test: viewType,
            telemetry: null,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupActionOnVisualizationActions(enablingIssuesActionName)
            .setupVisualizationActionWithInvokeParameter(enablingIssuesActionName, enableVisualizationTelemetryPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupTelemetrySend(TelemetryEvents.LANDMARKS_TOGGLE, enableVisualizationTelemetryPayload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == HeadingsAssessment', () => {
        const tabId = 1;
        const viewType = VisualizationType.HeadingsAssessment;
        const pivotType = DetailsViewPivotType.assessment;
        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType: pivotType,
            telemetry: telemetry,
        };

        const updateViewActionName = 'updateSelectedPivotChild';
        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for closeDetailsView', () => {
        const tabId = 1;
        const disableAssessmentVisualizationActionName = 'disableAssessmentVisualizations';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Close, [null, tabId])
            .setupActionOnVisualizationActions(disableAssessmentVisualizationActionName)
            .setupVisualizationActionWithInvokeParameter(disableAssessmentVisualizationActionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for onUpdateIssuesSelectedTargets', () => {
        const selectedTargets = ['#headings-1', '#landmark-1'];
        const args = [selectedTargets, 1];
        const actionName = 'updateIssuesSelectedTargets';

        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.Issues.UpdateSelectedTargets, args)
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, selectedTargets);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallbacks for scrollRequested', () => {
        const actionName = 'scrollRequested';
        const tabId = 1;
        const builder = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, null)
            .setupRegistrationCallback(VisualizationMessage.Common.ScrollRequested, [null, tabId]);

        const actionCreator = builder.buildActionCreator();
        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallbacks for onUpdateFocusedInstance', () => {
        const instanceId = '#headings-1';
        const args = [instanceId, 1];
        const actionName = 'updateFocusedInstance';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.Issues.UpdateFocusedInstance, args)
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, instanceId);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallbacks for onSetHoveredOverSelector', () => {
        const selector = ['some selector'];
        const args = [selector];
        const actionName = 'setHoveredOverSelector';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Inspect.SetHoveredOverSelector, args)
            .setupActionsOnInspectActions(actionName)
            .setupInspectActionWithInvokeParameter(actionName, selector);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallbacks for onSetDetailsViewRightContentPanel', () => {
        const args = 'Overview';
        const actionName = 'setSelectedDetailsViewRightContentPanel';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel, [args])
            .setupActionOnDetailsViewActions(actionName)
            .setupDetailsViewActionWithInvokeParameter(actionName, args);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallback for onScanCompleted', () => {
        const key = 'Key should not matter';
        const actionName = 'scanCompleted';
        const message = VisualizationMessage.Common.ScanCompleted;
        const telemetryEventName = TelemetryEvents.ADHOC_SCAN_COMPLETED;
        testScanCompleteWithExpectedParams(key, message, actionName, telemetryEventName);
    });

    test('registerCallback for injectionCompleted', () => {
        const actionName = 'injectionCompleted';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.State.InjectionCompleted)
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, null);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallback for injectionStarted', () => {
        const actionName = 'injectionStarted';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.State.InjectionStarted)
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, null);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallback for tabbed element added', () => {
        const tabbedElement: AddTabbedElementPayload = {
            tabbedElements: [
                {
                    target: ['selector'],
                    html: 'test',
                    timestamp: 1,
                },
            ],
        };

        const args = [tabbedElement];
        const actionName = 'addTabbedElement';
        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Visualizations.TabStops.TabbedElementAdded, args)
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, tabbedElement);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for state GetCurrentVisualizationToggleState', () => {
        const args = [];
        const actionName = 'getCurrentState';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Visualizations.State.GetCurrentVisualizationToggleState, args)
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, null);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallbacks for state GetCurrentVisualizationResultState', () => {
        const args = [];
        const actionName = 'getCurrentState';
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Visualizations.State.GetCurrentVisualizationResultState, args)
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, null);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('test for open configureCommand tab', () => {
        const tabId: number = 1;
        const payload = { eventName: TelemetryEvents.SHORTCUT_CONFIGURE_OPEN, telemetry: {} };
        const args = [payload, tabId];
        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.ChromeFeature.configureCommand, args)
            .setupTelemetrySend(TelemetryEvents.SHORTCUT_CONFIGURE_OPEN, payload, tabId)
            .setupChromeFeatureController();

        const actionCreator = builder.buildActionCreator();
        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallback for onDetailsViewSelected', () => {
        const viewType = VisualizationType.Issues;
        const pivotType = DetailsViewPivotType.allTest;
        const updateViewActionName = 'updateSelectedPivotChild';
        const closePreviewFeaturesActionName = 'closePreviewFeatures';
        const tabId = 1;
        const actionCreatorPayload: OnDetailsViewOpenPayload = {
            detailsViewType: viewType,
            pivotType: pivotType,
            telemetry: {
                selectedTest: VisualizationType[viewType],
                triggeredBy: 'mouseclick',
                source: testSource,
            },
        };

        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Select, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupActionOnPreviewFeaturesActions(closePreviewFeaturesActionName)
            .setupPreviewFeaturesActionWithInvokeParameter(closePreviewFeaturesActionName, null)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, 1)
            .setupShowDetailsView(tabId);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallback for onRecordingCompleted', () => {
        const tabId = 1;
        const actionCreatorPayload = {
            telemetry: {},
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.TabStops.RecordingCompleted, [actionCreatorPayload, tabId])
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_RECORDING_COMPLETE, actionCreatorPayload, tabId);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onRecordingTerminated', () => {
        const tabId = 1;
        const actionName = 'disableTabStop';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.TabStops.TerminateScan, [null, tabId])
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onClosePreviewFeaturesPanel', () => {
        const tabId = 1;
        const actionName = 'closePreviewFeatures';
        const telemetryData: BaseTelemetryData = {
            triggeredBy: 'stub triggered by' as TriggeredBy,
            source: testSource,
        };

        const telemetryInfo = {
            telemetryData,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(PreviewFeaturesMessage.ClosePanel, [telemetryInfo, tabId])
            .setupActionOnPreviewFeaturesActions(actionName)
            .setupTelemetrySend(TelemetryEvents.PREVIEW_FEATURES_CLOSE, telemetryInfo, tabId)
            .setupPreviewFeaturesActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onOpenSettingsPanel', () => {
        const tabId: number = 1;
        const telemetryData: SettingsOpenTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
            sourceItem: 'menu',
        };

        const payload = {
            telemetryData,
        };
        const actionName = 'openSettingsPanel';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.SettingsPanel.OpenPanel, [payload, tabId])
            .setupActionOnDetailsViewActions(actionName)
            .setupDetailsViewActionWithInvokeParameter(actionName, null)
            .setupTelemetrySend(TelemetryEvents.SETTINGS_PANEL_OPEN, payload, tabId)
            .setupShowDetailsView(tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onCloseSettingPanel', () => {
        const tabId = 1;
        const telemetryData: BaseTelemetryData = {
            triggeredBy: 'stub triggered by' as TriggeredBy,
            source: testSource,
        };
        const actionName = 'closeSettingsPanel';
        const telemetryInfo = {
            telemetryData,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.SettingsPanel.ClosePanel, [telemetryInfo, tabId])
            .setupActionOnDetailsViewActions(actionName)
            .setupDetailsViewActionWithInvokeParameter(actionName, null)
            .setupTelemetrySend(TelemetryEvents.SETTINGS_PANEL_CLOSE, telemetryInfo, tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onAssessmentScanCompleted', () => {
        const tabId = -1;
        const telemetryData: BaseTelemetryData = {
            triggeredBy: 'stub triggered by' as TriggeredBy,
            source: testSource,
        };

        const payload: ScanCompletedPayload<any> = {
            telemetry: telemetryData,
            selectorMap: {},
            scanResult: null,
            testType: VisualizationType.HeadingsAssessment,
            key: 'key',
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.AssessmentScanCompleted, [payload, tabId])
            .setupTelemetrySend(TelemetryEvents.ASSESSMENT_SCAN_COMPLETED, payload, tabId)
            .setupCreateNotificationByVisualizationKey(payload.selectorMap, payload.key, payload.testType)
            .setupShowTargetTab(tabId, payload.testType, payload.key);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onStartOverAssessment', () => {
        const tabId = 1;
        const payload: ChangeInstanceStatusPayload = {
            test: VisualizationType.HeadingsAssessment,
            status: null,
            requirement: null,
            selector: null,
        };
        const disableActionName = 'disableVisualization';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.StartOver, [payload, tabId])
            .setupActionOnVisualizationActions(disableActionName)
            .setupVisualizationActionWithInvokeParameter(disableActionName, payload.test)
            .setupTelemetrySend(TelemetryEvents.START_OVER_TEST, payload, 1);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onCancelStartOverAssessment', () => {
        const tabId = 1;
        const payload: BaseActionPayload = {};

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.CancelStartOver, [payload, tabId])
            .setupTelemetrySend(TelemetryEvents.CANCEL_START_OVER_TEST, payload, tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onStartOverAllAssessments', () => {
        const tabId = 1;
        const payload: ChangeInstanceStatusPayload = {
            test: VisualizationType.HeadingsAssessment,
            status: null,
            requirement: null,
            selector: null,
        };
        const disableActionName = 'disableAssessmentVisualizations';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.StartOverAllAssessments, [payload, tabId])
            .setupActionOnVisualizationActions(disableActionName)
            .setupVisualizationActionWithInvokeParameter(disableActionName, null)
            .setupTelemetrySend(TelemetryEvents.START_OVER_ASSESSMENT, payload, 1);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onCancelStartOverAllAssessments', () => {
        const tabId = 1;
        const payload: BaseActionPayload = {};

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.CancelStartOverAllAssessments, [payload, tabId])
            .setupTelemetrySend(TelemetryEvents.CANCEL_START_OVER_ASSESSMENT, payload, tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onEnableVisualHelper', () => {
        const tabId = 1;
        const payload: ToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
        };
        const actionName = 'enableVisualization';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.EnableVisualHelper, [payload, tabId])
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onEnableVisualHelperWithoutScan', () => {
        const tabId = 1;
        const payload: ToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
        };
        const actionName = 'enableVisualizationWithoutScan';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.EnableVisualHelperWithoutScan, [payload, tabId])
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onDisableVisualHelper', () => {
        const tabId = 1;
        const payload: ToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
        };
        const actionName = 'disableVisualization';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.DisableVisualHelper, [payload, tabId])
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload.test)
            .setupTelemetrySend(TelemetryEvents.DISABLE_VISUAL_HELPER, payload, 1);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onDisableVisualHelpersForTest', () => {
        const tabId = 1;
        const payload: ToggleActionPayload = {
            test: VisualizationType.HeadingsAssessment,
        };
        const actionName = 'disableVisualization';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.DisableVisualHelperForTest, [payload, tabId])
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload.test);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onOpenPreviewFeaturesPanel', () => {
        const tabId = 1;
        const actionName = 'openPreviewFeatures';
        const telemetryData: BaseTelemetryData = {
            triggeredBy: 'stub triggered by' as TriggeredBy,
            source: testSource,
        };

        const telemetryInfo = {
            telemetryData,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(PreviewFeaturesMessage.OpenPanel, [telemetryInfo, tabId])
            .setupActionOnPreviewFeaturesActions(actionName)
            .setupTelemetrySend(TelemetryEvents.PREVIEW_FEATURES_OPEN, telemetryInfo, tabId)
            .setupShowDetailsView(tabId)
            .setupPreviewFeaturesActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for switch focus back to target', () => {
        const pivot = DetailsViewPivotType.fastPass;
        const updatePivotActionName = 'updateSelectedPivot';
        const tabId = 1;

        const telemetryData: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'mouseclick',
            pivotKey: DetailsViewPivotType[pivot],
            source: testSource,
        };

        const actionCreatorPayload: OnDetailsViewPivotSelected = {
            pivotKey: pivot,
            telemetry: telemetryData,
        };

        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.PivotSelect, [actionCreatorPayload, tabId])
            .setupActionOnVisualizationActions(updatePivotActionName)
            .setupTelemetrySend(TelemetryEvents.DETAILS_VIEW_PIVOT_ACTIVATED, actionCreatorPayload, tabId)
            .setupVisualizationActionWithInvokeParameter(updatePivotActionName, actionCreatorPayload);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    function testScanCompleteWithExpectedParams(
        key: string,
        messageType: string,
        scanResultActionName: keyof VisualizationScanResultActions,
        telemetryName: string,
    ): void {
        const tabId = 1;
        const payload = {
            key,
            selectorMap: {
                key: 'value',
            },
            testType: -1,
        };
        const args = [payload, tabId];
        const actionName = 'scanCompleted';
        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(messageType, args)
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, null)
            .setupActionOnVisualizationScanResultActions(scanResultActionName)
            .setupVisualizationScanResultActionWithInvokeParameter(scanResultActionName, payload)
            .setupManifest({ name: 'testname', icons: { 128: 'iconUrl' } })
            .setupTelemetrySend(telemetryName, payload, tabId)
            .setupCreateNotificationByVisualizationKey(payload.selectorMap, key, payload.testType)
            .setupShowTargetTab(tabId, payload.testType, key);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    }
});

class ActionCreatorValidator {
    private visualizationActionsContainerMock = Mock.ofType(VisualizationActions);
    private visualizationActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};
    private devToolsActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};

    private visualizationScanResultActionsContainerMock = Mock.ofType(VisualizationScanResultActions);
    private visualizationScanResultActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};

    private detailsViewActionsContainerMock = Mock.ofType(DetailsViewActions);
    private previewFeaturesActionsContainerMock = Mock.ofType(PreviewFeaturesActions);
    private scopingActionsContainerMock = Mock.ofType(ScopingActions);
    private assessmentActionsContainerMock = Mock.ofType(AssessmentActions);
    private inspectActionsContainerMock = Mock.ofType(InspectActions);
    private previewFeaturesActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};
    private scopingActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};
    private detailsViewActionsMocks: DictionaryStringTo<IMock<Action<any>>> = {};

    private inspectActionsMock: DictionaryStringTo<IMock<Action<any>>> = {};

    private devToolActionsContainerMock = Mock.ofType(DevToolActions);

    private contentScriptInjectorStrictMock = Mock.ofType<ContentScriptInjector>(null, MockBehavior.Strict);
    private registerCallbackMock = Mock.ofInstance((messageType: string, callback: PayloadCallback) => {});
    private getManifestMock = Mock.ofInstance(() => {
        return null;
    });
    private switchToTabMock = Mock.ofInstance((tabId: number) => {}, MockBehavior.Strict);

    private actionHubMock: ActionHub = {
        visualizationActions: this.visualizationActionsContainerMock.object,
        visualizationScanResultActions: this.visualizationScanResultActionsContainerMock.object,
        tabActions: null,
        featureFlagActions: null,
        devToolActions: this.devToolActionsContainerMock.object,
        previewFeaturesActions: this.previewFeaturesActionsContainerMock.object,
        scopingActions: this.scopingActionsContainerMock.object,
        assessmentActions: this.assessmentActionsContainerMock.object,
        inspectActions: this.inspectActionsContainerMock.object,
        contentActions: null,
        detailsViewActions: this.detailsViewActionsContainerMock.object,
    };

    private telemetryEventHandlerStrictMock = Mock.ofType<TelemetryEventHandler>(null, MockBehavior.Strict);
    private notificationCreatorStrictMock = Mock.ofType<NotificationCreator>(null, MockBehavior.Strict);
    private targetTabControllerStrictMock = Mock.ofType<TargetTabController>(null, MockBehavior.Strict);
    private detailsViewControllerStrictMock: IMock<DetailsViewController> = Mock.ofType<DetailsViewController>(null, MockBehavior.Strict);
    private chromeFeatureControllerStrictMock: IMock<ChromeFeatureController> = Mock.ofType<ChromeFeatureController>(
        null,
        MockBehavior.Strict,
    );

    public setupSwithToTab(tabId: number): ActionCreatorValidator {
        this.switchToTabMock.setup(stt => stt(tabId)).verifiable(Times.once());

        return this;
    }

    private setupActionWithInvokeParameter(
        actionName: string,
        expectedInvokeParam: any,
        actionsMap: DictionaryStringTo<IMock<Action<any>>>,
    ): ActionCreatorValidator {
        let action = actionsMap[actionName];

        if (action == null) {
            action = Mock.ofType(Action);
            actionsMap[actionName] = action;
        }

        action.setup(am => am.invoke(It.isValue(expectedInvokeParam))).verifiable(Times.once());

        return this;
    }

    public setupVisualizationActionWithInvokeParameter(
        actionName: keyof VisualizationActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.visualizationActionMocks);
        return this;
    }

    public setupPreviewFeaturesActionWithInvokeParameter(
        actionName: keyof PreviewFeaturesActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.previewFeaturesActionMocks);
        return this;
    }

    public setupScopingActionWithInvokeParameter(actionName: string, expectedInvokeParam: any): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.scopingActionMocks);
        return this;
    }

    public setupVisualizationScanResultActionWithInvokeParameter(
        actionName: keyof VisualizationScanResultActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.visualizationScanResultActionMocks);
        return this;
    }

    public setupDevToolsActionWithInvokeParameter(actionName: keyof DevToolActions, expectedInvokeParam: any): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.devToolsActionMocks);
        return this;
    }

    public setupInspectActionWithInvokeParameter(actionName: keyof InspectActions, expectedInvokeParam: any): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.inspectActionsMock);
        return this;
    }

    public setupDetailsViewActionWithInvokeParameter(
        actionName: keyof DetailsViewActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.detailsViewActionsMocks);
        return this;
    }

    public setupCreateNotificationByVisualizationKey(
        selectorMap: DictionaryStringTo<any>,
        key: string,
        visualizationType: VisualizationType,
    ): ActionCreatorValidator {
        this.notificationCreatorStrictMock
            .setup(x => x.createNotificationByVisualizationKey(selectorMap, key, visualizationType))
            .verifiable(Times.once());

        return this;
    }

    public setupCreateNotification(message: string): ActionCreatorValidator {
        this.notificationCreatorStrictMock.setup(x => x.createNotification(message)).verifiable();

        return this;
    }

    public setupShowTargetTab(tabId: number, testType: VisualizationType, step: string): ActionCreatorValidator {
        this.targetTabControllerStrictMock.setup(ttcm => ttcm.showTargetTab(tabId, testType, step)).verifiable();

        return this;
    }

    public setupManifest(manifest): ActionCreatorValidator {
        this.getManifestMock.setup(getManifestMock => getManifestMock()).returns(() => manifest);

        return this;
    }

    public setupTelemetrySend(eventName: string, telemetryInfo: any, tabId: number): ActionCreatorValidator {
        this.telemetryEventHandlerStrictMock
            .setup(tsm => tsm.publishTelemetry(It.isValue(eventName), It.isValue(telemetryInfo)))
            .verifiable(Times.once());

        return this;
    }

    private setupAction(
        actionName: string,
        actionsMap: DictionaryStringTo<IMock<Action<any>>>,
        actionsContainerMock: IMock<any>,
    ): ActionCreatorValidator {
        let action = actionsMap[actionName];

        if (action == null) {
            action = Mock.ofType(Action);
            actionsMap[actionName] = action;
        }

        actionsContainerMock.setup(x => x[actionName]).returns(() => action.object);

        return this;
    }

    public setupActionOnDevToolsActions(actionName: keyof DevToolActions): ActionCreatorValidator {
        this.setupAction(actionName, this.devToolsActionMocks, this.devToolActionsContainerMock);
        return this;
    }

    public setupActionOnVisualizationActions(actionName: keyof VisualizationActions): ActionCreatorValidator {
        this.setupAction(actionName, this.visualizationActionMocks, this.visualizationActionsContainerMock);
        return this;
    }

    public setupActionOnPreviewFeaturesActions(actionName: keyof PreviewFeaturesActions): ActionCreatorValidator {
        this.setupAction(actionName, this.previewFeaturesActionMocks, this.previewFeaturesActionsContainerMock);
        return this;
    }

    public setupActionsOnScopingActions(actionName: keyof ScopingActions): ActionCreatorValidator {
        this.setupAction(actionName, this.scopingActionMocks, this.scopingActionsContainerMock);
        return this;
    }

    public setupActionOnDetailsViewActions(actionName: keyof DetailsViewActions): ActionCreatorValidator {
        this.setupAction(actionName, this.detailsViewActionsMocks, this.detailsViewActionsContainerMock);
        return this;
    }

    public setupActionOnVisualizationScanResultActions(actionName: keyof VisualizationScanResultActions): ActionCreatorValidator {
        this.setupAction(actionName, this.visualizationScanResultActionMocks, this.visualizationScanResultActionsContainerMock);
        return this;
    }

    public setupActionsOnInspectActions(actionName: keyof InspectActions): ActionCreatorValidator {
        this.setupAction(actionName, this.inspectActionsMock, this.inspectActionsContainerMock);
        return this;
    }

    public setupRegistrationCallback(expectedType: string, callbackParams?: any[]): ActionCreatorValidator {
        this.registerCallbackMock
            .setup(rc => rc(It.isValue(expectedType), It.isAny()))
            .callback((messageType, callback) => {
                if (callbackParams) {
                    callback.apply(null, callbackParams);
                } else {
                    callback();
                }
            })
            .verifiable(Times.once());

        return this;
    }

    public setupShowDetailsView(tabId: number): ActionCreatorValidator {
        this.detailsViewControllerStrictMock.setup(ct => ct.showDetailsView(It.isValue(tabId))).verifiable();

        return this;
    }

    public buildActionCreator(): ActionCreator {
        return new ActionCreator(
            this.actionHubMock,
            this.registerCallbackMock.object,
            this.detailsViewControllerStrictMock.object,
            this.chromeFeatureControllerStrictMock.object,
            this.telemetryEventHandlerStrictMock.object,
            this.notificationCreatorStrictMock.object,
            new VisualizationConfigurationFactory(),
            this.targetTabControllerStrictMock.object,
        );
    }

    public verifyAll(): void {
        this.telemetryEventHandlerStrictMock.verifyAll();

        this.verifyAllActionMocks();

        this.visualizationScanResultActionsContainerMock.verifyAll();

        this.notificationCreatorStrictMock.verifyAll();
        this.registerCallbackMock.verifyAll();
        this.detailsViewControllerStrictMock.verifyAll();
        this.contentScriptInjectorStrictMock.verifyAll();
        this.chromeFeatureControllerStrictMock.verifyAll();
        this.targetTabControllerStrictMock.verifyAll();
    }

    public setupChromeFeatureController(): ActionCreatorValidator {
        this.chromeFeatureControllerStrictMock.setup(cfc => cfc.openCommandConfigureTab()).verifiable();

        return this;
    }

    private verifyAllActionMocks(): void {
        this.verifyAllActions(this.visualizationActionMocks);
        this.verifyAllActions(this.visualizationScanResultActionMocks);
        this.verifyAllActions(this.devToolsActionMocks);
        this.verifyAllActions(this.inspectActionsMock);
        this.verifyAllActions(this.detailsViewActionsMocks);
        this.verifyAllActions(this.previewFeaturesActionMocks);
        this.verifyAllActions(this.scopingActionMocks);
    }

    private verifyAllActions(actionsMap: DictionaryStringTo<IMock<Action<any>>>): void {
        forOwn(actionsMap, action => {
            action.verifyAll();
        });
    }
}
