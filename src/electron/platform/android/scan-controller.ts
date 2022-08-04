// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanResultActions } from 'background/actions/unified-scan-result-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    AtfaInstanceCount,
    InstanceCount,
    TelemetryEventSource,
} from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import {
    SCAN_COMPLETED,
    SCAN_FAILED,
    SCAN_STARTED,
} from 'electron/common/electron-telemetry-events';
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';
import {
    AndroidScanResults,
    AxeRuleResultsData,
} from 'electron/platform/android/android-scan-results';
import { AccessibilityHierarchyCheckResult } from 'electron/platform/android/atfa-data-types';
import { DeviceCommunicator } from 'electron/platform/android/device-communicator';
import { UnifiedScanCompletedPayloadBuilder } from 'electron/platform/android/unified-result-builder';
import { isObject } from 'lodash';

export class ScanController {
    private readonly executingScope = 'ScanController';

    constructor(
        private readonly scanActions: ScanActions,
        private readonly unifiedScanResultAction: UnifiedScanResultActions,
        private readonly deviceConnectionActions: DeviceConnectionActions,
        private readonly unifiedResultsBuilder: UnifiedScanCompletedPayloadBuilder,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly getCurrentDate: () => Date,
        private readonly logger: Logger,
        private readonly deviceCommunicator: DeviceCommunicator,
    ) {}

    public initialize(): void {
        this.scanActions.scanStarted.addListener(this.onScanStarted);
    }

    private onScanStarted = async () => {
        this.telemetryEventHandler.publishTelemetry(SCAN_STARTED, {
            telemetry: {
                source: TelemetryEventSource.ElectronDeviceConnect,
            },
        });

        const scanStartedTime = this.getCurrentDate().getTime();

        let data: AndroidScanResults;
        try {
            data = await this.fetchScanResults();
        } catch (e) {
            this.scanFailed(scanStartedTime, e);
            return;
        }
        await this.scanCompleted(scanStartedTime, data);
    };

    private async scanCompleted(scanStartedTime: number, data: AndroidScanResults): Promise<void> {
        const scanCompletedTime = this.getCurrentDate().getTime();

        const scanDuration = scanCompletedTime - scanStartedTime;

        const axeInstanceCount = this.buildAxeInstanceCount(data.axeRuleResults);
        const atfaInstanceCount = this.buildAtfaInstanceCount(data.atfaResults);

        this.telemetryEventHandler.publishTelemetry(SCAN_COMPLETED, {
            telemetry: {
                scanDuration,
                ...axeInstanceCount,
                ...atfaInstanceCount,
            },
        });

        const payload = this.unifiedResultsBuilder(data);

        await this.unifiedScanResultAction.scanCompleted.invoke(payload, this.executingScope);
        this.scanActions.scanCompleted.invoke(undefined, this.executingScope);
        this.deviceConnectionActions.statusConnected.invoke(undefined, this.executingScope);
    }

    private buildAxeInstanceCount(axeRuleResults: AxeRuleResultsData[]): InstanceCount {
        return axeRuleResults.reduce<InstanceCount>(
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

    private buildAtfaInstanceCount(
        atfaResults: AccessibilityHierarchyCheckResult[],
    ): AtfaInstanceCount {
        return atfaResults.reduce<AtfaInstanceCount>(
            (accumulator, currentResult) => {
                const status = currentResult['AccessibilityCheckResult.type'];
                const ruleId = currentResult['AccessibilityCheckResult.checkClass'];

                if (status !== 'NOT_RUN') {
                    if (accumulator[status][ruleId] == null) {
                        accumulator[status][ruleId] = 1;
                    } else {
                        accumulator[status][ruleId]++;
                    }
                }

                return accumulator;
            },
            { ERROR: {}, WARNING: {}, INFO: {}, RESOLVED: {} },
        );
    }

    private scanFailed(scanStartedTime: number, error: Error): void {
        this.logger.error('scan failed: ', error);

        const scanCompletedTime = this.getCurrentDate().getTime();

        const scanDuration = scanCompletedTime - scanStartedTime;

        this.telemetryEventHandler.publishTelemetry(SCAN_FAILED, {
            telemetry: {
                scanDuration,
            },
        });

        this.scanActions.scanFailed.invoke(undefined, this.executingScope);
        this.deviceConnectionActions.statusDisconnected.invoke(undefined, this.executingScope);
    }

    private fetchScanResults = async (): Promise<AndroidScanResults> => {
        const results = await this.deviceCommunicator.fetchContent('result');
        const parsedResults = JSON.parse(results);
        if (!isObject(parsedResults)) {
            throw new Error(`parseScanResults: invalid object: ${parsedResults}`);
        }
        const scanResults = new AndroidScanResults(parsedResults);
        return scanResults;
    };
}
