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

    let millisSinceEpoch: number;
    let baseProperties: Partial<DebugToolsTelemetryMessage>;
    let customProperties: { [key: string]: any };
    let name: string;
    let legitimateInputMessage: any;

    let testSubject: TelemetryListener;

    beforeEach(() => {
        getDateMock = Mock.ofType<() => Date>();

        millisSinceEpoch = 0;
        getDateMock.setup(getter => getter()).returns(() => new Date(millisSinceEpoch));

        baseProperties = {
            applicationBuild: 'test-application-build',
            applicationName: 'test-application-name',
            applicationVersion: 'test-application-version',
            installationId: 'test-installation-id',
            source: 'test-source',
            triggeredBy: 'test-triggered-by',
        };
        customProperties = {
            custom1: 'custom1',
            custom2: '2',
            custom3: 'false',
        };
        name = 'test-event-name';
        legitimateInputMessage = {
            messageType: Messages.DebugTools.Telemetry,
            name,
            properties: {
                ...baseProperties,
                ...customProperties,
            },
        };

        testSubject = new TelemetryListener(getDateMock.object);
    });

    it('handles incoming messages', () => {
        const externalListenerMock = Mock.ofType<DebugToolsTelemetryMessageListener>();
        testSubject.addListener(externalListenerMock.object);

        testSubject.onTelemetryMessage(legitimateInputMessage);

        const expectedMessage = {
            name,
            timestamp: millisSinceEpoch,
            ...baseProperties,
            customProperties,
        } as DebugToolsTelemetryMessage;

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

    it('stops propogating messages to removed listeners', () => {
        const externalListenerMock = Mock.ofType<DebugToolsTelemetryMessageListener>();

        testSubject.addListener(externalListenerMock.object);
        testSubject.removeListener(externalListenerMock.object);

        testSubject.onTelemetryMessage(legitimateInputMessage);

        externalListenerMock.verify(listener => listener(It.isAny()), Times.never());
    });
});
