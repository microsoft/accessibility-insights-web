// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, Times } from 'typemoq';
import { Message } from '../../../../../common/message';
import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { Messages } from '../../../../../common/messages';
import { BaseTelemetryData, TelemetryEventSource } from '../../../../../common/telemetry-events';

describe('ActionMessageDispatcher', () => {
    const postMessageMock = Mock.ofInstance((message: Message) => {});

    const tabIds = [-1, null];

    beforeEach(() => {
        postMessageMock.reset();
    });

    describe('dispatchMessage', () => {
        it.each(tabIds)('with tabId = %o', tabId => {
            const message: Message = {
                type: 'test-message-type',
            };

            const testObject = new ActionMessageDispatcher(postMessageMock.object, tabId);

            testObject.dispatchMessage(message);

            const expectedMessage = {
                ...message,
            };

            if (tabId != null) {
                expectedMessage.tabId = tabId;
            }

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });
    });

    describe('dispatchType', () => {
        it.each(tabIds)('with tabId = %o', tabId => {
            const testObject = new ActionMessageDispatcher(postMessageMock.object, tabId);

            const messageType = 'test-message-type';

            testObject.dispatchType(messageType);

            const expectedMessage: Message = {
                type: messageType,
            };

            if (tabId != null) {
                expectedMessage.tabId = tabId;
            }

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });
    });

    describe('sendTelemetry', () => {
        it.each(tabIds)('with tabId = %o', tabId => {
            const eventName = 'test-event-name';
            const eventData: BaseTelemetryData = {
                source: -1 as TelemetryEventSource,
                triggeredBy: 'N/A',
            };

            const testObject = new ActionMessageDispatcher(postMessageMock.object, tabId);

            testObject.sendTelemetry(eventName, eventData);

            const expectedMessage: Message = {
                type: Messages.Telemetry.Send,
                payload: {
                    eventName,
                    telemetry: eventData,
                },
            };

            if (tabId != null) {
                expectedMessage.tabId = tabId;
            }

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });
    });
});
