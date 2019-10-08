// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { SCAN_COMPLETED, SCAN_FAILED, SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { ScanResults } from 'electron/platform/android/scan-results';

export class ScanActionCreator {
    constructor(
        private readonly scanActions: ScanActions,
        private readonly fetchScanResults: FetchScanResultsType,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly getCurrentDate: () => Date,
    ) {}

    public scan(port: number): void {
        this.telemetryEventHandler.publishTelemetry(SCAN_STARTED, {
            telemetry: {
                port,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        this.scanActions.scanStarted.invoke(null);

        const scanStartedTime = this.getCurrentDate().getTime();

        this.fetchScanResults(port)
            .then(this.scanCompleted.bind(this, scanStartedTime, port))
            .catch(this.scanFailed.bind(this, scanStartedTime, port));
    }

    private scanCompleted(scanStartedTime: number, port: number, data: ScanResults): void {
        const scanCompletedTime = this.getCurrentDate().getTime();

        const scanDuration = scanCompletedTime - scanStartedTime;

        const instanceCount = data.ruleResults.reduce((acc, cur) => {
            if (acc[cur.status] == null) {
                acc[cur.status] = {};
            }

            if (acc[cur.status][cur.ruleId] == null) {
                acc[cur.status][cur.ruleId] = 1;
            } else {
                acc[cur.status][cur.ruleId]++;
            }

            return acc;
        }, {});

        this.telemetryEventHandler.publishTelemetry(SCAN_COMPLETED, {
            telemetry: {
                port,
                scanDuration,
                ...instanceCount,
            },
        });

        this.scanActions.scanCompleted.invoke(null);
    }

    private scanFailed(scanStartedTime: number, port: number): void {
        const scanCompletedTime = this.getCurrentDate().getTime();

        const scanDuration = scanCompletedTime - scanStartedTime;

        this.telemetryEventHandler.publishTelemetry(SCAN_FAILED, {
            telemetry: {
                port,
                scanDuration,
            },
        });

        this.scanActions.scanFailed.invoke(null);
    }
}
