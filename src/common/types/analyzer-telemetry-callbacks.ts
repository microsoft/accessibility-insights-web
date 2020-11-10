// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeAnalyzerResult } from '../../injected/analyzers/analyzer';
import {
    RuleAnalyzerScanTelemetryData,
    IssuesAnalyzerScanTelemetryData,
    NeedsReviewAnalyzerScanTelemetryData,
} from '../extension-telemetry-events';

export type IAnalyzerTelemetryCallback = ForRuleAnalyzerScanCallback;

export type ForRuleAnalyzerScanCallback = (
    analyzerResult: AxeAnalyzerResult,
    scanDuration: number,
    elementsScanned: number,
    testName: string,
    requirementName?: string,
) => RuleAnalyzerScanTelemetryData;

export type ForIssuesAnalyzerScanCallback = (
    analyzerResult: AxeAnalyzerResult,
    scanDuration: number,
    elementsScanned: number,
    testName: string,
) => IssuesAnalyzerScanTelemetryData;

export type ForNeedsReviewAnalyzerScanCallback = (
    analyzerResult: AxeAnalyzerResult,
    scanDuration: number,
    elementsScanned: number,
    testName: string,
) => NeedsReviewAnalyzerScanTelemetryData;
