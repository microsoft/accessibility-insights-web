// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceInfo } from 'electron/platform/android/android-service-configurator';
import { AndroidSetupStepConfigDeps } from 'electron/platform/android/setup/android-setup-steps-configs';
import { promptChooseDevice } from 'electron/platform/android/setup/steps/prompt-choose-device';
import { Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptChooseDevice', () => {
    it('has expected properties', () => {
        const deps = {} as AndroidSetupStepConfigDeps;
        const step = promptChooseDevice(deps);
        checkExpectedActionsAreDefined(step, ['rescan', 'setSelectedDevice']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('rescan transitions to detect-adb as expected', () => {
        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('detect-devices')).verifiable(Times.once());

        const step = promptChooseDevice(depsMock.object);
        step.actions.rescan();

        depsMock.verifyAll();
    });

    it('setSelectedDevice transitions to detect-service as expected', () => {
        const testDevice: DeviceInfo = {
            id: 'Hal9000',
            friendlyName: 'Hal',
            isEmulator: true,
        };

        const depsMock = Mock.ofType<AndroidSetupStepConfigDeps>(undefined, MockBehavior.Strict);
        depsMock.setup(m => m.stepTransition('detect-service')).verifiable(Times.once());
        depsMock.setup(m => m.setSelectedDeviceId(testDevice.id)).verifiable(Times.once());
        depsMock.setup(m => m.setSelectedDevice(testDevice)).verifiable(Times.once());

        const step = promptChooseDevice(depsMock.object);
        step.actions.setSelectedDevice(testDevice);

        depsMock.verifyAll();
    });
});
