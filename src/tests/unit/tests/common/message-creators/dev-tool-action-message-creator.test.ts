// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectElementPayload, InspectFrameUrlPayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { IMock, It, Mock, Times } from 'typemoq';

import { DevToolActionMessageCreator } from '../../../../../common/message-creators/dev-tool-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('DevToolActionMessageCreatorTest', () => {
    let eventStubFactory: EventStubFactory;
    let testSubject: DevToolActionMessageCreator;
    let dispatcherMock: IMock<ActionMessageDispatcher>;

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        eventStubFactory = new EventStubFactory();
        testSubject = new DevToolActionMessageCreator(
            new TelemetryDataFactory(),
            dispatcherMock.object,
        );
    });

    test('setInspectElement', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const target = ['$iframe1', 'div1'];
        const telemetryFactory = new TelemetryDataFactory();
        const telemetry = telemetryFactory.forInspectElement(event);
        const expectedMessage = {
            messageType: Messages.DevTools.InspectElement,
            payload: {
                target: target,
                telemetry: telemetry,
            } as InspectElementPayload,
        };

        testSubject.setInspectElement(event, target);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('setInspectFrameUrl', () => {
        const frameUrl = 'frame url';
        const expectedMessage = {
            messageType: Messages.DevTools.InspectFrameUrl,
            payload: {
                frameUrl: frameUrl,
            } as InspectFrameUrlPayload,
        };

        testSubject.setInspectFrameUrl(frameUrl);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });
});
