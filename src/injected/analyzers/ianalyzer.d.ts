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

// tslint:disable-next-line:interface-name
interface IAnalyzer<TResult> {
    analyze(): void;
    teardown(): void;
}

// tslint:disable-next-line:interface-name
interface IScanCompletedPayload<TSelectorValue> extends IScanBasePayload {
    selectorMap: IDictionaryStringTo<TSelectorValue>;
    scanResult: ScanResults;
}

// tslint:disable-next-line:interface-name
interface IScanUpdatePayload extends IScanBasePayload {
    results: ITabStopEvent[];
}

// tslint:disable-next-line:interface-name
interface IScanBasePayload extends BaseActionPayload {
    testType: VisualizationType;
    key: string;
}

// tslint:disable-next-line:interface-name
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

// tslint:disable-next-line:interface-name
interface IFocusAnalyzerConfiguration extends IAnalyzerConfiguration {
    analyzerTerminatedMessageType: string;
    analyzerProgressMessageType: string;
}
