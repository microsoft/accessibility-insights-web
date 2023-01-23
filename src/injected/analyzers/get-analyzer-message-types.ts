// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Messages } from 'common/messages';

export type AnalyzerMessageConfiguration =
    | BaseAnalyzerMessageConfiguration
    | FocusAnalyzerMessageConfiguration;

export interface BaseAnalyzerMessageConfiguration {
    analyzerMessageType: string;
}

export interface FocusAnalyzerMessageConfiguration extends BaseAnalyzerMessageConfiguration {
    analyzerTerminatedMessageType: string;
    analyzerProgressMessageType: string;
}

export const AdhocVisualizationMessageTypes: AnalyzerMessageConfiguration = {
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
    analyzerProgressMessageType: Messages.Visualizations.TabStops.TabbedElementAdded,
    analyzerTerminatedMessageType: Messages.Visualizations.TabStops.TerminateScan,
};

export const AssessmentVisualizationMessageTypes: AnalyzerMessageConfiguration = {
    analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
    analyzerProgressMessageType: Messages.Assessment.ScanUpdate,
    analyzerTerminatedMessageType: Messages.Assessment.TrackingCompleted,
};

export const QuickAssessVisualizationMessageTypes: AnalyzerMessageConfiguration = {
    analyzerMessageType: Messages.QuickAssess.AssessmentScanCompleted,
    analyzerProgressMessageType: Messages.QuickAssess.ScanUpdate,
    analyzerTerminatedMessageType: Messages.QuickAssess.TrackingCompleted,
};
