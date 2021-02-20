// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { IMock, It, Mock, Times } from 'typemoq';

describe('ScanActionCreator', () => {
    const port = 1111;

    let scanActionsMock: IMock<ScanActions>;
    let scanStartedMock: IMock<Action<PortPayload>>;
    let deviceConnectionActionsMock: IMock<DeviceConnectionActions>;
    let statusUnknown: IMock<Action<void>>;

    let testSubject: ScanActionCreator;

    beforeEach(() => {
        scanActionsMock = Mock.ofType<ScanActions>();
        scanStartedMock = Mock.ofType<Action<PortPayload>>();

        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);

        deviceConnectionActionsMock = Mock.ofType<DeviceConnectionActions>();
        statusUnknown = Mock.ofType<Action<void>>();

        deviceConnectionActionsMock
            .setup(actions => actions.statusUnknown)
            .returns(() => statusUnknown.object);

        testSubject = new ScanActionCreator(
            scanActionsMock.object,
            deviceConnectionActionsMock.object,
        );
    });

    it('scans', () => {
        testSubject.scan(port);

        scanStartedMock.verify(
            scanStarted => scanStarted.invoke(It.isValue({ port })),
            Times.once(),
        );
        statusUnknown.verify(statusUnknown => statusUnknown.invoke(), Times.once());
    });
});
