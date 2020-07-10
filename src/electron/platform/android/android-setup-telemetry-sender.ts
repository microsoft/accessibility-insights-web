// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import {
    AndroidSetupStepTelemetryData,
    DEVICE_SETUP_STEP,
} from 'electron/common/electron-telemetry-events';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';

export class AndroidSetupTelemetrySender {
    private step: AndroidSetupStepId | null;
    private prevTimestamp: number;

    constructor(
        private readonly androidSetupStore: AndroidSetupStore,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly getCurrentMs: () => number,
    ) {
        this.step = null;
        this.prevTimestamp = 0;
    }

    public initialize(): void {
        this.handleStoreUpdate(this.androidSetupStore);
        this.androidSetupStore.addChangedListener(this.handleStoreUpdate);
    }

    private handleStoreUpdate = (androidSetupStore: AndroidSetupStore): void => {
        const newStep = androidSetupStore.getState().currentStepId;
        const currentMs = this.getCurrentMs();
        if (this.step !== newStep) {
            const elapsed = currentMs - this.prevTimestamp;
            const prevDuration = this.step === null ? 0 : elapsed;
            const telemetry: AndroidSetupStepTelemetryData = {
                triggeredBy: TriggeredByNotApplicable,
                source: TelemetryEventSource.ElectronDeviceConnect,
                prevStep: this.step,
                newStep,
                prevDuration,
            };
            this.telemetryEventHandler.publishTelemetry(DEVICE_SETUP_STEP, {
                telemetry,
            });

            this.step = newStep;
            this.prevTimestamp = currentMs;
        }
    };
}
