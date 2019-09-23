// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { IMock, It, Mock, Times } from 'typemoq';
import { VALIDATE_PORT } from '../../../../../../electron/common/electron-telemetry-events';

describe('DeviceConnectActionCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let testSubject: DeviceConnectActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        testSubject = new DeviceConnectActionCreator(telemetryEventHandlerMock.object);
    });

    it('validates port', () => {
        const port = 1111;

        testSubject.validatePort(port);

        const expectedTelemetry = {
            telemetry: {
                port,
            },
        };

        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(VALIDATE_PORT, It.isValue(expectedTelemetry)), Times.once());
    });
});
