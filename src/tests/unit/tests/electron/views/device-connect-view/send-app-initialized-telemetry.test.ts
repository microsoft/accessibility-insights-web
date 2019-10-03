// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import { APP_INITIALIZED } from 'electron/common/electron-telemetry-events';
import { sendAppInitializedTelemetryEvent } from 'electron/views/device-connect-view/send-app-initialized-telemetry';
import { IMock, It, Mock, Times } from 'typemoq';

describe('sendAppInitializedTelemetry', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    const testSubject = sendAppInitializedTelemetryEvent;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('send telemetry', () => {
        testSubject(telemetryEventHandlerMock.object);

        const expectedTelemetry: BaseActionPayload = {
            telemetry: {
                source: TelemetryEventSource.ElectronDeviceConnect,
                triggeredBy: TriggeredByNotApplicable,
            },
        };

        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(APP_INITIALIZED, It.isValue(expectedTelemetry)), Times.once());
    });
});
