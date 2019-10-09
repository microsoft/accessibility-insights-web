// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { InstanceCount, TelemetryEventSource } from 'common/extension-telemetry-events';
import { createDefaultLogger } from 'common/logging/default-logger';
import { SCAN_COMPLETED, SCAN_FAILED, SCAN_STARTED } from 'electron/common/electron-telemetry-events';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { FetchScanResultsType } from 'electron/platform/android/fetch-scan-results';
import { RuleResultsData, ScanResults } from 'electron/platform/android/scan-results';

export class ScanController {
    constructor(
        private readonly scanActions: ScanActions,
        private readonly fetchScanResults: FetchScanResultsType,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly getCurrentDate: () => Date,
        private readonly logger = createDefaultLogger(),
    ) {}

    public initialize(): void {
        this.scanActions.scanStarted.addListener(this.onScanStarted);
    }

    private onScanStarted = (payload: PortPayload) => {
        const port = payload.port;

        this.telemetryEventHandler.publishTelemetry(SCAN_STARTED, {
            telemetry: {
                port,
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        const scanStartedTime = this.getCurrentDate().getTime();

        this.fetchScanResults(port)
            .then(this.scanCompleted.bind(this, scanStartedTime, port))
            .catch(this.scanFailed.bind(this, scanStartedTime, port));
    };

    private scanCompleted(scanStartedTime: number, port: number, data: ScanResults): void {
        const scanCompletedTime = this.getCurrentDate().getTime();

        const scanDuration = scanCompletedTime - scanStartedTime;

        const instanceCount = this.buildInstanceCount(data.ruleResults);

        this.telemetryEventHandler.publishTelemetry(SCAN_COMPLETED, {
            telemetry: {
                port,
                scanDuration,
                ...instanceCount,
            },
        });

        this.scanActions.scanCompleted.invoke(null);
    }

    private buildInstanceCount(ruleResults: RuleResultsData[]): InstanceCount {
        return ruleResults.reduce<InstanceCount>(
            (accumulator, currentRuleResult) => {
                if (accumulator[currentRuleResult.status][currentRuleResult.ruleId] == null) {
                    accumulator[currentRuleResult.status][currentRuleResult.ruleId] = 1;
                } else {
                    accumulator[currentRuleResult.status][currentRuleResult.ruleId]++;
                }

                return accumulator;
            },
            { PASS: {}, FAIL: {}, INCOMPLETE: {} },
        );
    }

    private scanFailed(scanStartedTime: number, port: number, error: Error): void {
        this.logger.error('scan failed: ', error);

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
