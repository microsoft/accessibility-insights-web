// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { Message } from '../../../../../common/message';
import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { Messages } from '../../../../../common/messages';
import { BaseTelemetryData, TelemetryEventSource } from '../../../../../common/extension-telemetry-events';

describe('ActionMessageDispatcher', () => {
    let postMessageMock: IMock<(message: Message) => void>;

    beforeEach(() => {
        postMessageMock = Mock.ofInstance((message: Message) => {});
    });

    describe('dispatchMessage', () => {
        const message: Message = {
            messageType: 'test-message-type',
        };

        it('handles numeric tabId', () => {
            const tabId = -1;
            const testObject = new ActionMessageDispatcher(postMessageMock.object, tabId);

            testObject.dispatchMessage(message);

            postMessageMock.verify(post => post(It.isValue({ ...message, tabId })), Times.once());
        });

        it('handles null tabId', () => {
            const testObject = new ActionMessageDispatcher(postMessageMock.object, null);
            testObject.dispatchMessage(message);

            postMessageMock.verify(post => post(It.isValue(message)), Times.once());
        });
    });

    describe('dispatchType', () => {
        const messageType = 'test-message-type';

        it('handles numberic tabId', () => {
            const tabId = -1;
            const testObject = new ActionMessageDispatcher(postMessageMock.object, tabId);

            testObject.dispatchType(messageType);

            const expectedMessage = {
                messageType,
                tabId,
            };

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });

        it('handles null tabId', () => {
            const testObject = new ActionMessageDispatcher(postMessageMock.object, null);

            testObject.dispatchType(messageType);

            const expectedMessage = {
                messageType,
            };

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });
    });

    describe('sendTelemetry', () => {
        const eventName = 'test-event-name';
        const eventData: BaseTelemetryData = {
            source: -1 as TelemetryEventSource,
            triggeredBy: 'N/A',
        };

        it('handles numeric tabId', () => {
            const tabId = -1;
            const testObject = new ActionMessageDispatcher(postMessageMock.object, tabId);

            testObject.sendTelemetry(eventName, eventData);

            const expectedMessage = {
                messageType: Messages.Telemetry.Send,
                payload: {
                    eventName,
                    telemetry: eventData,
                },
                tabId,
            };

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });

        it('handles null tabId', () => {
            const testObject = new ActionMessageDispatcher(postMessageMock.object, null);

            testObject.sendTelemetry(eventName, eventData);

            const expectedMessage = {
                messageType: Messages.Telemetry.Send,
                payload: {
                    eventName,
                    telemetry: eventData,
                },
            };

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });
    });
});
