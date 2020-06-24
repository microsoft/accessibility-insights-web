// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Action } from 'common/flux/action';
import { TelemetryEventSource } from 'common/types/telemetry-data';
import { VALIDATE_PORT } from 'electron/common/electron-telemetry-events';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { ConnectedDevicePayload, PortPayload } from 'electron/flux/action/device-action-payloads';
import { DeviceActions } from 'electron/flux/action/device-actions';
import { DeviceConfig } from 'electron/platform/android/device-config';
import { DeviceConfigFetcher } from 'electron/platform/android/device-config-fetcher';
import { IMock, It, Mock, Times } from 'typemoq';
import { tick } from '../../../../common/tick';

describe('DeviceConnectActionCreator', () => {
    const port = 1111;

    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let deviceActionsMock: IMock<DeviceActions>;
    let fetchDeviceConfigMock: IMock<DeviceConfigFetcher>;
    let connectingMock: IMock<Action<PortPayload>>;

    let testSubject: DeviceConnectActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        deviceActionsMock = Mock.ofType<DeviceActions>();
        connectingMock = Mock.ofType<Action<PortPayload>>();
        fetchDeviceConfigMock = Mock.ofType<DeviceConfigFetcher>();

        deviceActionsMock.setup(actions => actions.connecting).returns(() => connectingMock.object);

        testSubject = new DeviceConnectActionCreator(
            deviceActionsMock.object,
            fetchDeviceConfigMock.object,
            telemetryEventHandlerMock.object,
        );
    });

    it('validates port, connections succeeds', async () => {
        const deviceName = 'test device';
        const appIdentifier = 'test app';

        fetchDeviceConfigMock
            .setup(fetch => fetch(port))
            .returns(() => Promise.resolve({ deviceName, appIdentifier } as DeviceConfig));

        const connectionSucceedMock = Mock.ofType<Action<ConnectedDevicePayload>>();

        deviceActionsMock
            .setup(actions => actions.connectionSucceeded)
            .returns(() => connectionSucceedMock.object);

        testSubject.validatePort(port);

        await tick();

        const expectedTelemetry = {
            telemetry: {
                port,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        };

        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(VALIDATE_PORT, It.isValue(expectedTelemetry)),
            Times.once(),
        );

        connectingMock.verify(connecting => connecting.invoke({ port }), Times.once());
        connectionSucceedMock.verify(
            succeed => succeed.invoke({ connectedDevice: `${deviceName} - ${appIdentifier}` }),
            Times.once(),
        );
    });

    it('validates port, connection fails', async () => {
        fetchDeviceConfigMock
            .setup(fetch => fetch(port))
            .returns(() => Promise.reject('dummy reason'));

        const connectionFailedMock = Mock.ofType<Action<void>>();

        deviceActionsMock
            .setup(actions => actions.connectionFailed)
            .returns(() => connectionFailedMock.object);

        testSubject.validatePort(port);

        await tick();

        const expectedTelemetry = {
            telemetry: {
                port,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        };

        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(VALIDATE_PORT, It.isValue(expectedTelemetry)),
            Times.once(),
        );

        connectingMock.verify(connecting => connecting.invoke({ port }), Times.once());
        connectionFailedMock.verify(succeed => succeed.invoke(), Times.once());
    });

    it('resets to default', () => {
        const resetConnectionMock = Mock.ofType<Action<void>>();

        deviceActionsMock
            .setup(actions => actions.resetConnection)
            .returns(() => resetConnectionMock.object);

        testSubject.resetConnection();

        resetConnectionMock.verify(resetConnection => resetConnection.invoke(null), Times.once());
    });
});
