// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStore } from '../stores/global/user-configuration-store';
import { TelemetryEventHandler } from './telemetry-event-handler';

export class TelemetryStateListener {
    constructor(
        private readonly userConfigStore: UserConfigurationStore,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public async initialize(): Promise<void> {
        this.userConfigStore.addChangedListener(this.onStateChanged);
        await this.onStateChanged();
    }

    private onStateChanged = async (): Promise<void> => {
        if (this.userConfigStore.getState().enableTelemetry) {
            this.telemetryEventHandler.enableTelemetry();
        } else {
            this.telemetryEventHandler.disableTelemetry();
        }
    };
}
