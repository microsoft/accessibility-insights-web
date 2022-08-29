// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import {
    AndroidSetupStateMachine,
    AndroidSetupStateMachineFactory,
    AndroidSetupStepTransitionCallback,
    AndroidSetupStoreCallbacks,
} from 'electron/flux/types/android-setup-state-machine-types';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';
import { It, Mock, Times } from 'typemoq';

const mockableStateMachineFactory = (
    stepTransition: AndroidSetupStepTransitionCallback,
    storeCallbacks: AndroidSetupStoreCallbacks,
): AndroidSetupStateMachine => {
    return null;
};

describe('AndroidSetupStore', () => {
    describe('constructor', () => {
        it('has no side effects', () => {
            const testObject = createStoreWithNullParams(AndroidSetupStore);
            expect(testObject).toBeDefined();
        });
    });

    it('invoked actions result in state machine invoke calls', () => {
        const actionNames = Object.keys(new AndroidSetupActions()) as (keyof AndroidSetupActions)[];

        const stateMachineMock = Mock.ofType<AndroidSetupStateMachine>();

        for (const actionName of actionNames) {
            stateMachineMock
                .setup(m => m.invokeAction(actionName, It.isAny()))
                .verifiable(Times.once());
        }

        const stateMachineFactoryMock = Mock.ofInstance(mockableStateMachineFactory);
        stateMachineFactoryMock
            .setup(m => m(It.isAny(), It.isAny()))
            .returns(_ => stateMachineMock.object)
            .verifiable(Times.once());

        const setupActions = new AndroidSetupActions();

        const store = new AndroidSetupStore(setupActions, stateMachineFactoryMock.object);
        store.initialize();

        setupActions.cancel.invoke();
        setupActions.next.invoke();
        setupActions.rescan.invoke();
        setupActions.saveAdbPath.invoke('');
        setupActions.setSelectedDevice.invoke({} as DeviceInfo);
        setupActions.readyToStart.invoke();

        stateMachineFactoryMock.verifyAll();
        stateMachineMock.verifyAll();
    });

    it('action parameters are passed through as expected', () => {
        const testString = 'may the force be with you';

        const stateMachineMock = Mock.ofType<AndroidSetupStateMachine>();
        stateMachineMock
            .setup(m => m.invokeAction('saveAdbPath', testString))
            .verifiable(Times.once());

        const stateMachineFactoryMock = Mock.ofInstance(mockableStateMachineFactory);
        stateMachineFactoryMock
            .setup(m => m(It.isAny(), It.isAny()))
            .returns(_ => stateMachineMock.object)
            .verifiable(Times.once());

        const setupActions = new AndroidSetupActions();

        const store = new AndroidSetupStore(setupActions, stateMachineFactoryMock.object);
        store.initialize();

        setupActions.saveAdbPath.invoke(testString);

        stateMachineFactoryMock.verifyAll();
        stateMachineMock.verifyAll();
    });

    it('ensure step transition function results in store update', async () => {
        const initialData: AndroidSetupStoreData = { currentStepId: 'detect-adb' };
        const expectedData: AndroidSetupStoreData = { currentStepId: 'prompt-choose-device' };

        let stepTransition: AndroidSetupStepTransitionCallback;

        const stateMachineMock = Mock.ofType<AndroidSetupStateMachine>();
        stateMachineMock
            .setup(m => m.invokeAction('cancel', It.isAny()))
            .callback((action, payload) => stepTransition('prompt-choose-device'))
            .verifiable(Times.once());

        const stateMachineFactoryMock = Mock.ofInstance(mockableStateMachineFactory);
        stateMachineFactoryMock
            .setup(m => m(It.isAny(), It.isAny()))
            .callback(st => (stepTransition = st))
            .returns(_ => stateMachineMock.object)
            .verifiable(Times.once());

        const storeTester = createAndroidSetupStoreTester('cancel', stateMachineFactoryMock.object);
        await storeTester.testListenerToBeCalledOnce(initialData, expectedData);

        stateMachineFactoryMock.verifyAll();
        stateMachineMock.verifyAll();
    });

    it('ensure setSelectedDevice function results in store update', () => {
        const testDevice: DeviceInfo = {
            id: 'r2d2',
            friendlyName: 'little buddy',
            isEmulator: true,
        };

        const initialData: AndroidSetupStoreData = { currentStepId: 'detect-adb' };
        const expectedData: AndroidSetupStoreData = {
            currentStepId: 'detect-adb',
            selectedDevice: testDevice,
        };

        let storeCallbacks: AndroidSetupStoreCallbacks;

        const stateMachineFactoryMock = Mock.ofInstance(mockableStateMachineFactory);
        stateMachineFactoryMock
            .setup(m => m(It.isAny(), It.isAny()))
            .callback((_, sc) => (storeCallbacks = sc))
            .verifiable(Times.once());

        const store = new AndroidSetupStore(
            new AndroidSetupActions(),
            stateMachineFactoryMock.object,
        );
        store.initialize(initialData);

        storeCallbacks.setSelectedDevice(testDevice);

        expect(store.getState()).toEqual(expectedData);

        stateMachineFactoryMock.verifyAll();
    });

    it('ensure setAvailableDevices function results in store update', () => {
        const testDevices: DeviceInfo[] = [
            {
                id: 'r2d2',
                friendlyName: 'little buddy',
                isEmulator: true,
            },
            {
                id: 'c3po',
                friendlyName: '3po',
                isEmulator: false,
            },
        ];

        const initialData: AndroidSetupStoreData = { currentStepId: 'detect-adb' };
        const expectedData: AndroidSetupStoreData = {
            currentStepId: 'detect-adb',
            availableDevices: testDevices,
        };

        let storeCallbacks: AndroidSetupStoreCallbacks;

        const stateMachineFactoryMock = Mock.ofInstance(mockableStateMachineFactory);
        stateMachineFactoryMock
            .setup(m => m(It.isAny(), It.isAny()))
            .callback((_, sc) => (storeCallbacks = sc))
            .verifiable(Times.once());

        const store = new AndroidSetupStore(
            new AndroidSetupActions(),
            stateMachineFactoryMock.object,
        );
        store.initialize(initialData);

        storeCallbacks.setAvailableDevices(testDevices);

        expect(store.getState()).toEqual(expectedData);

        stateMachineFactoryMock.verifyAll();
    });

    it('ensure setApplicationName function results in store update', () => {
        const appName = 'Star Wars -- Episode Test';

        const initialData: AndroidSetupStoreData = { currentStepId: 'detect-adb' };
        const expectedData: AndroidSetupStoreData = {
            currentStepId: 'detect-adb',
            applicationName: appName,
        };

        let storeCallbacks: AndroidSetupStoreCallbacks;

        const stateMachineFactoryMock = Mock.ofInstance(mockableStateMachineFactory);
        stateMachineFactoryMock
            .setup(m => m(It.isAny(), It.isAny()))
            .callback((_, sc) => (storeCallbacks = sc))
            .verifiable(Times.once());

        const store = new AndroidSetupStore(
            new AndroidSetupActions(),
            stateMachineFactoryMock.object,
        );
        store.initialize(initialData);

        storeCallbacks.setApplicationName(appName);

        expect(store.getState()).toEqual(expectedData);

        stateMachineFactoryMock.verifyAll();
    });

    const createAndroidSetupStoreTester = (
        actionToInvoke: keyof AndroidSetupActions,
        stateMachineFactory: AndroidSetupStateMachineFactory,
    ): StoreTester<AndroidSetupStoreData, AndroidSetupActions> => {
        const storeFactory = (actions: AndroidSetupActions) =>
            new AndroidSetupStore(actions, stateMachineFactory);

        return new StoreTester(AndroidSetupActions, actionToInvoke, storeFactory);
    };
});
