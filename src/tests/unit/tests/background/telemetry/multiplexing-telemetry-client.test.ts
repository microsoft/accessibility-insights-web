// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MultiplexingTelemetryClient } from 'background/telemetry/multiplexing-telemetry-client';
import { TelemetryClient } from 'background/telemetry/telemetry-client';
import { IMock, Mock, Times } from 'typemoq';

describe('MultiplexingTelemetryClient', () => {
    let firstTelemetryClientMock: IMock<TelemetryClient>;
    let secondTelemetryClientMock: IMock<TelemetryClient>;
    let thirdTelemetryClientMock: IMock<TelemetryClient>;

    let testSubject: MultiplexingTelemetryClient;

    beforeEach(() => {
        firstTelemetryClientMock = Mock.ofType<TelemetryClient>();
        secondTelemetryClientMock = Mock.ofType<TelemetryClient>();
        thirdTelemetryClientMock = Mock.ofType<TelemetryClient>();

        testSubject = new MultiplexingTelemetryClient([
            firstTelemetryClientMock.object,
            secondTelemetryClientMock.object,
            thirdTelemetryClientMock.object,
        ]);
    });

    it('calls enableTelemetry on all the clients', () => {
        testSubject.enableTelemetry();

        firstTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
        secondTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
        thirdTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
    });

    it('calls disableTelemetry on all the clients', () => {
        testSubject.disableTelemetry();

        firstTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
        secondTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
        thirdTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
    });

    it('calls trackEvent on all the clients', async () => {
        const testName = 'test-name';
        const testProperties = {
            test: 'property',
        };

        await testSubject.trackEvent(testName, testProperties);

        firstTelemetryClientMock.verify(
            client => client.trackEvent(testName, testProperties),
            Times.once(),
        );
        secondTelemetryClientMock.verify(
            client => client.trackEvent(testName, testProperties),
            Times.once(),
        );
        thirdTelemetryClientMock.verify(
            client => client.trackEvent(testName, testProperties),
            Times.once(),
        );
    });
});
