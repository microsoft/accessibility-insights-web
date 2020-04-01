// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ConnectionNames } from 'common/constants/connection-names';
import { Logger } from 'common/logging/logger';

export class TelemetryListener {
    private connection: chrome.runtime.Port;

    constructor(private readonly browserAdapter: BrowserAdapter, private readonly logger: Logger) {}

    public initialize(): void {
        this.connection = this.browserAdapter.connect({
            name: ConnectionNames.debugToolsTelemetry,
        });

        this.connection.onMessage.addListener(this.onTelemetryMessage);
    }

    private onTelemetryMessage = (telemetryMessage: any) => {
        this.logger.log('GOT TELEMETRY', telemetryMessage);
    };

    public dispose(): void {
        this.connection.disconnect();
    }
}
