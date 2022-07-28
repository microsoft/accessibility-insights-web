// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { SyncAction } from 'common/flux/sync-action';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { IMock, Mock, Times } from 'typemoq';

describe('ScanActionCreator', () => {
    const actionExecutingScope = 'ScanActionCreator';
    let scanActionsMock: IMock<ScanActions>;
    let scanStartedMock: IMock<AsyncAction<void>>;
    let deviceConnectionActionsMock: IMock<DeviceConnectionActions>;
    let statusUnknown: IMock<SyncAction<void>>;

    let testSubject: ScanActionCreator;

    beforeEach(() => {
        scanActionsMock = Mock.ofType<ScanActions>();
        scanStartedMock = Mock.ofType<AsyncAction<void>>();

        scanActionsMock.setup(actions => actions.scanStarted).returns(() => scanStartedMock.object);

        deviceConnectionActionsMock = Mock.ofType<DeviceConnectionActions>();
        statusUnknown = Mock.ofType<SyncAction<void>>();

        deviceConnectionActionsMock
            .setup(actions => actions.statusUnknown)
            .returns(() => statusUnknown.object);

        testSubject = new ScanActionCreator(
            scanActionsMock.object,
            deviceConnectionActionsMock.object,
        );
    });

    it('scans', async () => {
        await testSubject.scan();

        scanStartedMock.verify(
            async scanStarted => scanStarted.invoke(null, actionExecutingScope),
            Times.once(),
        );
        statusUnknown.verify(
            statusUnknown => statusUnknown.invoke(null, actionExecutingScope),
            Times.once(),
        );
    });
});
