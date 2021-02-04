// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { OnDetailsViewOpenPayload, SetLaunchPanelState } from 'background/actions/action-payloads';

import {
    BaseTelemetryData,
    DetailsViewOpenTelemetryData,
    LAUNCH_PANEL_OPEN,
    TelemetryData,
    TelemetryEventSource,
    TUTORIAL_OPEN,
} from 'common/extension-telemetry-events';
import { Tab } from 'common/itab';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { WindowUtils } from 'common/window-utils';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('PopupActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const stubKeypressEvent = eventStubFactory.createKeypressEvent() as any;
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    let mockWindowUtils: IMock<WindowUtils>;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let actionMessageDispatcherMock: IMock<ActionMessageDispatcher>;

    let testSubject: PopupActionMessageCreator;

    beforeEach(() => {
        mockWindowUtils = Mock.ofType(WindowUtils, MockBehavior.Strict);

        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        actionMessageDispatcherMock = Mock.ofType<ActionMessageDispatcher>();

        testSubject = new PopupActionMessageCreator(
            telemetryFactoryMock.object,
            actionMessageDispatcherMock.object,
            mockWindowUtils.object,
        );
    });

    it('dispatches for popupInitialized', () => {
        const stubTab: Tab = { url: 'stub-url' };
        const telemetry: BaseTelemetryData = {
            source: TelemetryEventSource.LaunchPad,
            triggeredBy: 'N/A',
        };

        const expectedMessage = {
            messageType: Messages.Popup.Initialized,
            payload: {
                telemetry,
                tab: stubTab,
            },
        };

        testSubject.popupInitialized(stubTab);

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    it('dispatches for openLaunchPad', () => {
        const panelType = LaunchPanelType.AdhocToolsPanel;
        const telemetry: TelemetryData = {
            source: TelemetryEventSource.LaunchPad,
            triggeredBy: 'N/A',
            launchPanelType: panelType,
        };

        testSubject.openLaunchPad(panelType);

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(LAUNCH_PANEL_OPEN, It.isValue(telemetry)),
            Times.once(),
        );
    });

    test('openDetailsView', () => {
        const viewType = VisualizationType.Headings;
        const pivotType = DetailsViewPivotType.fastPass;

        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const expectedPayload: OnDetailsViewOpenPayload = {
            telemetry: telemetry,
            detailsViewType: viewType,
            pivotType: pivotType,
        };

        const expectedMessage = {
            messageType: Messages.Visualizations.DetailsView.Open,
            payload: expectedPayload,
        };

        telemetryFactoryMock
            .setup(tf => tf.forOpenDetailsView(stubKeypressEvent, viewType, testSource))
            .returns(() => telemetry);

        mockWindowUtils.setup(x => x.closeWindow()).verifiable(Times.once());

        testSubject.openDetailsView(
            stubKeypressEvent,
            VisualizationType.Headings,
            testSource,
            pivotType,
        );

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
        mockWindowUtils.verifyAll();
    });

    it('dispatches for openShortcutConfigureTab', () => {
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.HamburgerMenu,
        };

        const message = {
            messageType: Messages.Shortcuts.ConfigureShortcuts,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.fromHamburgerMenu(stubKeypressEvent))
            .returns(() => telemetry);

        testSubject.openShortcutConfigureTab(stubKeypressEvent);

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(message)),
            Times.once(),
        );
    });

    it('dispatches for openTutorial', () => {
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.LaunchPad,
        };

        telemetryFactoryMock
            .setup(tf => tf.fromLaunchPad(stubKeypressEvent))
            .returns(() => telemetry);

        testSubject.openTutorial(stubKeypressEvent);

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(TUTORIAL_OPEN, It.isValue(telemetry)),
            Times.once(),
        );
    });

    it('dispatches for setLaunchPanelType', () => {
        const panelType = LaunchPanelType.AdhocToolsPanel;

        const payload: SetLaunchPanelState = {
            launchPanelType: panelType,
        };

        const expectedMessage = {
            messageType: Messages.LaunchPanel.Set,
            payload,
        };

        testSubject.setLaunchPanelType(panelType);

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });
});
