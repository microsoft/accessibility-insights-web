// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChainnedTelemetryClient } from 'background/telemetry/chainned-telemetry-client';
import { TelemetryClient } from 'background/telemetry/telemetry-client';
import { IMock, Mock, Times } from 'typemoq';
import { create } from 'content/common';

describe('ChainnedTelemetryClient', () => {
    let firstTelemetryClientMock: IMock<TelemetryClient>;

    let testSubject: ChainnedTelemetryClient;

    beforeEach(() => {
        firstTelemetryClientMock = Mock.ofType<TelemetryClient>();
    });

    describe('with 1 client in the chain', () => {
        beforeEach(() => {
            testSubject = ChainnedTelemetryClient.fromArray(firstTelemetryClientMock.object);
        });

        it('calls enableTelemetry throughout the chain', () => {
            testSubject.enableTelemetry();

            firstTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
        });

        it('calls disableTelemetry throughout the chain', () => {
            testSubject.disableTelemetry();

            firstTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
        });

        it('calls trackEvent throughout the chain', () => {
            const testName = 'test-name';
            const testProperties = {
                test: 'property',
            };

            testSubject.trackEvent(testName, testProperties);

            firstTelemetryClientMock.verify(
                client => client.trackEvent(testName, testProperties),
                Times.once(),
            );
        });
    });

    describe('with 1 client and 1 undefined at the end of the chain', () => {
        beforeEach(() => {
            testSubject = ChainnedTelemetryClient.fromArray(
                firstTelemetryClientMock.object,
                undefined,
            );
        });

        it('calls enableTelemetry throughout the chain', () => {
            testSubject.enableTelemetry();

            firstTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
        });

        it('calls disableTelemetry throughout the chain', () => {
            testSubject.disableTelemetry();

            firstTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
        });

        it('calls trackEvent throughout the chain', () => {
            const testName = 'test-name';
            const testProperties = {
                test: 'property',
            };

            testSubject.trackEvent(testName, testProperties);

            firstTelemetryClientMock.verify(
                client => client.trackEvent(testName, testProperties),
                Times.once(),
            );
        });
    });

    describe('with 3 clients in the chain', () => {
        let secondTelemetryClientMock: IMock<TelemetryClient>;
        let thirdTelemetryClientMock: IMock<TelemetryClient>;

        beforeEach(() => {
            firstTelemetryClientMock = Mock.ofType<TelemetryClient>();
            secondTelemetryClientMock = Mock.ofType<TelemetryClient>();
            thirdTelemetryClientMock = Mock.ofType<TelemetryClient>();

            testSubject = ChainnedTelemetryClient.fromArray(
                firstTelemetryClientMock.object,
                secondTelemetryClientMock.object,
                thirdTelemetryClientMock.object,
            );
        });

        it('calls enableTelemetry throughout the chain', () => {
            testSubject.enableTelemetry();

            firstTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
            secondTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
            thirdTelemetryClientMock.verify(client => client.enableTelemetry(), Times.once());
        });

        it('calls disableTelemetry throughout the chain', () => {
            testSubject.disableTelemetry();

            firstTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
            secondTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
            thirdTelemetryClientMock.verify(client => client.disableTelemetry(), Times.once());
        });

        it('calls trackEvent throughout the chain', () => {
            const testName = 'test-name';
            const testProperties = {
                test: 'property',
            };

            testSubject.trackEvent(testName, testProperties);

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

    it('creates from array with 1 client and 1 undefined value', () => {
        const creates = () =>
            ChainnedTelemetryClient.fromArray(firstTelemetryClientMock.object, undefined);

        expect(creates).not.toThrow();
    });
});
