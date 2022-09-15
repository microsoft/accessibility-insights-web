// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    BaseTelemetryData,
    TelemetryEventSource,
} from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { RemoteActionMessageDispatcher } from '../../../../../common/message-creators/remote-action-message-dispatcher';
import { Messages } from '../../../../../common/messages';

describe('RemoteActionMessageDispatcher', () => {
    let postMessageMock: IMock<(message: Message) => Promise<void>>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        postMessageMock = Mock.ofType<(message: Message) => Promise<void>>();
        postMessageMock.setup(m => m(It.isAny())).returns(() => Promise.resolve());

        loggerMock = Mock.ofType<Logger>();
    });

    describe('dispatchMessage', () => {
        const message: Message = {
            messageType: 'test-message-type',
        };

        it('handles numeric tabId', () => {
            const tabId = -1;
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                tabId,
                loggerMock.object,
            );

            testObject.dispatchMessage(message);

            postMessageMock.verify(post => post(It.isValue({ ...message, tabId })), Times.once());
        });

        it('handles null tabId', () => {
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                null,
                loggerMock.object,
            );
            testObject.dispatchMessage(message);

            postMessageMock.verify(post => post(It.isValue(message)), Times.once());
        });

        it('propagates errors from postMessage to logger.error', () => {
            const expectedError = 'expected error';
            postMessageMock.reset();
            postMessageMock.setup(m => m(It.isAny())).returns(() => Promise.reject(expectedError));
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                null,
                loggerMock.object,
            );
            testObject.dispatchMessage(message);
            loggerMock.verify(m => m.error(expectedError), Times.once());
        });
    });

    describe('asyncDispatchMessage', () => {
        const message: Message = {
            messageType: 'test-message-type',
        };

        it('handles numeric tabId', async () => {
            const tabId = -1;
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                tabId,
                loggerMock.object,
            );

            await testObject.asyncDispatchMessage(message);

            postMessageMock.verify(post => post(It.isValue({ ...message, tabId })), Times.once());
        });

        it('handles null tabId', async () => {
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                null,
                loggerMock.object,
            );
            await testObject.asyncDispatchMessage(message);

            postMessageMock.verify(post => post(It.isValue(message)), Times.once());
        });

        it('propagates errors from postMessage to logger.error', async () => {
            const expectedError = 'expected error';
            postMessageMock.reset();
            postMessageMock.setup(m => m(It.isAny())).returns(() => Promise.reject(expectedError));
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                null,
                loggerMock.object,
            );
            await testObject.asyncDispatchMessage(message);
            loggerMock.verify(m => m.error(expectedError), Times.once());
        });
    });

    describe('dispatchType', () => {
        const messageType = 'test-message-type';

        it('handles numberic tabId', () => {
            const tabId = -1;
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                tabId,
                loggerMock.object,
            );

            testObject.dispatchType(messageType);

            const expectedMessage = {
                messageType,
                tabId,
            };

            postMessageMock.verify(post => post(It.isValue(expectedMessage)), Times.once());
        });

        it('handles null tabId', () => {
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                null,
                loggerMock.object,
            );

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
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                tabId,
                loggerMock.object,
            );

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
            const testObject = new RemoteActionMessageDispatcher(
                postMessageMock.object,
                null,
                loggerMock.object,
            );

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
