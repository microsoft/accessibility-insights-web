// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';

export class AndroidSetupTelemetrySender {
    private step: AndroidSetupStepId | null;
    private prevTimestamp: number;

    constructor(
        private readonly interpreter: Interpreter,
        private readonly telemetryDataFactory: TelemetryDataFactory,
        private readonly androidSetupStore: AndroidSetupStore,
        private readonly getCurrentMs: () => number,
    ) {
        this.step = null;
        this.prevTimestamp = 0;
        this.androidSetupStore.addChangedListener(this.handleStoreUpdate);
    }

    private handleStoreUpdate(androidSetupStore: AndroidSetupStore): void {
        if (androidSetupStore.getState().currentStepId !== this.step) {
            const duration = this.step === null ? 0 : this.getCurrentMs() - this.prevTimestamp;
        }
    }
}
