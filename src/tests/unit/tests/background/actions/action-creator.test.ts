// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionCreator } from 'background/actions/action-creator';
import { ActionHub } from 'background/actions/action-hub';
import {
    AddTabbedElementPayload,
    BaseActionPayload,
    ChangeInstanceStatusPayload,
    OnDetailsViewOpenPayload,
    OnDetailsViewPivotSelected,
    RescanVisualizationPayload,
    ToggleActionPayload,
    VisualizationTogglePayload,
} from 'background/actions/action-payloads';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { CardSelectionActions } from 'background/actions/card-selection-actions';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { DevToolActions } from 'background/actions/dev-tools-actions';
import { InspectActions } from 'background/actions/inspect-actions';
import { ScopingActions } from 'background/actions/scoping-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { VisualizationScanResultActions } from 'background/actions/visualization-scan-result-actions';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { ContentScriptInjector } from 'background/injector/content-script-injector';
import { Interpreter } from 'background/interpreter';
import { TargetTabController } from 'background/target-tab-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import {
    BaseTelemetryData,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    TelemetryEventSource,
    ToggleTelemetryData,
    TriggeredBy,
} from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { NotificationCreator } from 'common/notification-creator';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { forOwn } from 'lodash';
import { tick } from 'tests/unit/common/tick';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

const VisualizationMessage = Messages.Visualizations;

