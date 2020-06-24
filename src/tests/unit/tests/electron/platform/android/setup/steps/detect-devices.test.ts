// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { detectDevices } from 'electron/platform/android/setup/steps/detect-devices';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';
import { Logger } from 'common/logging/logger';

describe('Android setup step: detectDevices', () => {
    let depsMock: IMock<AndroidSetupStepConfigDeps>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();
        depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock
            .setup(m => m.logger)
            .returns(() => loggerMock.object)
            .verifiable(Times.atLeast(0));
    });

    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = detectDevices(deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connect-to-device as expected', async () => {
        const devices: DeviceInfo[] = [];
        const p = new Promise<DeviceInfo[]>(resolve => resolve(devices));

        depsMock
            .setup(m => m.getDevices())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.setSelectedDevice(null)).verifiable(Times.once());
        depsMock.setup(m => m.setAvailableDevices([])).verifiable(Times.once());
        depsMock.setup(m => m.stepTransition('prompt-connect-to-device')).verifiable(Times.once());

        const step = detectDevices(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to detect-service as expected', async () => {
        const devices: DeviceInfo[] = [
            {
                id: 'device1',
            } as DeviceInfo,
        ];

        const p = new Promise<DeviceInfo[]>(resolve => resolve(devices));

        depsMock
            .setup(m => m.getDevices())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.setSelectedDevice(null)).verifiable(Times.once());
        depsMock.setup(m => m.setAvailableDevices([])).verifiable(Times.once());
        depsMock.setup(m => m.setSelectedDeviceId('device1')).verifiable(Times.once());
        depsMock.setup(m => m.setSelectedDevice(devices[0])).verifiable(Times.once());
        depsMock.setup(m => m.setAvailableDevices(devices)).verifiable(Times.once());
        depsMock.setup(m => m.stepTransition('detect-service')).verifiable(Times.once());

        const step = detectDevices(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-choose-device as expected', async () => {
        const devices: DeviceInfo[] = [
            {
                id: 'device1',
            } as DeviceInfo,
            {
                id: 'device2',
            } as DeviceInfo,
        ];

        const p = new Promise<DeviceInfo[]>(resolve => resolve(devices));

        depsMock
            .setup(m => m.getDevices())
            .returns(_ => p)
            .verifiable(Times.once());

        depsMock.setup(m => m.setSelectedDevice(null)).verifiable(Times.once());
        depsMock.setup(m => m.setAvailableDevices([])).verifiable(Times.once());
        depsMock.setup(m => m.setAvailableDevices(devices)).verifiable(Times.once());
        depsMock.setup(m => m.stepTransition('prompt-choose-device')).verifiable(Times.once());

        const step = detectDevices(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();
    });

    it('onEnter transitions to prompt-connect-to-device if getDevices fails', async () => {
        const getDevicesError = new Error('error from getDevices');

        depsMock
            .setup(m => m.getDevices())
            .returns(() => Promise.reject(getDevicesError))
            .verifiable(Times.once());

        depsMock.setup(m => m.setSelectedDevice(null));
        depsMock.setup(m => m.setAvailableDevices([])).verifiable(Times.atLeastOnce());
        depsMock.setup(m => m.stepTransition('prompt-connect-to-device'));

        const step = detectDevices(depsMock.object);
        await step.onEnter();

        depsMock.verifyAll();

        loggerMock.verify(m => m.error(getDevicesError), Times.once());
    });
});
