// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { OnDetailsViewOpenPayload, SetLaunchPanelState } from '../../../../../background/actions/action-payloads';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import {
    BaseTelemetryData,
    DetailsViewOpenTelemetryData,
    LAUNCH_PANEL_OPEN,
    POPUP_INITIALIZED,
    TelemetryEventSource,
    TUTORIAL_OPEN,
} from '../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { WindowUtils } from '../../../../../common/window-utils';
import { PopupActionMessageCreator } from '../../../../../popup/actions/popup-action-message-creator';
import { LaunchPanelType } from '../../../../../popup/components/popup-view';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('PopupActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const stubKeypressEvent = eventStubFactory.createKeypressEvent() as any;
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    let mockWindowUtils: IMock<WindowUtils>;
    let postMessageMock: IMock<(message) => void>;
    let testSubject: PopupActionMessageCreator;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let tabId: number;

    beforeEach(() => {
        mockWindowUtils = Mock.ofType(WindowUtils, MockBehavior.Strict);

        postMessageMock = Mock.ofInstance(message => {}, MockBehavior.Strict);
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        tabId = 1;

        testSubject = new PopupActionMessageCreator(postMessageMock.object, tabId, telemetryFactoryMock.object, mockWindowUtils.object);
    });

    afterEach(() => {
        mockWindowUtils.verifyAll();
        telemetryFactoryMock.verifyAll();
        postMessageMock.verifyAll();
    });

    test('popupInitialized', () => {
        const payload = {
            eventName: POPUP_INITIALIZED,
            telemetry: {
                source: TelemetryEventSource.LaunchPad,
                triggeredBy: 'N/A',
            },
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.Telemetry.Send,
            payload: payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.popupInitialized();

        postMessageMock.verifyAll();
    });

    test('openLaunchPad', () => {
        const panelType = LaunchPanelType.AdhocToolsPanel;
        const payload = {
            eventName: LAUNCH_PANEL_OPEN,
            telemetry: {
                source: TelemetryEventSource.LaunchPad,
                triggeredBy: 'N/A',
                launchPanelType: panelType,
            },
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.Telemetry.Send,
            payload: payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.openLaunchPad(panelType);

        postMessageMock.verifyAll();
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
            tabId: 1,
            type: Messages.Visualizations.DetailsView.Open,
            payload: expectedPayload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        telemetryFactoryMock
            .setup(tf => tf.forOpenDetailsView(stubKeypressEvent, viewType, testSource))
            .returns(() => telemetry)
            .verifiable();

        mockWindowUtils.setup(x => x.closeWindow()).verifiable(Times.once());

        testSubject.openDetailsView(stubKeypressEvent, VisualizationType.Headings, testSource, pivotType);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('openDetailsView (no pivotType param)', () => {
        const viewType = VisualizationType.Headings;

        const telemetry: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[viewType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        const expectedPayload: OnDetailsViewOpenPayload = {
            telemetry: telemetry,
            detailsViewType: viewType,
            pivotType: DetailsViewPivotType.allTest,
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.Visualizations.DetailsView.Open,
            payload: expectedPayload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        telemetryFactoryMock
            .setup(tf => tf.forOpenDetailsView(stubKeypressEvent, viewType, testSource))
            .returns(() => telemetry)
            .verifiable();

        mockWindowUtils.setup(x => x.closeWindow()).verifiable(Times.once());

        testSubject.openDetailsView(stubKeypressEvent, VisualizationType.Headings, testSource);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('openShortcutConfigureTab', () => {
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.HamburgerMenu,
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.ChromeFeature.configureCommand,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.fromHamburgerMenu(stubKeypressEvent))
            .returns(() => telemetry)
            .verifiable();

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.openShortcutConfigureTab(stubKeypressEvent);

        postMessageMock.verifyAll();
    });

    test('openTutorial', () => {
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.LaunchPad,
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.Telemetry.Send,
            payload: {
                eventName: TUTORIAL_OPEN,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.fromLaunchPad(stubKeypressEvent))
            .returns(() => telemetry)
            .verifiable(Times.once());

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.openTutorial(stubKeypressEvent);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('setLaunchPanelType', () => {
        const type = LaunchPanelType.AdhocToolsPanel;

        const payload: SetLaunchPanelState = {
            launchPanelType: type,
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.LaunchPanel.Set,
            payload,
        };

        postMessageMock.setup(post => post(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.setLaunchPanelType(type);

        postMessageMock.verifyAll();
    });
});
