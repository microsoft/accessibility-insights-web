// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import {
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupDeps } from 'electron/platform/android/setup/android-setup-deps';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { detectDevices } from 'electron/platform/android/setup/steps/detect-devices';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { checkExpectedActionsAreDefined } from './actions-tester';

describe('Android setup step: detectDevices', () => {
    let depsMock: IMock<AndroidSetupDeps>;
    let storeCallbacksMock: IMock<AndroidSetupStoreCallbacks>;
    let stepTransitionMock: IMock<AndroidSetupStepTransitionCallback>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        depsMock = Mock.ofType<AndroidSetupDeps>(undefined, MockBehavior.Strict);
        storeCallbacksMock = Mock.ofType<AndroidSetupStoreCallbacks>(
            undefined,
            MockBehavior.Strict,
        );
        stepTransitionMock = Mock.ofInstance((_: AndroidSetupStepId) => {});
        loggerMock = Mock.ofType<Logger>();
        depsMock
            .setup(m => m.logger)
            .returns(() => loggerMock.object)
            .verifiable(Times.atLeast(0));
    });

    afterEach(() => {
        depsMock.verifyAll();
        storeCallbacksMock.verifyAll();
        stepTransitionMock.verifyAll();
    });

    it('has expected properties', () => {
        const deps = {} as AndroidSetupDeps;
        const step = detectDevices(null, deps);
        checkExpectedActionsAreDefined(step, []);
        expect(step.onEnter).toBeDefined();
    });

    it('onEnter transitions to prompt-connect-to-device as expected', async () => {
        const devices: DeviceInfo[] = [];
        const p = Promise.resolve(devices);

        depsMock
            .setup(m => m.getDevices())
            .returns(_ => p)
            .verifiable(Times.once());

        storeCallbacksMock.setup(m => m.setSelectedDevice(null)).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setAvailableDevices([])).verifiable(Times.once());
        stepTransitionMock.setup(m => m('prompt-connect-to-device')).verifiable(Times.once());

        const step = detectDevices(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
    });

    it('onEnter transitions to detect-service as expected', async () => {
        const devices: DeviceInfo[] = [
            {
                id: 'device1',
            } as DeviceInfo,
        ];

        const p = Promise.resolve(devices);

        depsMock
            .setup(m => m.getDevices())
            .returns(_ => p)
            .verifiable(Times.once());

        storeCallbacksMock.setup(m => m.setSelectedDevice(null)).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setAvailableDevices([])).verifiable(Times.once());
        depsMock.setup(m => m.setSelectedDeviceId('device1')).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setSelectedDevice(devices[0])).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setAvailableDevices(devices)).verifiable(Times.once());
        stepTransitionMock.setup(m => m('detect-service')).verifiable(Times.once());

        const step = detectDevices(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
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

        const p = Promise.resolve(devices);

        depsMock
            .setup(m => m.getDevices())
            .returns(_ => p)
            .verifiable(Times.once());

        storeCallbacksMock.setup(m => m.setSelectedDevice(null)).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setAvailableDevices([])).verifiable(Times.once());
        storeCallbacksMock.setup(m => m.setAvailableDevices(devices)).verifiable(Times.once());
        stepTransitionMock.setup(m => m('prompt-choose-device')).verifiable(Times.once());

        const step = detectDevices(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();
    });

    it('onEnter transitions to prompt-connect-to-device if getDevices fails', async () => {
        const getDevicesError = new Error('error from getDevices');

        depsMock
            .setup(m => m.getDevices())
            .returns(() => Promise.reject(getDevicesError))
            .verifiable(Times.once());

        storeCallbacksMock.setup(m => m.setSelectedDevice(null));
        storeCallbacksMock.setup(m => m.setAvailableDevices([])).verifiable(Times.atLeastOnce());
        stepTransitionMock.setup(m => m('prompt-connect-to-device'));

        const step = detectDevices(
            stepTransitionMock.object,
            depsMock.object,
            storeCallbacksMock.object,
        );
        await step.onEnter();

        loggerMock.verify(m => m.error(getDevicesError), Times.once());
    });
});
