// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/extension-telemetry-events';
import { SCAN_COMPLETED, SCAN_FAILED, SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { ScanResults } from 'electron/platform/android/scan-results';

export class ScanActionCreator {
    constructor(
        private readonly scanActions: ScanActions,
        private readonly fetchScanResults: FetchScanResultsType,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public scan(port: number): void {
        this.telemetryEventHandler.publishTelemetry(SCAN_STARTED, {
            telemetry: {
                port,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        this.scanActions.scanStarted.invoke(null);

        this.fetchScanResults(port)
            .then(this.scanCompleted)
            .catch(this.scanFailed);
    }

    private scanCompleted = (data: ScanResults) => {
        this.telemetryEventHandler.publishTelemetry(SCAN_COMPLETED, {
            telemetry: {
                triggeredBy: TriggeredByNotApplicable,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        this.scanActions.scanCompleted.invoke(null);
    };

    private scanFailed = () => {
        this.telemetryEventHandler.publishTelemetry(SCAN_FAILED, {
            telemetry: {
                triggeredBy: TriggeredByNotApplicable,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        this.scanActions.scanFailed.invoke(null);
    };
}