describe('ActionCreatorTest', () => {
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    test('registerCallback for tab stops visualization toggle (to enable)', () => {
        const actionName = 'enableVisualization';
        const startScanActionName = 'startScan';
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
            .setupActionOnUnifiedScanResultActions(startScanActionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload)
            .setupUnifiedScanResultActionWithInvokeParameter(startScanActionName, null)
            .setupSwitchToTab(tabId)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for tab stops visualization toggle (to disabled)', () => {
        const actionName = 'disableVisualization';
        const startScanActionName = 'startScan';
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
            .setupActionOnUnifiedScanResultActions(startScanActionName)
            .setupVisualizationActionWithInvokeParameter(actionName, test)
            .setupUnifiedScanResultActionWithInvokeParameter(startScanActionName, null)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for visualization toggle (to enable)', () => {
        const actionName = 'enableVisualization';
        const startScanActionName = 'startScan';
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
            .setupActionOnUnifiedScanResultActions(startScanActionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload)
            .setupUnifiedScanResultActionWithInvokeParameter(startScanActionName, null)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for visualization toggle (to disable)', () => {
        const actionName = 'disableVisualization';
        const startScanActionName = 'startScan';
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
            .setupActionOnUnifiedScanResultActions(startScanActionName)
            .setupVisualizationActionWithInvokeParameter(actionName, test)
            .setupUnifiedScanResultActionWithInvokeParameter(startScanActionName, null)
            .setupRegistrationCallback(VisualizationMessage.Common.Toggle, args)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == null', async () => {
        const tabId = 1;
        const viewType = null;
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

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [
                actionCreatorPayload,
                tabId,
            ])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await tick();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == TabStops', async () => {
        const tabId = 1;
        const viewType = VisualizationType.TabStops;
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

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [
                actionCreatorPayload,
                tabId,
            ])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await tick();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == Issues', async () => {
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
        const startScanActionName = 'startScan';
        const enableVisualizationTelemetryPayload: VisualizationTogglePayload = {
            enabled: true,
            test: viewType,
            telemetry: null,
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [
                actionCreatorPayload,
                tabId,
            ])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupActionOnUnifiedScanResultActions(startScanActionName)
            .setupUnifiedScanResultActionWithInvokeParameter(startScanActionName, null)
            .setupActionOnVisualizationActions(enablingIssuesActionName)
            .setupVisualizationActionWithInvokeParameter(
                enablingIssuesActionName,
                enableVisualizationTelemetryPayload,
            )
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupTelemetrySend(
                TelemetryEvents.AUTOMATED_CHECKS_TOGGLE,
                enableVisualizationTelemetryPayload,
                tabId,
            )
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await tick();

        validator.verifyAll();
    });

    test('registerCallbacks for openDetailsView == HeadingsAssessment', async () => {
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
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Open, [
                actionCreatorPayload,
                tabId,
            ])
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await tick();

        validator.verifyAll();
    });

    test('registerCallbacks for closeDetailsView', () => {
        const tabId = 1;
        const disableAssessmentVisualizationActionName = 'disableAssessmentVisualizations';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.DetailsView.Close, [null, tabId])
            .setupActionOnVisualizationActions(disableAssessmentVisualizationActionName)
            .setupVisualizationActionWithInvokeParameter(
                disableAssessmentVisualizationActionName,
                null,
            );

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallbacks for scrollRequested', () => {
        const visualizationActionName = 'scrollRequested';
        const cardSelectionActionName = 'resetFocusedIdentifier';
        const tabId = 1;
        const builder = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(visualizationActionName)
            .setupVisualizationActionWithInvokeParameter(visualizationActionName, null)
            .setupActionOnCardSelectionActions(cardSelectionActionName)
            .setupCardSelectionActionWithInvokeParameter(cardSelectionActionName, null)
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

    test('registerCallback for onAdHocScanCompleted', () => {
        const key = 'Key should not matter';
        const actionName = 'scanCompleted';
        const message = VisualizationMessage.Common.ScanCompleted;
        const telemetryEventName = TelemetryEvents.ADHOC_SCAN_COMPLETED;
        testScanCompleteWithExpectedParams(key, message, actionName, telemetryEventName);
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
            .setupRegistrationCallback(getStoreStateMessage(StoreNames.VisualizationStore), args)
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
            .setupRegistrationCallback(
                getStoreStateMessage(StoreNames.VisualizationScanResultStore),
                args,
            )
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, null);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    describe('registerCallback for onDetailsViewSelected', () => {
        const viewType = VisualizationType.Issues;
        const pivotType = DetailsViewPivotType.fastPass;
        const updateViewActionName = 'updateSelectedPivotChild';
        const closeSidePanelActionName = 'closeSidePanel';
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

        it('updates details view state and sends telemetry', async () => {
            const builder = new ActionCreatorValidator()
                .setupRegistrationCallback(VisualizationMessage.DetailsView.Select, [
                    actionCreatorPayload,
                    tabId,
                ])
                .setupActionOnVisualizationActions(updateViewActionName)
                .setupVisualizationActionWithInvokeParameter(
                    updateViewActionName,
                    actionCreatorPayload,
                )
                .setupActionOnSidePanelActions(closeSidePanelActionName)
                .setupSidePanelActionWithInvokeParameter(
                    closeSidePanelActionName,
                    'PreviewFeatures',
                )
                .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, 1)
                .setupShowDetailsView(tabId, Promise.resolve());

            const actionCreator = builder.buildActionCreator();

            actionCreator.registerCallbacks();

            await tick();

            builder.verifyAll();
        });

        it('propagates show details view error to the logger', async () => {
            const showDetailsViewErrorMessage = 'error on showDetailsView';

            const builder = new ActionCreatorValidator()
                .setupRegistrationCallback(VisualizationMessage.DetailsView.Select, [
                    actionCreatorPayload,
                    tabId,
                ])
                .setupActionOnVisualizationActions(updateViewActionName)
                .setupVisualizationActionWithInvokeParameter(
                    updateViewActionName,
                    actionCreatorPayload,
                )
                .setupActionOnSidePanelActions(closeSidePanelActionName)
                .setupSidePanelActionWithInvokeParameter(
                    closeSidePanelActionName,
                    'PreviewFeatures',
                )
                .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, 1)
                .setupShowDetailsView(
                    tabId,
                    Promise.reject({ message: showDetailsViewErrorMessage }),
                )
                .setupLogError(showDetailsViewErrorMessage);

            const actionCreator = builder.buildActionCreator();

            actionCreator.registerCallbacks();

            await tick();

            builder.verifyAll();
        });
    });

    test('registerCallback for onRecordingCompleted', () => {
        const tabId = 1;
        const actionCreatorPayload = {
            telemetry: {},
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(VisualizationMessage.TabStops.RecordingCompleted, [
                actionCreatorPayload,
                tabId,
            ])
            .setupTelemetrySend(
                TelemetryEvents.TABSTOPS_RECORDING_COMPLETE,
                actionCreatorPayload,
                tabId,
            );
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
            scanIncompleteWarnings: [],
        };

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Assessment.AssessmentScanCompleted, [
                payload,
                tabId,
            ])
            .setupTelemetrySend(TelemetryEvents.ASSESSMENT_SCAN_COMPLETED, payload, tabId)
            .setupCreateNotificationByVisualizationKey(
                payload.selectorMap,
                payload.key,
                payload.testType,
                payload.scanIncompleteWarnings,
            )
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
            .setupRegistrationCallback(Messages.Assessment.StartOverTest, [payload, tabId])
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
            .setupRegistrationCallback(Messages.Assessment.StartOverAllAssessments, [
                payload,
                tabId,
            ])
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
            .setupRegistrationCallback(Messages.Assessment.CancelStartOverAllAssessments, [
                payload,
                tabId,
            ])
            .setupTelemetrySend(TelemetryEvents.CANCEL_START_OVER_ASSESSMENT, payload, tabId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onRescanVisualization', () => {
        const tabId = 1;
        const payload: RescanVisualizationPayload = {
            test: VisualizationType.HeadingsAssessment,
        };
        const disableActionName = 'disableVisualization';
        const enableActionName = 'enableVisualization';
        const startScanActionName = 'startScan';

        const validator = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.Visualizations.Common.RescanVisualization, [
                payload,
                tabId,
            ])
            .setupActionOnVisualizationActions(disableActionName)
            .setupActionOnVisualizationActions(enableActionName)
            .setupActionOnUnifiedScanResultActions(startScanActionName)
            .setupVisualizationActionWithInvokeParameter(disableActionName, payload.test)
            .setupVisualizationActionWithInvokeParameter(enableActionName, payload)
            .setupUnifiedScanResultActionWithInvokeParameter(startScanActionName, null)
            .setupTelemetrySend(TelemetryEvents.RESCAN_VISUALIZATION, payload, tabId);
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
            .setupRegistrationCallback(Messages.Assessment.EnableVisualHelperWithoutScan, [
                payload,
                tabId,
            ])
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
            .setupRegistrationCallback(Messages.Assessment.DisableVisualHelperForTest, [
                payload,
                tabId,
            ])
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload.test);
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
            .setupRegistrationCallback(VisualizationMessage.DetailsView.PivotSelect, [
                actionCreatorPayload,
                tabId,
            ])
            .setupActionOnVisualizationActions(updatePivotActionName)
            .setupTelemetrySend(
                TelemetryEvents.DETAILS_VIEW_PIVOT_ACTIVATED,
                actionCreatorPayload,
                tabId,
            )
            .setupVisualizationActionWithInvokeParameter(
                updatePivotActionName,
                actionCreatorPayload,
            );

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
            scanIncompleteWarnings: [],
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
            .setupCreateNotificationByVisualizationKey(
                payload.selectorMap,
                key,
                payload.testType,
                payload.scanIncompleteWarnings,
            )
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
    private cardSelectionActionsMocks: DictionaryStringTo<IMock<Action<any>>> = {};
    private unifiedScanResultActionsMocks: DictionaryStringTo<IMock<Action<any>>> = {};

    private visualizationScanResultActionsContainerMock = Mock.ofType(
        VisualizationScanResultActions,
    );
    private visualizationScanResultActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};

    private detailsViewActionsContainerMock = Mock.ofType(DetailsViewActions);
    private sidePanelActionsContainerMock = Mock.ofType(SidePanelActions);
    private scopingActionsContainerMock = Mock.ofType(ScopingActions);
    private assessmentActionsContainerMock = Mock.ofType(AssessmentActions);
    private inspectActionsContainerMock = Mock.ofType(InspectActions);
    private cardSelectionActionsContainerMock = Mock.ofType(CardSelectionActions);
    private unifiedScanResultsActionsContainerMock = Mock.ofType(UnifiedScanResultActions);
    private sidePanelActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};
    private scopingActionMocks: DictionaryStringTo<IMock<Action<any>>> = {};
    private detailsViewActionsMocks: DictionaryStringTo<IMock<Action<any>>> = {};

    private inspectActionsMock: DictionaryStringTo<IMock<Action<any>>> = {};

    private devToolActionsContainerMock = Mock.ofType(DevToolActions);

    private contentScriptInjectorStrictMock = Mock.ofType<ContentScriptInjector>(
        null,
        MockBehavior.Strict,
    );
    private interpreterMock = Mock.ofType<Interpreter>();
    private getManifestMock = Mock.ofInstance(() => {
        return null;
    });
    private switchToTabMock = Mock.ofInstance((tabId: number) => {}, MockBehavior.Strict);

    private actionHubMock: ActionHub = {
        visualizationActions: this.visualizationActionsContainerMock.object,
        visualizationScanResultActions: this.visualizationScanResultActionsContainerMock.object,
        devToolActions: this.devToolActionsContainerMock.object,
        sidePanelActions: this.sidePanelActionsContainerMock.object,
        scopingActions: this.scopingActionsContainerMock.object,
        assessmentActions: this.assessmentActionsContainerMock.object,
        inspectActions: this.inspectActionsContainerMock.object,
        detailsViewActions: this.detailsViewActionsContainerMock.object,
        cardSelectionActions: this.cardSelectionActionsContainerMock.object,
        scanResultActions: this.unifiedScanResultsActionsContainerMock.object,
    } as ActionHub;

    private telemetryEventHandlerStrictMock = Mock.ofType<TelemetryEventHandler>(
        null,
        MockBehavior.Strict,
    );
    private notificationCreatorStrictMock = Mock.ofType<NotificationCreator>(
        null,
        MockBehavior.Strict,
    );
    private targetTabControllerStrictMock = Mock.ofType<TargetTabController>(
        null,
        MockBehavior.Strict,
    );
    private detailsViewControllerStrictMock: IMock<ExtensionDetailsViewController> =
        Mock.ofType<ExtensionDetailsViewController>(null, MockBehavior.Strict);

    private loggerMock = Mock.ofType<Logger>();

    public setupSwitchToTab(tabId: number): ActionCreatorValidator {
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
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.visualizationActionMocks,
        );
        return this;
    }

    public setupCardSelectionActionWithInvokeParameter(
        actionName: keyof CardSelectionActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.cardSelectionActionsMocks,
        );
        return this;
    }

    public setupLogError(message: string): ActionCreatorValidator {
        this.loggerMock.setup(logger => logger.error(message)).verifiable(Times.once());

        return this;
    }

    public setupSidePanelActionWithInvokeParameter(
        actionName: keyof SidePanelActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.sidePanelActionMocks,
        );
        return this;
    }

    public setupVisualizationScanResultActionWithInvokeParameter(
        actionName: keyof VisualizationScanResultActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.visualizationScanResultActionMocks,
        );
        return this;
    }

    public setupInspectActionWithInvokeParameter(
        actionName: keyof InspectActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.inspectActionsMock,
        );
        return this;
    }

    public setupUnifiedScanResultActionWithInvokeParameter(
        actionName: keyof UnifiedScanResultActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.unifiedScanResultActionsMocks,
        );
        return this;
    }

    public setupCreateNotificationByVisualizationKey(
        selectorMap: DictionaryStringTo<any>,
        key: string,
        visualizationType: VisualizationType,
        warnings: ScanIncompleteWarningId[],
    ): ActionCreatorValidator {
        this.notificationCreatorStrictMock
            .setup(x =>
                x.createNotificationByVisualizationKey(
                    selectorMap,
                    key,
                    visualizationType,
                    warnings,
                ),
            )
            .verifiable(Times.once());

        return this;
    }

    public setupShowTargetTab(
        tabId: number,
        testType: VisualizationType,
        step: string,
    ): ActionCreatorValidator {
        this.targetTabControllerStrictMock
            .setup(controller => controller.showTargetTab(tabId, testType, step))
            .verifiable();

        return this;
    }

    public setupManifest(manifest): ActionCreatorValidator {
        this.getManifestMock.setup(getManifestMock => getManifestMock()).returns(() => manifest);

        return this;
    }

    public setupTelemetrySend(
        eventName: string,
        telemetryInfo: any,
        tabId: number,
    ): ActionCreatorValidator {
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

    public setupActionOnCardSelectionActions(
        actionName: keyof CardSelectionActions,
    ): ActionCreatorValidator {
        this.setupAction(
            actionName,
            this.cardSelectionActionsMocks,
            this.cardSelectionActionsContainerMock,
        );

        return this;
    }

    public setupActionOnVisualizationActions(
        actionName: keyof VisualizationActions,
    ): ActionCreatorValidator {
        this.setupAction(
            actionName,
            this.visualizationActionMocks,
            this.visualizationActionsContainerMock,
        );
        return this;
    }

    public setupActionOnSidePanelActions(
        actionName: keyof SidePanelActions,
    ): ActionCreatorValidator {
        this.setupAction(actionName, this.sidePanelActionMocks, this.sidePanelActionsContainerMock);
        return this;
    }

    public setupActionOnVisualizationScanResultActions(
        actionName: keyof VisualizationScanResultActions,
    ): ActionCreatorValidator {
        this.setupAction(
            actionName,
            this.visualizationScanResultActionMocks,
            this.visualizationScanResultActionsContainerMock,
        );
        return this;
    }

    public setupActionsOnInspectActions(actionName: keyof InspectActions): ActionCreatorValidator {
        this.setupAction(actionName, this.inspectActionsMock, this.inspectActionsContainerMock);
        return this;
    }

    public setupActionOnUnifiedScanResultActions(
        actionName: keyof UnifiedScanResultActions,
    ): ActionCreatorValidator {
        this.setupAction(
            actionName,
            this.unifiedScanResultActionsMocks,
            this.unifiedScanResultsActionsContainerMock,
        );
        return this;
    }

    public setupRegistrationCallback(
        expectedType: string,
        callbackParams?: any[],
    ): ActionCreatorValidator {
        this.interpreterMock
            .setup(interpreter =>
                interpreter.registerTypeToPayloadCallback(It.isValue(expectedType), It.isAny()),
            )
            .callback((messageType, callback) => {
                if (callbackParams) {
                    callback(...callbackParams);
                } else {
                    callback();
                }
            })
            .verifiable(Times.once());

        return this;
    }

    public setupShowDetailsView(tabId: number, result: Promise<void>): ActionCreatorValidator {
        this.detailsViewControllerStrictMock
            .setup(controller => controller.showDetailsView(tabId))
            .returns(() => result)
            .verifiable(Times.once());

        return this;
    }

    public buildActionCreator(): ActionCreator {
        return new ActionCreator(
            this.interpreterMock.object,
            this.actionHubMock,
            this.detailsViewControllerStrictMock.object,
            this.telemetryEventHandlerStrictMock.object,
            this.notificationCreatorStrictMock.object,
            new WebVisualizationConfigurationFactory(),
            this.targetTabControllerStrictMock.object,
            this.loggerMock.object,
        );
    }

    public verifyAll(): void {
        this.telemetryEventHandlerStrictMock.verifyAll();

        this.verifyAllActionMocks();

        this.visualizationScanResultActionsContainerMock.verifyAll();

        this.notificationCreatorStrictMock.verifyAll();
        this.interpreterMock.verifyAll();
        this.detailsViewControllerStrictMock.verifyAll();
        this.contentScriptInjectorStrictMock.verifyAll();
        this.targetTabControllerStrictMock.verifyAll();
        this.loggerMock.verifyAll();
    }

    private verifyAllActionMocks(): void {
        this.verifyAllActions(this.visualizationActionMocks);
        this.verifyAllActions(this.visualizationScanResultActionMocks);
        this.verifyAllActions(this.devToolsActionMocks);
        this.verifyAllActions(this.inspectActionsMock);
        this.verifyAllActions(this.detailsViewActionsMocks);
        this.verifyAllActions(this.sidePanelActionMocks);
        this.verifyAllActions(this.scopingActionMocks);
        this.verifyAllActions(this.cardSelectionActionsMocks);
    }

    private verifyAllActions(actionsMap: DictionaryStringTo<IMock<Action<any>>>): void {
        forOwn(actionsMap, action => {
            action.verifyAll();
        });
    }
}
