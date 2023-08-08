// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { InstanceCount, TelemetryEventSource } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import {
    SCAN_COMPLETED,
    SCAN_FAILED,
    SCAN_STARTED,
} from 'electron/common/electron-telemetry-events';
import { PortPayload } from 'electron/flux/action/device-action-payloads';
import { ScanActions } from 'electron/flux/action/scan-actions';
import { ScanResultsFetcher } from 'electron/platform/electron/fetch-scan-results';
import { UnifiedScanCompletedPayloadBuilder } from 'electron/platform/electron/unified-result-builder';
import { RuleResult } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

export class ScanController {
    constructor(
        private readonly scanActions: ScanActions,
        private readonly unifiedScanResultAction: UnifiedScanResultActions,
        private readonly fetchScanResults: ScanResultsFetcher,
        private readonly unifiedResultsBuilder: UnifiedScanCompletedPayloadBuilder,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly getCurrentDate: () => Date,
        private readonly logger: Logger,
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

    private scanCompleted(scanStartedTime: number, port: number, data: AxeAnalyzerResult): void {
        const scanCompletedTime = this.getCurrentDate().getTime();

        const scanDuration = scanCompletedTime - scanStartedTime;

        const instanceCount = this.buildInstanceCount(data);

        this.telemetryEventHandler.publishTelemetry(SCAN_COMPLETED, {
            telemetry: {
                port,
                scanDuration,
                ...instanceCount,
            },
        });

        const payload = this.unifiedResultsBuilder(data);

        this.unifiedScanResultAction.scanCompleted.invoke(payload);
        this.scanActions.scanCompleted.invoke(null);
    }

    private buildInstanceCount(results: AxeAnalyzerResult): InstanceCount {
        return {
            PASS: this.buildResultInstanceCount(results?.originalResult?.passes),
            FAIL: this.buildResultInstanceCount(results?.originalResult?.violations),
            INCOMPLETE: this.buildResultInstanceCount(results?.originalResult?.incomplete),
        };
    }

    private buildResultInstanceCount(ruleResults: RuleResult[]): DictionaryStringTo<number> {
        const accumulator: DictionaryStringTo<number> = {};

        if (ruleResults) {
            ruleResults.forEach(result => {
                const id = result.id;
                if (accumulator[id] === null) {
                    accumulator[id] = 1;
                } else {
                    accumulator[id]++;
                }
            });
        }
        return accumulator;
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
