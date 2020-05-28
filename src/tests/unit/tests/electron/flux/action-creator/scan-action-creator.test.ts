// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { DeviceActions } from 'electron/flux/action/device-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ScanActionCreator', () => {
    const port = 1111;

    let scanActionsMock: IMock<ScanActions>;
    let scanStartedMock: IMock<Action<PortPayload>>;
    let deviceActionsMock: IMock<DeviceActions>;
    let resetConnectionMock: IMock<Action<void>>;

    let testSubject: ScanActionCreator;

    beforeEach(() => {
        scanActionsMock = Mock.ofType<ScanActions>();
        scanStartedMock = Mock.ofType<Action<PortPayload>>();

        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);

        deviceActionsMock = Mock.ofType<DeviceActions>();
        resetConnectionMock = Mock.ofType<Action<void>>();

        deviceActionsMock
            .setup(actions => actions.resetConnection)
            .returns(() => resetConnectionMock.object);

        testSubject = new ScanActionCreator(scanActionsMock.object, deviceActionsMock.object);
    });

    it('scans', () => {
        testSubject.scan(port);

        scanStartedMock.verify(
            scanStarted => scanStarted.invoke(It.isValue({ port })),
            Times.once(),
        );
        resetConnectionMock.verify(resetConnection => resetConnection.invoke(), Times.once());
    });
});
