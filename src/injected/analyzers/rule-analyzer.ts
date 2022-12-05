// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { Logger } from 'common/logging/logger';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { ForRuleAnalyzerScanCallback } from 'common/types/analyzer-telemetry-callbacks';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { ScopingInputTypes } from 'common/types/store-data/scoping-input-types';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { ScanResults } from 'scanner/iruleresults';
import { ScanOptions } from 'scanner/scan-options';

import { ScannerUtils } from '../scanner-utils';
import { RuleAnalyzerConfiguration } from './analyzer';
import { BaseAnalyzer } from './base-analyzer';

export type MessageDelegate = (message: any) => void;
export type PostResolveCallback = (results: AxeAnalyzerResult) => void;

export class RuleAnalyzer extends BaseAnalyzer {
    private startTime: number;
    private elementsScanned: number = 0; // Not implemented

    constructor(
        protected config: RuleAnalyzerConfiguration,
        protected scanner: ScannerUtils,
        protected scopingStore: BaseStore<ScopingStoreData, Promise<void>>,
        protected sendMessageDelegate: (message) => void,
        protected dateGetter: () => Date,
        protected telemetryFactory: TelemetryDataFactory,
        private postOnResolve: PostResolveCallback | null,
        scanIncompleteWarningDetector: ScanIncompleteWarningDetector,
        logger: Logger,
    ) {
        super(config, sendMessageDelegate, scanIncompleteWarningDetector, logger);
    }

    protected getResults = (): Promise<AxeAnalyzerResult> => {
        return new Promise(resolve => {
            const scopingState = this.scopingStore.getState().selectors;
            const include = scopingState[ScopingInputTypes.include];
            const exclude = scopingState[ScopingInputTypes.exclude];

            const scanOptions: ScanOptions = {
                testsToRun: this.getRulesToRun() ?? undefined,
                include: include,
                exclude: exclude,
            };

            const scanCallback = (resultsFromScan: ScanResults): void => {
                const resultProcessor = this.config.resultProcessor(this.scanner);
                const result: AxeAnalyzerResult = {
                    results: resultProcessor(resultsFromScan),
                    include: include,
                    exclude: exclude,
                    originalResult: resultsFromScan,
                };

                resolve(result);
            };

            this.startTime = this.dateGetter().getTime();
            this.scanner.scan(scanOptions, scanCallback);
        });
    };

    // null implies "the scanner's default rule set"
    protected getRulesToRun(): string[] | null {
        return this.config.rules;
    }

    protected onResolve = (analyzerResult: AxeAnalyzerResult): void => {
        this.sendScanCompleteResolveMessage(analyzerResult, this.config);
        if (this.postOnResolve != null) {
            this.postOnResolve(analyzerResult);
        }
    };

    protected sendScanCompleteResolveMessage(
        analyzerResult: AxeAnalyzerResult,
        config: RuleAnalyzerConfiguration,
    ): void {
        const endTime = this.dateGetter().getTime();
        const elapsedTime = endTime - this.startTime;
        const baseMessage = this.createBaseMessage(analyzerResult, config);
        const telemetryGetter: ForRuleAnalyzerScanCallback = config.telemetryProcessor(
            this.telemetryFactory,
        );
        const telemetry = telemetryGetter(
            analyzerResult,
            elapsedTime,
            this.elementsScanned,
            config.testType,
            config.key,
        );

        const message = {
            ...baseMessage,
            payload: {
                ...baseMessage.payload,
                telemetry,
            },
        };

        this.sendMessage(message);
    }
}
