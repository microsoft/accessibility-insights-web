// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { OnDetailsViewOpenPayload } from '../../../../../../background/actions/action-payloads';
import { Messages } from '../../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../../common/telemetry-data-factory';
import * as TelemetryEvents from '../../../../../../common/telemetry-events';
import { DetailsViewOpenTelemetryData, TelemetryEventSource } from '../../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { WindowUtils } from '../../../../../../common/window-utils';
import { PopupActionMessageCreator } from '../../../../../../popup/scripts/actions/popup-action-message-creator';
import { LaunchPanelType } from '../../../../../../popup/scripts/components/popup-view';
import { EventStubFactory } from '../../../../common/event-stub-factory';

describe('PopupActionMessageCreatorTest', () => {
    let eventStubFactory: EventStubFactory;
    let mockWindowUtils: IMock<WindowUtils>;
    let postMessageMock: IMock<(message) => void>;
    let testSubject: PopupActionMessageCreator;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let tabId: number;
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;

    beforeEach(() => {
        eventStubFactory = new EventStubFactory();
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
            eventName: TelemetryEvents.POPUP_INITIALIZED,
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

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.popupInitialized();

        postMessageMock.verifyAll();
    });

    test('openLaunchPad', () => {
        const panelType = LaunchPanelType.AdhocToolsPanel;
        const payload = {
            eventName: TelemetryEvents.LAUNCH_PANEL_OPEN,
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

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.openLaunchPad(panelType);

        postMessageMock.verifyAll();
    });

    test('openDetailsView', () => {
        const viewType = VisualizationType.Headings;
        const pivotType = DetailsViewPivotType.fastPass;
        const event = eventStubFactory.createKeypressEvent() as any;

        const telemetry: DetailsViewOpenTelemetryData = {
            detailsView: VisualizationType[viewType],
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

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        telemetryFactoryMock
            .setup(tf => tf.forOpenDetailsView(event, viewType, testSource))
            .returns(() => telemetry)
            .verifiable();

        mockWindowUtils.setup(x => x.closeWindow()).verifiable(Times.once());

        testSubject.openDetailsView(event, VisualizationType.Headings, testSource, pivotType);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('openDetailsView (no pivotType param)', () => {
        const viewType = VisualizationType.Headings;
        const event = eventStubFactory.createKeypressEvent() as any;

        const telemetry: DetailsViewOpenTelemetryData = {
            detailsView: VisualizationType[viewType],
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

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        telemetryFactoryMock
            .setup(tf => tf.forOpenDetailsView(event, viewType, testSource))
            .returns(() => telemetry)
            .verifiable();

        mockWindowUtils.setup(x => x.closeWindow()).verifiable(Times.once());

        testSubject.openDetailsView(event, VisualizationType.Headings, testSource);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('openShortcutConfigureTab', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: TelemetryEvents.SourceAndTriggeredBy = {
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
            .setup(tf => tf.fromHamburgetMenu(event))
            .returns(() => telemetry)
            .verifiable();

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.openShortcutConfigureTab(event);

        postMessageMock.verifyAll();
    });

    test('openTutorial', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: TelemetryEvents.SourceAndTriggeredBy = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.LaunchPad,
        };

        const expectedMessage = {
            tabId: 1,
            type: Messages.Telemetry.Send,
            payload: {
                eventName: TelemetryEvents.TUTORIAL_OPEN,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.fromLaunchPad(event))
            .returns(() => telemetry)
            .verifiable(Times.once());

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());

        testSubject.openTutorial(event);

        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });
});
