// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import { DEVICE_SETUP_STEP } from 'electron/common/electron-telemetry-events';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';

export class AndroidSetupTelemetrySender {
    private step: AndroidSetupStepId | null = null;
    private prevTimestamp: number = 0;

    constructor(
        private readonly androidSetupStore: AndroidSetupStore,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly getCurrentMs: () => number,
    ) {}

    public initialize(): void {
        this.androidSetupStore.addChangedListener(this.handleStoreUpdate);
    }

    private handleStoreUpdate(androidSetupStore: AndroidSetupStore): void {
        const newStep = androidSetupStore.getState().currentStepId;
        if (this.step !== newStep) {
            const elapsed = this.getCurrentMs() - this.prevTimestamp;
            const prevDuration = this.step === null ? 0 : elapsed;
            this.telemetryEventHandler.publishTelemetry(DEVICE_SETUP_STEP, {
                telemetry: {
                    triggeredBy: TriggeredByNotApplicable,
                    source: TelemetryEventSource.ElectronDeviceConnect,
                    prevStep: this.step,
                    newStep,
                    prevDuration,
                },
            });
        }
    }
}
