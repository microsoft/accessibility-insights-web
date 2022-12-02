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
import { NeedsReviewCardSelectionActions } from 'background/actions/needs-review-card-selection-actions';
import { ScopingActions } from 'background/actions/scoping-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { TabStopRequirementActions } from 'background/actions/tab-stop-requirement-actions';
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { VisualizationScanResultActions } from 'background/actions/visualization-scan-result-actions';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { ContentScriptInjector } from 'background/injector/content-script-injector';
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
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { forOwn } from 'lodash';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

const VisualizationMessage = Messages.Visualizations;

describe('ActionCreatorTest', () => {
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    test('registerCallback for tab stops visualization toggle (to enable)', async () => {
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

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload)
            .setupSwitchToTab(tabId)
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.Common.Toggle, payload, tabId);

        validator.verifyAll();
    });

    test('registerCallback for tab stops visualization toggle (to disabled)', async () => {
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

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, test)
            .setupTelemetrySend(TelemetryEvents.TABSTOPS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.Common.Toggle, payload, tabId);

        validator.verifyAll();
    });

    test('registerCallback for visualization toggle (to enable)', async () => {
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

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, payload)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.Common.Toggle, payload, tabId);

        validator.verifyAll();
    });

    test('registerCallback for visualization toggle (to disable)', async () => {
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

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, test)
            .setupTelemetrySend(TelemetryEvents.HEADINGS_TOGGLE, payload, tabId);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.Common.Toggle, payload, tabId);

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
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            VisualizationMessage.DetailsView.Open,
            actionCreatorPayload,
            tabId,
        );

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
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            VisualizationMessage.DetailsView.Open,
            actionCreatorPayload,
            tabId,
        );

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
        const enableVisualizationTelemetryPayload: VisualizationTogglePayload = {
            enabled: true,
            test: viewType,
            telemetry: null,
        };

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
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

        await validator.simulateMessage(
            VisualizationMessage.DetailsView.Open,
            actionCreatorPayload,
            tabId,
        );

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
            .setupActionOnVisualizationActions(updateViewActionName)
            .setupVisualizationActionWithInvokeParameter(updateViewActionName, actionCreatorPayload)
            .setupTelemetrySend(TelemetryEvents.PIVOT_CHILD_SELECTED, actionCreatorPayload, tabId)
            .setupShowDetailsView(tabId, Promise.resolve());

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            VisualizationMessage.DetailsView.Open,
            actionCreatorPayload,
            tabId,
        );

        validator.verifyAll();
    });

    test('registerCallbacks for closeDetailsView', async () => {
        const tabId = 1;
        const disableAssessmentVisualizationActionName = 'disableAssessmentVisualizations';

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(disableAssessmentVisualizationActionName)
            .setupVisualizationActionWithInvokeParameter(
                disableAssessmentVisualizationActionName,
                null,
            );

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.DetailsView.Close, null, tabId);

        validator.verifyAll();
    });

    test('registerCallbacks for scrollRequested', async () => {
        const visualizationActionName = 'scrollRequested';
        const cardSelectionActionName = 'resetFocusedIdentifier';
        const tabId = 1;
        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(visualizationActionName)
            .setupVisualizationActionWithInvokeParameter(visualizationActionName, null)
            .setupActionOnCardSelectionActions(cardSelectionActionName)
            .setupCardSelectionActionWithInvokeParameter(cardSelectionActionName, null)
            .setupActionOnNeedsReviewCardSelectionActions(cardSelectionActionName)
            .setupNeedsReviewCardSelectionActionWithInvokeParameter(cardSelectionActionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.Common.ScrollRequested, null, tabId);

        validator.verifyAll();
    });

    test('registerCallbacks for onUpdateFocusedInstance', async () => {
        const instanceId = '#headings-1';
        const actionName = 'updateFocusedInstance';
        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, instanceId);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            VisualizationMessage.Issues.UpdateFocusedInstance,
            instanceId,
            1,
        );

        validator.verifyAll();
    });

    test('registerCallbacks for onSetHoveredOverSelector', async () => {
        const selector = ['some selector'];
        const actionName = 'setHoveredOverSelector';
        const validator = new ActionCreatorValidator()
            .setupActionsOnInspectActions(actionName)
            .setupInspectActionWithInvokeParameter(actionName, selector);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(Messages.Inspect.SetHoveredOverSelector, selector);

        validator.verifyAll();
    });

    test('registerCallback for onAdHocScanCompleted', async () => {
        const key = 'Key should not matter';
        const actionName = 'scanCompleted';
        const message = VisualizationMessage.Common.ScanCompleted;
        const telemetryEventName = TelemetryEvents.ADHOC_SCAN_COMPLETED;
        await testScanCompleteWithExpectedParams(key, message, actionName, telemetryEventName);
    });

    test('registerCallback for tabbed element added', async () => {
        const tabbedElement: AddTabbedElementPayload = {
            tabbedElements: [
                {
                    target: ['selector'],
                    html: 'test',
                    timestamp: 1,
                },
            ],
        };

        const actionName = 'addTabbedElement';
        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, tabbedElement);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            Messages.Visualizations.TabStops.TabbedElementAdded,
            tabbedElement,
        );

        validator.verifyAll();
    });

    test('registerCallbacks for state GetCurrentVisualizationToggleState', async () => {
        const actionName = 'getCurrentState';
        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(actionName)
            .setupVisualizationActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(getStoreStateMessage(StoreNames.VisualizationStore), null);

        validator.verifyAll();
    });

    test('registerCallbacks for state GetCurrentVisualizationResultState', async () => {
        const args = [];
        const actionName = 'getCurrentState';
        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            args,
        );

        validator.verifyAll();
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
            const validator = new ActionCreatorValidator()
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

            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(
                VisualizationMessage.DetailsView.Select,
                actionCreatorPayload,
                tabId,
            );

            validator.verifyAll();
        });

        it('propagates show details view error to the logger', async () => {
            const showDetailsViewErrorMessage = 'error on showDetailsView';

            const validator = new ActionCreatorValidator()
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

            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(
                VisualizationMessage.DetailsView.Select,
                actionCreatorPayload,
                tabId,
            );

            validator.verifyAll();
        });
    });

    test('registerCallback for onRecordingCompleted', async () => {
        const tabId = 1;
        const actionCreatorPayload = {
            telemetry: {},
        };

        const validator = new ActionCreatorValidator().setupTelemetrySend(
            TelemetryEvents.TABSTOPS_RECORDING_COMPLETE,
            actionCreatorPayload,
            tabId,
        );
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            VisualizationMessage.TabStops.RecordingCompleted,
            actionCreatorPayload,
            tabId,
        );

        validator.verifyAll();
    });

    test('registerCallback for onRecordingTerminated', async () => {
        const tabId = 1;
        const actionName = 'disableTabStop';

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationScanResultActions(actionName)
            .setupVisualizationScanResultActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(VisualizationMessage.TabStops.TerminateScan, null, tabId);

        validator.verifyAll();
    });

    describe('onAssessmentScanCompleted', () => {
        const testCases = [
            [
                Messages.Assessment.AssessmentScanCompleted,
                TelemetryEvents.ASSESSMENT_SCAN_COMPLETED,
            ],
            [
                Messages.MediumPass.AssessmentScanCompleted,
                TelemetryEvents.MEDIUM_PASS_SCAN_COMPLETED,
            ],
        ];

        test.each(testCases)('registerCallback with %s', async (eventType, telemetryEvent) => {
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
                .setupTelemetrySend(telemetryEvent, payload, tabId)
                .setupCreateNotificationByVisualizationKey(
                    payload.selectorMap,
                    payload.key,
                    payload.testType,
                    payload.scanIncompleteWarnings,
                )
                .setupShowTargetTab(tabId, payload.testType, payload.key);

            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onStartOverAssessment', () => {
        const testCases = [Messages.Assessment.StartOverTest, Messages.MediumPass.StartOverTest];

        test.each(testCases)('registerCallback with %s', async eventType => {
            const tabId = 1;
            const payload: ChangeInstanceStatusPayload = {
                test: VisualizationType.HeadingsAssessment,
                status: null,
                requirement: null,
                selector: null,
            };
            const disableActionName = 'disableVisualization';

            const validator = new ActionCreatorValidator()
                .setupActionOnVisualizationActions(disableActionName)
                .setupVisualizationActionWithInvokeParameter(disableActionName, payload.test)
                .setupTelemetrySend(TelemetryEvents.START_OVER_TEST, payload, 1);
            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onCancelStartOverAssessment', () => {
        const testCases = [
            Messages.Assessment.CancelStartOver,
            Messages.MediumPass.CancelStartOver,
        ];

        test.each(testCases)('registerCallback with %s', async eventType => {
            const tabId = 1;
            const payload: BaseActionPayload = {};

            const validator = new ActionCreatorValidator().setupTelemetrySend(
                TelemetryEvents.CANCEL_START_OVER_TEST,
                payload,
                tabId,
            );

            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onStartOverAllAssessments', () => {
        const testCases = [
            [Messages.Assessment.StartOverAllAssessments, TelemetryEvents.START_OVER_ASSESSMENT],
            [Messages.MediumPass.StartOverAllAssessments, TelemetryEvents.START_OVER_MEDIUM_PASS],
        ];

        test.each(testCases)('registerCallback with %s', async (eventType, telemetryEvent) => {
            const tabId = 1;
            const payload: ChangeInstanceStatusPayload = {
                test: VisualizationType.HeadingsAssessment,
                status: null,
                requirement: null,
                selector: null,
            };
            const disableActionName = 'disableAssessmentVisualizations';

            const validator = new ActionCreatorValidator()
                .setupActionOnVisualizationActions(disableActionName)
                .setupVisualizationActionWithInvokeParameter(disableActionName, null)
                .setupTelemetrySend(telemetryEvent, payload, 1);
            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onCancelStartOverAllAssessments', () => {
        const testCases = [
            [
                Messages.Assessment.CancelStartOverAllAssessments,
                TelemetryEvents.CANCEL_START_OVER_ASSESSMENT,
            ],
            [
                Messages.MediumPass.CancelStartOverAllAssessments,
                TelemetryEvents.CANCEL_START_OVER_MEDIUM_PASS,
            ],
        ];

        test.each(testCases)('registerCallback with %s', async (eventType, telemetryEvent) => {
            const tabId = 1;
            const payload: BaseActionPayload = {};

            const validator = new ActionCreatorValidator().setupTelemetrySend(
                telemetryEvent,
                payload,
                tabId,
            );

            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    test('registerCallback for onRescanVisualization', async () => {
        const tabId = 1;
        const payload: RescanVisualizationPayload = {
            test: VisualizationType.HeadingsAssessment,
        };
        const disableActionName = 'disableVisualization';
        const enableActionName = 'enableVisualization';
        const resetDataForVisualization = 'resetDataForVisualization';

        const validator = new ActionCreatorValidator()
            .setupActionOnVisualizationActions(disableActionName)
            .setupActionOnVisualizationActions(resetDataForVisualization)
            .setupActionOnVisualizationActions(enableActionName)
            .setupVisualizationActionWithInvokeParameter(disableActionName, payload.test)
            .setupVisualizationActionWithInvokeParameter(resetDataForVisualization, payload.test)
            .setupVisualizationActionWithInvokeParameter(enableActionName, payload)
            .setupTelemetrySend(TelemetryEvents.RESCAN_VISUALIZATION, payload, tabId);
        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            Messages.Visualizations.Common.RescanVisualization,
            payload,
            tabId,
        );

        validator.verifyAll();
    });

    describe('onEnableVisualHelper', () => {
        const testCases = [
            Messages.Assessment.EnableVisualHelper,
            Messages.MediumPass.EnableVisualHelper,
        ];

        test.each(testCases)('registerCallback with %s', async eventType => {
            const tabId = 1;
            const payload: ToggleActionPayload = {
                test: VisualizationType.HeadingsAssessment,
            };
            const actionName = 'enableVisualization';

            const validator = new ActionCreatorValidator()
                .setupActionOnVisualizationActions(actionName)
                .setupVisualizationActionWithInvokeParameter(actionName, payload);
            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onEnableVisualHelperWithoutScan', () => {
        const testCases = [
            Messages.Assessment.EnableVisualHelperWithoutScan,
            Messages.MediumPass.EnableVisualHelperWithoutScan,
        ];

        test.each(testCases)('registerCallback with %s', async eventType => {
            const tabId = 1;
            const payload: ToggleActionPayload = {
                test: VisualizationType.HeadingsAssessment,
            };
            const actionName = 'enableVisualizationWithoutScan';

            const validator = new ActionCreatorValidator()
                .setupActionOnVisualizationActions(actionName)
                .setupVisualizationActionWithInvokeParameter(actionName, payload);
            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onDisableVisualHelper', () => {
        const testCases = [
            Messages.Assessment.DisableVisualHelper,
            Messages.MediumPass.DisableVisualHelper,
        ];

        test.each(testCases)('registerCallback with %s', async eventType => {
            const tabId = 1;
            const payload: ToggleActionPayload = {
                test: VisualizationType.HeadingsAssessment,
            };
            const actionName = 'disableVisualization';

            const validator = new ActionCreatorValidator()
                .setupActionOnVisualizationActions(actionName)
                .setupVisualizationActionWithInvokeParameter(actionName, payload.test)
                .setupTelemetrySend(TelemetryEvents.DISABLE_VISUAL_HELPER, payload, 1);

            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    describe('onDisableVisualHelpersForTest', () => {
        const testCases = [
            Messages.Assessment.DisableVisualHelperForTest,
            Messages.MediumPass.DisableVisualHelperForTest,
        ];

        test.each(testCases)('registerCallback with %s', async eventType => {
            const tabId = 1;
            const payload: ToggleActionPayload = {
                test: VisualizationType.HeadingsAssessment,
            };
            const actionName = 'disableVisualization';

            const validator = new ActionCreatorValidator()
                .setupActionOnVisualizationActions(actionName)
                .setupVisualizationActionWithInvokeParameter(actionName, payload.test);
            const actionCreator = validator.buildActionCreator();

            actionCreator.registerCallbacks();

            await validator.simulateMessage(eventType, payload, tabId);

            validator.verifyAll();
        });
    });

    test('registerCallback for switch focus back to target', async () => {
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

        const validator = new ActionCreatorValidator()
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

        const actionCreator = validator.buildActionCreator();

        actionCreator.registerCallbacks();

        await validator.simulateMessage(
            VisualizationMessage.DetailsView.PivotSelect,
            actionCreatorPayload,
            tabId,
        );

        validator.verifyAll();
    });

    async function testScanCompleteWithExpectedParams(
        key: string,
        messageType: string,
        scanResultActionName: keyof VisualizationScanResultActions,
        telemetryName: string,
    ): Promise<void> {
        const tabId = 1;
        const payload = {
            key,
            selectorMap: {
                key: 'value',
            },
            testType: -1,
            scanIncompleteWarnings: [],
        };
        const actionName = 'scanCompleted';
        const validator = new ActionCreatorValidator()
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

        await validator.simulateMessage(messageType, payload, tabId);

        validator.verifyAll();
    }
});

class ActionCreatorValidator {
    private readonly actionExecutingScope = 'ActionCreator';

    private visualizationActionsContainerMock = Mock.ofType(VisualizationActions);
    private visualizationActionMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private devToolsActionMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private cardSelectionActionsMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private needsReviewCardSelectionActionsMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private unifiedScanResultActionsMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private tabStopRequirementActionMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private visualizationScanResultActionsContainerMock = Mock.ofType(
        VisualizationScanResultActions,
    );
    private visualizationScanResultActionMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};

    private tabStopRequirementActionsContainerMock = Mock.ofType(TabStopRequirementActions);
    private detailsViewActionsContainerMock = Mock.ofType(DetailsViewActions);
    private sidePanelActionsContainerMock = Mock.ofType(SidePanelActions);
    private scopingActionsContainerMock = Mock.ofType(ScopingActions);
    private assessmentActionsContainerMock = Mock.ofType(AssessmentActions);
    private inspectActionsContainerMock = Mock.ofType(InspectActions);
    private cardSelectionActionsContainerMock = Mock.ofType(CardSelectionActions);
    private needsReviewCardSelectionActionsContainerMock = Mock.ofType(
        NeedsReviewCardSelectionActions,
    );
    private unifiedScanResultsActionsContainerMock = Mock.ofType(UnifiedScanResultActions);
    private sidePanelActionMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private scopingActionMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private detailsViewActionsMocks: DictionaryStringTo<IMock<Action<any, any>>> = {};

    private inspectActionsMock: DictionaryStringTo<IMock<Action<any, any>>> = {};

    private devToolActionsContainerMock = Mock.ofType(DevToolActions);

    private contentScriptInjectorStrictMock = Mock.ofType<ContentScriptInjector>(
        null,
        MockBehavior.Strict,
    );
    private interpreterMock = new MockInterpreter();
    private getManifestMock = Mock.ofInstance(() => {
        return null;
    });
    private switchToTabMock = Mock.ofInstance((tabId: number) => {}, MockBehavior.Strict);

    private actionHubMock: ActionHub = {
        visualizationActions: this.visualizationActionsContainerMock.object,
        visualizationScanResultActions: this.visualizationScanResultActionsContainerMock.object,
        tabStopRequirementActions: this.tabStopRequirementActionsContainerMock.object,
        devToolActions: this.devToolActionsContainerMock.object,
        sidePanelActions: this.sidePanelActionsContainerMock.object,
        scopingActions: this.scopingActionsContainerMock.object,
        assessmentActions: this.assessmentActionsContainerMock.object,
        inspectActions: this.inspectActionsContainerMock.object,
        detailsViewActions: this.detailsViewActionsContainerMock.object,
        cardSelectionActions: this.cardSelectionActionsContainerMock.object,
        needsReviewCardSelectionActions: this.needsReviewCardSelectionActionsContainerMock.object,
        unifiedScanResultActions: this.unifiedScanResultsActionsContainerMock.object,
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
        actionsMap: DictionaryStringTo<IMock<Action<any, any>>>,
    ): ActionCreatorValidator {
        let action = actionsMap[actionName];

        if (action == null) {
            action = Mock.ofType<Action<any, any>>();
            actionsMap[actionName] = action;
        }

        action
            .setup(am => am.invoke(expectedInvokeParam, this.actionExecutingScope))
            .verifiable(Times.once());

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

    public setupNeedsReviewCardSelectionActionWithInvokeParameter(
        actionName: keyof NeedsReviewCardSelectionActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.needsReviewCardSelectionActionsMocks,
        );
        return this;
    }

    public setupLogError(message: string): ActionCreatorValidator {
        this.loggerMock.setup(logger => logger.error(message, It.isAny())).verifiable(Times.once());

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

    public setupTabStopRequirementActionWithInvokeParameter(
        actionName: keyof TabStopRequirementActions,
        expectedInvokeParam: any,
    ): ActionCreatorValidator {
        this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.tabStopRequirementActionMocks,
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
        actionsMap: DictionaryStringTo<IMock<Action<any, any>>>,
        actionsContainerMock: IMock<any>,
    ): ActionCreatorValidator {
        let action = actionsMap[actionName];

        if (action == null) {
            action = Mock.ofType<Action<any, any>>();
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

    public setupActionOnNeedsReviewCardSelectionActions(
        actionName: keyof NeedsReviewCardSelectionActions,
    ): ActionCreatorValidator {
        this.setupAction(
            actionName,
            this.needsReviewCardSelectionActionsMocks,
            this.needsReviewCardSelectionActionsContainerMock,
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

    public setupActionOnTabStopRequirementActions(
        actionName: keyof TabStopRequirementActions,
    ): ActionCreatorValidator {
        this.setupAction(
            actionName,
            this.tabStopRequirementActionMocks,
            this.tabStopRequirementActionsContainerMock,
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

    public async simulateMessage(messageType: string, payload: unknown, tabId?: number) {
        await this.interpreterMock.simulateMessage(messageType, payload, tabId);
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
        this.tabStopRequirementActionsContainerMock.verifyAll();
        this.notificationCreatorStrictMock.verifyAll();
        this.detailsViewControllerStrictMock.verifyAll();
        this.contentScriptInjectorStrictMock.verifyAll();
        this.targetTabControllerStrictMock.verifyAll();
        this.loggerMock.verifyAll();
    }

    private verifyAllActionMocks(): void {
        this.verifyAllActions(this.visualizationActionMocks);
        this.verifyAllActions(this.visualizationScanResultActionMocks);
        this.verifyAllActions(this.tabStopRequirementActionMocks);
        this.verifyAllActions(this.devToolsActionMocks);
        this.verifyAllActions(this.inspectActionsMock);
        this.verifyAllActions(this.detailsViewActionsMocks);
        this.verifyAllActions(this.sidePanelActionMocks);
        this.verifyAllActions(this.scopingActionMocks);
        this.verifyAllActions(this.cardSelectionActionsMocks);
        this.verifyAllActions(this.needsReviewCardSelectionActionsMocks);
    }

    private verifyAllActions(actionsMap: DictionaryStringTo<IMock<Action<any, any>>>): void {
        forOwn(actionsMap, action => {
            action.verifyAll();
        });
    }
}
