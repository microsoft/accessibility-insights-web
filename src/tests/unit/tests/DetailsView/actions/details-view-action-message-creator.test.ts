// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    OnDetailsViewPivotSelected,
    SetAllUrlsPermissionStatePayload,
} from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    BaseTelemetryData,
    COPY_ISSUE_DETAILS,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    DETAILS_VIEW_OPEN,
    ExportFastPassResultsTelemetryData,
    ExportResultsTelemetryData,
    EXPORT_RESULTS,
    FeatureFlagToggleTelemetryData,
    LEFT_NAV_PANEL_EXPANDED,
    SetAllUrlsPermissionTelemetryData,
    TelemetryEventSource,
    TriggeredByNotApplicable,
} from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import {
    SupportedMouseEvent,
    TelemetryDataFactory,
} from '../../../../../common/telemetry-data-factory';
import { DetailsViewPivotType } from '../../../../../common/types/store-data/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('DetailsViewActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: DetailsViewActionMessageCreator;

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        testSubject = new DetailsViewActionMessageCreator(
            telemetryFactoryMock.object,
            dispatcherMock.object,
        );
    });

    test('initialize', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const detailsViewId = 'testId';

        const expectedMessage = {
            messageType: Messages.Visualizations.DetailsView.Initialize,
            payload: {
                telemetry,
                detailsViewId,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.initialize(detailsViewId);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('updateFocusedInstanceTarget', () => {
        const instanceTarget = ['#headings-1'];
        const expectedMessage = {
            messageType: Messages.Visualizations.Issues.UpdateFocusedInstance,
            payload: instanceTarget,
        };

        testSubject.updateFocusedInstanceTarget(instanceTarget);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('switchToTargetTab', () => {
        const telemetryStub: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };
        const eventStub = {} as any;
        const expectedMessage: Message = {
            messageType: Messages.Tab.Switch,
            payload: {
                telemetry: telemetryStub,
            },
        };

        setupTelemetryFactory('fromDetailsView', telemetryStub, eventStub);

        testSubject.switchToTargetTab(eventStub);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('selectDetailsView', () => {
        const view = VisualizationType.Headings;
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: DetailsViewOpenTelemetryData = {
            triggeredBy: 'keypress',
            selectedTest: VisualizationType[view],
            source: testSource,
        };
        const pivot = DetailsViewPivotType.assessment;

        const expectedMessage = {
            messageType: Messages.Visualizations.DetailsView.Select,
            payload: {
                telemetry: telemetry,
                detailsViewType: view,
                pivotType: pivot,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectDetailsView(event, view))
            .returns(() => telemetry);

        testSubject.selectDetailsView(event, VisualizationType.Headings, pivot);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('setFeatureFlag', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: FeatureFlagToggleTelemetryData = {
            triggeredBy: 'keypress',
            enabled: true,
            source: testSource,
            featureFlagId: 'test-id',
        };

        const expectedMessage = {
            messageType: Messages.FeatureFlags.SetFeatureFlag,
            payload: {
                feature: 'test-id',
                enabled: true,
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf =>
                tf.forFeatureFlagToggle(event, true, TelemetryEventSource.DetailsView, 'test-id'),
            )
            .returns(() => telemetry);

        testSubject.setFeatureFlag('test-id', true, event);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('sendPivotItemClicked: event is not null', () => {
        const pivot = DetailsViewPivotType.assessment;
        const telemetryData: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'keypress',
            pivotKey: DetailsViewPivotType[pivot],
            source: testSource,
        };

        const payload: OnDetailsViewPivotSelected = {
            telemetry: telemetryData,
            pivotKey: pivot,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.DetailsView.PivotSelect,
            payload: payload,
        };
        const mouseEventStub = {} as any;

        telemetryFactoryMock
            .setup(tf =>
                tf.forDetailsViewNavPivotActivated(mouseEventStub, DetailsViewPivotType[pivot]),
            )
            .returns(() => telemetryData);

        testSubject.sendPivotItemClicked(DetailsViewPivotType[pivot], mouseEventStub);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('sendPivotItemClicked: event is null', () => {
        const pivot = DetailsViewPivotType.assessment;

        const expectedPayload: OnDetailsViewPivotSelected = {
            telemetry: null,
            pivotKey: pivot,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.DetailsView.PivotSelect,
            payload: expectedPayload,
        };

        testSubject.sendPivotItemClicked(DetailsViewPivotType[pivot], null);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('closePreviewFeaturesPanel', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            messageType: Messages.PreviewFeatures.ClosePanel,
            payload: {
                telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.closePreviewFeaturesPanel();

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('closeScopingPanel', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            messageType: Messages.Scoping.ClosePanel,
            payload: {
                telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.closeScopingPanel();

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('closeSettingsPanel', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            messageType: Messages.SettingsPanel.ClosePanel,
            payload: {
                telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.closeSettingsPanel();

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('detailsViewOpened', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedDetailsViewPivot: DetailsViewPivotType[1],
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forDetailsViewOpened(1 as DetailsViewPivotType))
            .returns(() => telemetry);

        testSubject.detailsViewOpened(1 as DetailsViewPivotType);

        dispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(DETAILS_VIEW_OPEN, telemetry),
            Times.once(),
        );
    });

    test('addPathForValidation', () => {
        const path = 'test path';
        const expectedMessage = {
            messageType: Messages.PathSnippet.AddPathForValidation,
            payload: path,
        };

        testSubject.addPathForValidation(path);
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('clearPathSnippetData', () => {
        const expectedMessage = {
            messageType: Messages.PathSnippet.ClearPathSnippetData,
        };

        testSubject.clearPathSnippetData();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('exportResultsClicked', () => {
        const serviceKey = 'html';
        const event = eventStubFactory.createMouseClickEvent() as any;

        const telemetry: ExportResultsTelemetryData = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
            exportResultsService: 'html',
            exportResultsType: 'export result type',
        };

        const exportResultsType = 'Assessment';

        telemetryFactoryMock
            .setup(tf =>
                tf.forExportedResults(
                    exportResultsType,
                    serviceKey,
                    event,
                    TelemetryEventSource.DetailsView,
                ),
            )
            .returns(() => telemetry);

        testSubject.exportResultsClicked(exportResultsType, serviceKey, event);

        dispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(EXPORT_RESULTS, telemetry),
            Times.once(),
        );
    });

    test('exportResultsClickedFastPass', () => {
        const serviceKey = 'html';
        const event = eventStubFactory.createMouseClickEvent() as any;

        const telemetry: ExportFastPassResultsTelemetryData = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
            exportResultsService: 'html',
            exportResultsType: 'export result type',
            wereAutomatedChecksRun: true,
            tabStopRequirementInstanceCount: { pass: {}, unknown: {}, fail: {} },
        };
        const tabStopRequirementData = {};
        const wereAutomatedChecksRun = true;
        const exportResultsType = 'FastPass';

        telemetryFactoryMock
            .setup(tf =>
                tf.forExportedResultsWithFastPassData(
                    tabStopRequirementData,
                    wereAutomatedChecksRun,
                    exportResultsType,
                    serviceKey,
                    event,
                    TelemetryEventSource.DetailsView,
                ),
            )
            .returns(() => telemetry);

        testSubject.exportResultsClickedFastPass(
            tabStopRequirementData,
            wereAutomatedChecksRun,
            exportResultsType,
            serviceKey,
            event,
        );

        dispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(EXPORT_RESULTS, telemetry),
            Times.once(),
        );
    });

    test('copyIssueDetailsClicked', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;

        const telemetry: BaseTelemetryData = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
        };

        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView))
            .returns(() => telemetry);

        testSubject.copyIssueDetailsClicked(event);

        dispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(COPY_ISSUE_DETAILS, telemetry),
            Times.once(),
        );
    });

    test('changeRightContentPanel', () => {
        const viewTypeStub = 'test view type' as DetailsViewRightContentPanelType;
        const expectedMessage = {
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: viewTypeStub,
        };

        testSubject.changeRightContentPanel(viewTypeStub);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('confirmDataTransferToAssessment', () => {
        const telemetryData: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: testSource,
        };

        const payload: BaseActionPayload = {
            telemetry: telemetryData,
        };

        const expectedMessage = {
            messageType: Messages.DataTransfer.InitiateTransferDataToAssessment,
            payload: payload,
        };
        const mouseEventStub = {} as any;

        telemetryFactoryMock
            .setup(tf =>
                tf.withTriggeredByAndSource(mouseEventStub, TelemetryEventSource.DetailsView),
            )
            .returns(() => telemetryData);

        testSubject.confirmDataTransferToAssessment(mouseEventStub);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('rescanVisualization', () => {
        const testStub = -1;
        const eventStub = {} as SupportedMouseEvent;
        const telemetryStub = {
            source: TelemetryEventSource.DetailsView,
        } as BaseTelemetryData;
        const expectedMessage = {
            messageType: Messages.Visualizations.Common.RescanVisualization,
            payload: {
                test: testStub,
                telemetry: telemetryStub,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(eventStub, TelemetryEventSource.DetailsView))
            .returns(() => telemetryStub);

        testSubject.rescanVisualization(testStub as VisualizationType, eventStub);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('setAllUrlsPermissionState', () => {
        const eventStub = {} as SupportedMouseEvent;
        const telemetryStub = {
            source: testSource,
        } as SetAllUrlsPermissionTelemetryData;
        const permissionsState = true;
        const expectedMessage = {
            messageType: Messages.PermissionsState.SetPermissionsState,
            payload: {
                telemetry: telemetryStub,
                hasAllUrlAndFilePermissions: permissionsState,
            } as SetAllUrlsPermissionStatePayload,
        };

        telemetryFactoryMock
            .setup(tf =>
                tf.forSetAllUrlPermissionState(
                    eventStub,
                    TelemetryEventSource.DetailsView,
                    permissionsState,
                ),
            )
            .returns(() => telemetryStub);

        testSubject.setAllUrlsPermissionState(eventStub, permissionsState);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('leftNavPanelExpanded', () => {
        const eventStub = {} as SupportedMouseEvent;
        const telemetryStub = {
            source: testSource,
        } as BaseTelemetryData;
        telemetryFactoryMock
            .setup(tf => tf.forLeftNavPanelExpanded(eventStub))
            .returns(() => telemetryStub);

        dispatcherMock
            .setup(d => d.sendTelemetry(LEFT_NAV_PANEL_EXPANDED, telemetryStub))
            .verifiable(Times.once());

        testSubject.leftNavPanelExpanded(eventStub);

        dispatcherMock.verifyAll();
    });

    function setupTelemetryFactory(
        methodName: keyof TelemetryDataFactory,
        telemetry: any,
        event?: any,
    ): void {
        const setupFunc = event ? tfm => tfm[methodName](event) : tfm => tfm[methodName]();
        telemetryFactoryMock.setup(setupFunc).returns(() => telemetry);
    }
});
