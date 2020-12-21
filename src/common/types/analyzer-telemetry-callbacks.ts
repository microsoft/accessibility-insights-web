// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { VisualizationType } from 'common/types/visualization-type';
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
    testVisualizationType: VisualizationType,
    requirementName?: string,
) => RuleAnalyzerScanTelemetryData;

export type ForIssuesAnalyzerScanCallback = (
    analyzerResult: AxeAnalyzerResult,
    scanDuration: number,
    elementsScanned: number,
    testVisualizationType: VisualizationType,
) => IssuesAnalyzerScanTelemetryData;

export type ForNeedsReviewAnalyzerScanCallback = (
    analyzerResult: AxeAnalyzerResult,
    scanDuration: number,
    elementsScanned: number,
    testVisualizationType: VisualizationType,
) => NeedsReviewAnalyzerScanTelemetryData;
