// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ConnectionNames } from 'common/constants/connection-names';
import {
    DebugToolsTelemetryMessage,
    DebugToolsTelemetryMessageListener,
    TelemetryListener,
} from 'debug-tools/controllers/telemetry-listener';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TelemetryListener', () => {
    type Port = chrome.runtime.Port;
    type OnMessage = Port['onMessage'];

    let onMessageMock: IMock<OnMessage>;
    let connectionMock: IMock<Port>;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let getDateMock: IMock<() => Date>;

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

        getDateMock = Mock.ofType<() => Date>();

        testSubject = new TelemetryListener(browserAdapterMock.object, getDateMock.object);
    });

    it('handles incoming messages', () => {
        let internalListener: Function;

        onMessageMock
            .setup(onMessage => onMessage.addListener(It.is(isFunction)))
            .callback(listener => (internalListener = listener));

        const millisSinceEpoch = 0;
        getDateMock.setup(getter => getter()).returns(() => new Date(millisSinceEpoch));

        testSubject.initialize();

        const externalListenerMock = Mock.ofType<DebugToolsTelemetryMessageListener>();

        testSubject.addListener(externalListenerMock.object);

        const baseProperties = {
            applicationBuild: 'test-application-build',
            applicationName: 'test-application-name',
            applicationVersion: 'test-application-version',
            installationId: 'test-installation-id',
            source: 'test-source',
            triggeredBy: 'test-triggered-by',
        };

        const customProperties = {
            custom1: 'custom1',
            custom2: '2',
            custom3: 'false',
        };

        const name = 'test-event-name';

        const incommingMessage = {
            name,
            properties: {
                ...baseProperties,
                ...customProperties,
            },
        };

        internalListener(incommingMessage);

        const expectedMessage: DebugToolsTelemetryMessage = {
            name,
            timestamp: millisSinceEpoch,
            ...baseProperties,
            customProperties,
        };

        externalListenerMock.verify(
            listener => listener(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    it('close the connection', () => {
        testSubject.initialize();

        testSubject.dispose();

        connectionMock.verify(connection => connection.disconnect(), Times.once());
    });
});
