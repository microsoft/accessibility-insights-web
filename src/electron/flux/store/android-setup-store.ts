// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { AndroidSetupActions } from '../action/android-setup-actions';
import {
    AndroidSetupStateMachine,
    AndroidSetupStateMachineFactory,
} from '../types/android-setup-state-machine-types';
import { AndroidSetupStoreData } from '../types/android-setup-store-data';

export class AndroidSetupStore extends BaseStoreImpl<AndroidSetupStoreData> {
    private stateMachine: AndroidSetupStateMachine;

    constructor(
        private readonly androidSetupActions: AndroidSetupActions,
        private readonly createAndroidSetupStateMachine: AndroidSetupStateMachineFactory,
    ) {
        super(StoreNames.AndroidSetupStore);
    }

    public initialize(initialState?: AndroidSetupStoreData): void {
        super.initialize(initialState);
        this.stateMachine = this.createAndroidSetupStateMachine(this.stepTransition, {
            setSelectedDevice: this.setSelectedDevice,
            setAvailableDevices: this.setAvailableDevices,
            getScanPort: () => this.state.scanPort,
            setScanPort: this.setScanPort,
            setApplicationName: this.setApplicationName,
        });
    }

    public getDefaultState(): AndroidSetupStoreData {
        // the value of currentStepId below is not especially meaningful
        // because the state will be overridden on the call to initialize
        // when the state machine factory is created.
        return { currentStepId: 'detect-adb' };
    }

    protected addActionListeners(): void {
        const actionNames = Object.keys(this.androidSetupActions) as (keyof AndroidSetupActions)[];

        for (const actionName of actionNames) {
            // this.androidSetupActions will not be a type of exactly AndroidSetupActions at runtime during unit tests
            if (!this.androidSetupActions[actionName].addListener) {
                continue;
            }

            this.androidSetupActions[actionName].addListener(payload =>
                this.stateMachine.invokeAction(actionName, payload),
            );
        }
    }

    private stepTransition = (nextStep: AndroidSetupStepId): void => {
        this.state.currentStepId = nextStep;
        this.emitChanged();
    };

    private setSelectedDevice = (device: DeviceInfo): void => {
        // emitChange will be called from step transition when the step changes
        this.state.selectedDevice = device;
    };

    private setAvailableDevices = (devices: DeviceInfo[]): void => {
        // emitChange will be called from step transition when the step changes
        this.state.availableDevices = devices;
    };

    private setScanPort = (scanPort?: number): void => {
        // emitChange will be called from step transition when the step changes
        this.state.scanPort = scanPort;
    };

    private setApplicationName = (appName?: string): void => {
        // emitChange will be called from step transition when the step changes
        this.state.applicationName = appName;
    };
}
