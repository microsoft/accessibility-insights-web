// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseActionPayload } from '../../background/actions/action-payloads';
import { IAnalyzerTelemetryCallback } from '../../common/types/analyzer-telemetry-callbacks';
import { ISingleElementSelector } from '../../common/types/store-data/scoping-store-data';
import { TelemetryProcessor } from '../../common/types/telemetry-processor';
import { VisualizationType } from '../../common/types/visualization-type';
import { ScanResults } from '../../scanner/iruleresults';
import { DictionaryStringTo } from '../../types/common-types';
import { IHtmlElementAxeResults, ScannerUtils } from '../scanner-utils';
import { ITabStopEvent } from '../tab-stops-listener';

export interface AxeAnalyzerResult {
    results: DictionaryStringTo<any>;
    originalResult: ScanResults;
    include?: ISingleElementSelector[];
    exclude?: ISingleElementSelector[];
}

export interface Analyzer {
    analyze(): void;
    teardown(): void;
}

export interface ScanCompletedPayload<TSelectorValue> extends IScanBasePayload {
    selectorMap: DictionaryStringTo<TSelectorValue>;
    scanResult: ScanResults;
}

export interface ScanUpdatePayload extends IScanBasePayload {
    results: ITabStopEvent[];
}

// tslint:disable-next-line:interface-name
export interface IScanBasePayload extends BaseActionPayload {
    testType: VisualizationType;
    key: string;
}

// tslint:disable-next-line:interface-name
export interface IAnalyzerConfiguration {
    key: string;
    testType: VisualizationType;
    analyzerMessageType: string;
}

export interface RuleAnalyzerConfiguration extends IAnalyzerConfiguration {
    rules: string[];
    resultProcessor: (scanner: ScannerUtils) => (results: ScanResults) => DictionaryStringTo<IHtmlElementAxeResults>;
    telemetryProcessor: TelemetryProcessor<IAnalyzerTelemetryCallback>;
}

// tslint:disable-next-line:interface-name
export interface IFocusAnalyzerConfiguration extends IAnalyzerConfiguration {
    analyzerTerminatedMessageType: string;
    analyzerProgressMessageType: string;
}
