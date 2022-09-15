// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { IAnalyzerTelemetryCallback } from 'common/types/analyzer-telemetry-callbacks';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { TelemetryProcessor } from 'common/types/telemetry-processor';
import { VisualizationType } from 'common/types/visualization-type';
import { TabbableElementInfo } from 'injected/tabbable-element-getter';
import { ScanResults } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';
import { ScannerUtils } from '../scanner-utils';

export interface Analyzer {
    analyze(): void;
    teardown(): void;
}

export interface ScanCompletedPayload<TSelectorValue> extends ScanBasePayload {
    selectorMap: DictionaryStringTo<TSelectorValue>;
    scanResult: ScanResults;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
}

export interface TabStopsScanCompletedPayload extends BaseActionPayload {
    calculatedTabStops: TabbableElementInfo[];
}

export interface ScanUpdatePayload extends ScanBasePayload {
    results: TabStopEvent[];
}

export interface ScanBasePayload extends BaseActionPayload {
    testType: VisualizationType;
    key: string;
}

export interface AnalyzerConfiguration {
    key: string;
    testType: VisualizationType;
    analyzerMessageType: string;
}

export interface RuleAnalyzerConfiguration extends AnalyzerConfiguration {
    rules: string[];
    resultProcessor: (
        scanner: ScannerUtils,
    ) => (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>;
    telemetryProcessor: TelemetryProcessor<IAnalyzerTelemetryCallback>;
}

export interface FocusAnalyzerConfiguration extends AnalyzerConfiguration {
    analyzerTerminatedMessageType: string;
    analyzerProgressMessageType: string;
}
