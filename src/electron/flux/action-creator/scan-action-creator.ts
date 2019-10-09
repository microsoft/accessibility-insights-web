// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { ScanActions } from 'electron/flux/action/scan-actions';

export class ScanActionCreator {
    constructor(private readonly scanActions: ScanActions, private readonly telemetryEventHandler: TelemetryEventHandler) {}

    public scan(port: number): void {
        this.telemetryEventHandler.publishTelemetry(SCAN_STARTED, {
            telemetry: {
                port,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        this.scanActions.scanStarted.invoke({ port });
    }
}
