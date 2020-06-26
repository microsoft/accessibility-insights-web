// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { promptChooseDevice } from 'electron/platform/android/setup/steps/prompt-choose-device';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: promptChooseDevice', () => {
    let depsMock: IMock<AndroidSetupDeps>;
    let storeCallbacksMock: IMock<AndroidSetupStoreCallbacks>;
    let stepTransitionMock: IMock<AndroidSetupStepTransitionCallback>;

    beforeEach(() => {
        depsMock = Mock.ofType<AndroidSetupDeps>(undefined, MockBehavior.Strict);
        storeCallbacksMock = Mock.ofType<AndroidSetupStoreCallbacks>(
            undefined,
            MockBehavior.Strict,
        );
        stepTransitionMock = Mock.ofInstance((_: AndroidSetupStepId) => {});
    });

    afterEach(() => {
        depsMock.verifyAll();
        storeCallbacksMock.verifyAll();
        stepTransitionMock.verifyAll();
    });

    it('has expected properties', () => {
        const deps = {} as AndroidSetupDeps;
        const step = promptChooseDevice(null, deps);
        checkExpectedActionsAreDefined(step, ['rescan', 'setSelectedDevice']);
        expect(step.onEnter).not.toBeDefined();
    });

    it('rescan transitions to detect-adb as expected', () => {
        stepTransitionMock.setup(m => m('detect-devices')).verifiable(Times.once());

        const step = promptChooseDevice(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        step.actions.rescan();
    });

    it('setSelectedDevice transitions to detect-service as expected', () => {
        const testDevice: DeviceInfo = {
            id: 'Hal9000',
            friendlyName: 'Hal',
            isEmulator: true,
        };

        stepTransitionMock.setup(m => m('detect-service')).verifiable(Times.once());
        depsMock.setup(m => m.setSelectedDeviceId(testDevice.id)).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setSelectedDevice(testDevice)).verifiable(Times.once());

        const step = promptChooseDevice(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        step.actions.setSelectedDevice(testDevice);
    });
});
