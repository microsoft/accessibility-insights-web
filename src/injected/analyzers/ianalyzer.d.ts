// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ISingleElementSelector } from '../../common/types/store-data/scoping-store-data';
import { TelemetryProcessor } from '../../common/types/telemetry-processor';
import { VisualizationType } from '../../common/types/visualization-type';
import { ITabStopEvent } from '../tab-stops-listener';
import { BaseActionPayload } from './../../background/actions/action-payloads';
import { ScanResults } from './../../scanner/iruleresults.d';

export interface AxeAnalyzerResult {
    results: IDictionaryStringTo<TResult>;
    originalResult: ScanResults;
    include?: ISingleElementSelector[];
    exclude?: ISingleElementSelector[];
}

interface IAnalyzer<TResult> {
    analyze(): void;
    teardown(): void;
}

interface IScanCompletedPayload<TSelectorValue> extends IScanBasePayload {
    selectorMap: IDictionaryStringTo<TSelectorValue>;
    scanResult: ScanResults;
}

interface IScanUpdatePayload extends IScanBasePayload {
    results: ITabStopEvent[];
}

interface IScanBasePayload extends BaseActionPayload {
    testType: VisualizationType;
    key: string;
}

interface IAnalyzerConfiguration {
    key: string;
    testType: VisualizationType;
    analyzerMessageType: string;
}

interface RuleAnalyzerConfiguration extends IAnalyzerConfiguration {
    rules: string[];
    resultProcessor: (scanner: ScannerUtils) => (results: ScanResults) => IDictionaryStringTo<IHtmlElementAxeResults>;
    telemetryProcessor: TelemetryProcessor<IAnalyzerTelemetryCallback>;
}

interface IFocusAnalyzerConfiguration extends IAnalyzerConfiguration {
    analyzerTerminatedMessageType: string;
    analyzerProgressMessageType: string;
}
