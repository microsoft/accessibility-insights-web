// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ConnectionNames } from 'common/constants/connection-names';
import { Logger } from 'common/logging/logger';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TelemetryListener', () => {
    type Port = chrome.runtime.Port;
    type OnMessage = Port['onMessage'];

    let onMessageMock: IMock<OnMessage>;
    let connectionMock: IMock<Port>;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let loggerMock: IMock<Logger>;

    let testSubject: TelemetryListener;

    beforeEach(() => {
        onMessageMock = Mock.ofType<OnMessage>();

        connectionMock = Mock.ofType<Port>();
        connectionMock
            .setup(connection => connection.onMessage)
            .returns(() => onMessageMock.object);

        browserAdapterMock = Mock.ofType<BrowserAdapter>();

        browserAdapterMock
            .setup(adapter =>
                adapter.connect(
                    It.isValue({
                        name: ConnectionNames.debugToolsTelemetry,
                    }),
                ),
            )
            .returns(() => connectionMock.object);

        loggerMock = Mock.ofType<Logger>();

        testSubject = new TelemetryListener(browserAdapterMock.object, loggerMock.object);
    });

    it('handles incoming messages', () => {
        let messageListener: Function;

        onMessageMock
            .setup(onMessage => onMessage.addListener(It.is(isFunction)))
            .callback(listener => (messageListener = listener));

        testSubject.initialize();

        const telemetryMessage = { testKey: 'testValue' };
        messageListener(telemetryMessage);

        loggerMock.verify(logger => logger.log('GOT TELEMETRY', telemetryMessage), Times.once());
    });

    it('close the connection', () => {
        testSubject.initialize();

        testSubject.dispose();

        connectionMock.verify(connection => connection.disconnect(), Times.once());
    });
});
