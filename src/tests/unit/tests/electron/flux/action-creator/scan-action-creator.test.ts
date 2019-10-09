// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ScanActionCreator', () => {
    const port = 1111;

    const expectedScanStartedTelemetry = {
        telemetry: {
            port,
            source: TelemetryEventSource.ElectronDeviceConnect,
        },
    };

    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let scanActionsMock: IMock<ScanActions>;
    let scanStartedMock: IMock<Action<PortPayload>>;

    let testSubject: ScanActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        scanActionsMock = Mock.ofType<ScanActions>();

        scanStartedMock = Mock.ofType<Action<PortPayload>>();

        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);

        testSubject = new ScanActionCreator(scanActionsMock.object, telemetryEventHandlerMock.object);
    });

    it('scans', () => {
        testSubject.scan(port);

        scanStartedMock.verify(scanStarted => scanStarted.invoke(It.isValue({ port })), Times.once());
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(SCAN_STARTED, It.isValue(expectedScanStartedTelemetry)),
            Times.once(),
        );
    });
});
