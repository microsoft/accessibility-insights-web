// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ApplicationTelemetryData,
    ApplicationTelemetryDataFactory,
} from 'background/telemetry/application-telemetry-data-factory';
import { DebugToolsTelemetryClient } from 'background/telemetry/debug-tools-telemetry-client';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ConnectionNames } from 'common/constants/connection-names';
import { isFunction, times } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('DebugToolsTelemetryClient', () => {
    type Port = chrome.runtime.Port;
    type OnDisconnect = Port['onDisconnect'];

    const connectionsCountProperty = 'connections.length';

    let browserAdapterMock: IMock<BrowserAdapter>;
    let portMock: IMock<Port>;
    let telemetryDataFactoryMock: IMock<ApplicationTelemetryDataFactory>;

    let testSubject: DebugToolsTelemetryClient;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        portMock = Mock.ofType<Port>();
        telemetryDataFactoryMock = Mock.ofType<ApplicationTelemetryDataFactory>();

        testSubject = new DebugToolsTelemetryClient(
            browserAdapterMock.object,
            telemetryDataFactoryMock.object,
        );
    });

    describe('initialize', () => {
        it('no op for NON debug tools telemetry connection name', () => {
            browserAdapterMock
                .setup(adapter => adapter.addListenerOnConnect(It.is(isFunction)))
                .callback(listener => listener(portMock.object));

            portMock.setup(port => port.name).returns(() => 'not-the-on-i-am-looking-for');

            testSubject.initialize();

            portMock.verify(port => port.onDisconnect, Times.never());

            expect(testSubject).toHaveProperty(connectionsCountProperty, 0);
        });

        it.each([1, 3, 4, 7])(
            'handles new debug tools telemetry connections (total connection count %s)',
            connectionsCount => {
                let onConnectListener: Function;

                browserAdapterMock
                    .setup(adapter => adapter.addListenerOnConnect(It.is(isFunction)))
                    .callback(listener => (onConnectListener = listener));

                portMock
                    .setup(port => port.name)
                    .returns(() => ConnectionNames.debugToolsTelemetry);

                const onDisconnectMock = Mock.ofType<OnDisconnect>();

                portMock.setup(port => port.onDisconnect).returns(() => onDisconnectMock.object);

                testSubject.initialize();

                times(connectionsCount, () => onConnectListener(portMock.object));

                onDisconnectMock.verify(
                    onDisconnect => onDisconnect.addListener(It.is(isFunction)),
                    Times.exactly(connectionsCount),
                );

                expect(testSubject).toHaveProperty(connectionsCountProperty, connectionsCount);
            },
        );
    });

    describe('enableTelemetry', () => {
        beforeEach(() => {
            testSubject = new DebugToolsTelemetryClient(null, null);
        });

        it('no op, no side effects', () => {
            const action = () => testSubject.enableTelemetry();

            expect(action).not.toThrow();
        });
    });

    describe('disableTelemetry', () => {
        beforeEach(() => {
            testSubject = new DebugToolsTelemetryClient(null, null);
        });

        it('no op, no side effects', () => {
            const action = () => testSubject.disableTelemetry();

            expect(action).not.toThrow();
        });
    });

    describe('trackEvent', () => {
        const eventName = 'test-event-name';
        const eventProperties = { testProperty: 'testValue' };

        it('is no op when there are no connections', () => {
            testSubject = new DebugToolsTelemetryClient(null, null);

            const action = () => testSubject.trackEvent(eventName, eventProperties);

            expect(action).not.toThrow();
        });

        it('post a message to every tracked connection', () => {
            const connectionsCount = 3;
            let onConnectListener: Function;

            const appData: ApplicationTelemetryData = {
                applicationBuild: 'test-application-build',
                applicationName: 'test-application-name',
                applicationVersion: 'test-application-version',
                installationId: 'test-installation-id',
            };

            telemetryDataFactoryMock.setup(factory => factory.getData()).returns(() => appData);

            browserAdapterMock
                .setup(adapter => adapter.addListenerOnConnect(It.is(isFunction)))
                .callback(listener => (onConnectListener = listener));

            const onDisconnectMock = Mock.ofType<OnDisconnect>();

            const portMocks: IMock<Port>[] = [];

            for (let portIndex = 0; portIndex < connectionsCount; portIndex++) {
                const mock = Mock.ofType<Port>();
                mock.setup(port => port.name).returns(() => ConnectionNames.debugToolsTelemetry);
                mock.setup(port => port.onDisconnect).returns(() => onDisconnectMock.object);

                portMocks.push(mock);
            }

            testSubject.initialize();

            times(connectionsCount, callIndex => onConnectListener(portMocks[callIndex].object));

            expect(testSubject).toHaveProperty(connectionsCountProperty, connectionsCount);

            testSubject.trackEvent(eventName, eventProperties);

            portMocks.forEach(mock => {
                mock.verify(
                    port =>
                        port.postMessage(
                            It.isValue({
                                name: eventName,
                                properties: {
                                    ...eventProperties,
                                    ...appData,
                                },
                            }),
                        ),
                    Times.once(),
                );
            });
        });
    });

    it('handles onDisconnect events for existing, tracked connections', () => {
        const connectionsCount = 3;
        let onConnectListener: Function;

        browserAdapterMock
            .setup(adapter => adapter.addListenerOnConnect(It.is(isFunction)))
            .callback(listener => (onConnectListener = listener));

        const onDisconnectListeners: Function[] = [];
        const onDisconnectMock = Mock.ofType<OnDisconnect>();
        onDisconnectMock
            .setup(onDisconnect => onDisconnect.addListener(It.is(isFunction)))
            .callback(listener => onDisconnectListeners.push(listener));

        const portMocks: IMock<Port>[] = [];

        for (let portIndex = 0; portIndex < connectionsCount; portIndex++) {
            const mock = Mock.ofType<Port>();
            mock.setup(port => port.name).returns(() => ConnectionNames.debugToolsTelemetry);
            mock.setup(port => port.onDisconnect).returns(() => onDisconnectMock.object);

            portMocks.push(mock);
        }

        testSubject.initialize();

        times(connectionsCount, callIndex => onConnectListener(portMocks[callIndex].object));

        expect(testSubject).toHaveProperty(connectionsCountProperty, connectionsCount);
        expect(onDisconnectListeners).toHaveLength(connectionsCount);

        onDisconnectListeners.forEach((disconnectionListener, disconnectionIndex) => {
            disconnectionListener();
            expect(testSubject).toHaveProperty(
                connectionsCountProperty,
                connectionsCount - (disconnectionIndex + 1),
            );
        });
    });
});
