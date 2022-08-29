// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { createSyncActionMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { IMock, Mock, Times } from 'typemoq';

describe(AndroidSetupActionCreator, () => {
    let androidSetupActionsMock: IMock<AndroidSetupActions>;
    let testSubject: AndroidSetupActionCreator;

    beforeEach(() => {
        androidSetupActionsMock = Mock.ofType<AndroidSetupActions>();
        testSubject = new AndroidSetupActionCreator(androidSetupActionsMock.object);
    });

    it('invokes cancel action on cancel', () => {
        const actionMock = Mock.ofType<SyncAction<void>>();
        androidSetupActionsMock.setup(actions => actions.cancel).returns(() => actionMock.object);
        actionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.cancel();
        actionMock.verifyAll();
    });

    it('invokes next action on rescan', () => {
        const actionMock = Mock.ofType<SyncAction<void>>();
        androidSetupActionsMock.setup(actions => actions.next).returns(() => actionMock.object);
        actionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.next();
        actionMock.verifyAll();
    });

    it('invokes rescan action on rescan', () => {
        const actionMock = Mock.ofType<SyncAction<void>>();
        androidSetupActionsMock.setup(actions => actions.rescan).returns(() => actionMock.object);
        actionMock.setup(s => s.invoke()).verifiable(Times.once());

        testSubject.rescan();
        actionMock.verifyAll();
    });

    it('invokes setSelectedDevice action on setSelectedDevice', () => {
        const testDevice: DeviceInfo = {
            id: 'Robbie',
            friendlyName: 'Robbie the robot',
            isEmulator: true,
        };

        const actionMock = Mock.ofType<SyncAction<DeviceInfo>>();
        androidSetupActionsMock
            .setup(actions => actions.setSelectedDevice)
            .returns(() => actionMock.object);
        actionMock.setup(s => s.invoke(testDevice)).verifiable(Times.once());

        testSubject.setSelectedDevice(testDevice);
        actionMock.verifyAll();
    });

    it('invokes saveAdbPath action on saveAdbPath', () => {
        const actionMock = Mock.ofType<SyncAction<string>>();
        androidSetupActionsMock
            .setup(actions => actions.saveAdbPath)
            .returns(() => actionMock.object);
        actionMock.setup(s => s.invoke('/new/adb/path')).verifiable(Times.once());

        testSubject.saveAdbPath('/new/adb/path');
        actionMock.verifyAll();
    });

    it('invokes readyToStart action on readyToStart', () => {
        const readyToStartMock = createSyncActionMock<void>(undefined, 'AndroidSetupActionCreator');
        androidSetupActionsMock
            .setup(actions => actions.readyToStart)
            .returns(() => readyToStartMock.object);

        testSubject.readyToStart();
        readyToStartMock.verifyAll();
    });
});
