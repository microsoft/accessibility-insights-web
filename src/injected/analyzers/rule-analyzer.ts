// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as Q from 'q';
import { ScopingInputTypes } from '../../background/scoping-input-types';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { IBaseStore } from '../../common/istore';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { ForRuleAnalyzerScanCallback } from '../../common/types/analyzer-telemetry-callbacks';
import { IScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { ScanOptions } from '../../scanner/exposed-apis';
import { ScanResults } from '../../scanner/iruleresults';
import { ScannerUtils } from '../scanner-utils';
import { AxeAnalyzerResult, IAnalyzer, RuleAnalyzerConfiguration } from './analyzer';
import { BaseAnalyzer } from './base-analyzer';

export class RuleAnalyzer extends BaseAnalyzer implements IAnalyzer {
    private startTime: number;
    private elementsScanned: number = 0; // Not implemented

    constructor(
        protected config: RuleAnalyzerConfiguration,
        protected scanner: ScannerUtils,
        protected scopingStore: IBaseStore<IScopingStoreData>,
        protected sendMessageDelegate: (message) => void,
        protected dateGetter: () => Date,
        protected telemetryFactory: TelemetryDataFactory,
        protected readonly visualizationConfigFactory: VisualizationConfigurationFactory,
    ) {
        super(config, sendMessageDelegate);
    }

    protected getResults(): Q.Promise<AxeAnalyzerResult> {
        const deferred = Q.defer<AxeAnalyzerResult>();
        const scopingState = this.scopingStore.getState().selectors;
        const include = scopingState[ScopingInputTypes.include];
        const exclude = scopingState[ScopingInputTypes.exclude];

        const scanOptions: ScanOptions = {
            testsToRun: this.getRulesToRun(),
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

            deferred.resolve(result);
        };

        this.startTime = this.dateGetter().getTime();
        this.scanner.scan(scanOptions, scanCallback);

        return deferred.promise;
    }

    protected getRulesToRun(): string[] {
        return this.config.rules;
    }

    @autobind
    protected onResolve(analyzerResult: AxeAnalyzerResult): void {
        this.sendScanCompleteResolveMessage(analyzerResult, this.config);
    }

    protected sendScanCompleteResolveMessage(analyzerResult: AxeAnalyzerResult, config: RuleAnalyzerConfiguration): void {
        const endTime = this.dateGetter().getTime();
        const elapsedTime = endTime - this.startTime;
        const baseMessage = this.createBaseMessage(analyzerResult, config);
        const telemetryGetter: ForRuleAnalyzerScanCallback = config.telemetryProcessor(this.telemetryFactory);
        const testName = this.visualizationConfigFactory.getConfiguration(config.testType).displayableData.title;
        const telemetry = telemetryGetter(analyzerResult, elapsedTime, this.elementsScanned, testName, config.key);

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
