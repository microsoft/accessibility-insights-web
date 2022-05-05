// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import {
    DebugToolsTelemetryMessage,
    DebugToolsTelemetryMessageListener,
    TelemetryListener,
} from 'debug-tools/controllers/telemetry-listener';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TelemetryListener', () => {
    let getDateMock: IMock<() => Date>;

    let testSubject: TelemetryListener;

    beforeEach(() => {
        getDateMock = Mock.ofType<() => Date>();

        testSubject = new TelemetryListener(getDateMock.object);
    });

    it('handles incoming messages', () => {
        const millisSinceEpoch = 0;
        getDateMock.setup(getter => getter()).returns(() => new Date(millisSinceEpoch));

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
            messageType: Messages.DebugTools.Telemetry,
            name,
            properties: {
                ...baseProperties,
                ...customProperties,
            },
        };

        testSubject.onTelemetryMessage(incommingMessage);

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

    it('ignores message with incorrect type', () => {
        const externalListenerMock = Mock.ofType<DebugToolsTelemetryMessageListener>();

        testSubject.addListener(externalListenerMock.object);

        const incommingMessage = {
            name,
            timestamp: 0,
        };

        testSubject.onTelemetryMessage(incommingMessage);

        externalListenerMock.verify(listener => listener(It.isAny()), Times.never());
    });
});
