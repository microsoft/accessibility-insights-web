// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    AssessmentRequirementScanTelemetryData,
    AssessmentTelemetryData,
    BaseTelemetryData,
    DetailsViewOpenedTelemetryData,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    ExportResultsTelemetryData,
    ExportResultType,
    FeatureFlagToggleTelemetryData,
    FileIssueClickService,
    FileIssueClickTelemetryData,
    InspectTelemetryData,
    IssuesAnalyzerScanTelemetryData,
    RequirementStatusTelemetryData,
    RuleAnalyzerScanTelemetryData,
    ScopingTelemetryData,
    SettingsOpenSourceItem,
    SettingsOpenTelemetryData,
    TelemetryEventSource,
    TestStepActionTelemetryData,
    TestStepSelectTelemetryData,
    ToggleTelemetryData,
    TriggeredBy,
    TriggeredByNotApplicable,
} from './telemetry-events';
import { ForIssuesAnalyzerScanCallback, ForRuleAnalyzerScanCallback } from './types/analyzer-telemetry-callbacks';
import { DetailsViewPivotType } from './types/details-view-pivot-type';
import { VisualizationType } from './types/visualization-type';

type SupportedMouseEvent = React.SyntheticEvent<MouseEvent> | React.MouseEvent<any> | MouseEvent;

export class TelemetryDataFactory {
    public forVisualizationToggleByCommand(enabled: boolean): ToggleTelemetryData {
        return {
            triggeredBy: 'shortcut',
            enabled,
            source: TelemetryEventSource.ShortcutCommand,
        };
    }

    public forToggle(event: SupportedMouseEvent, enabled: boolean, source: TelemetryEventSource): ToggleTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            enabled,
        };
    }

    public forFeatureFlagToggle(
        event: SupportedMouseEvent,
        enabled: boolean,
        source: TelemetryEventSource,
        featureFlagId: string,
    ): FeatureFlagToggleTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            enabled,
            featureFlagId,
        };
    }

    public forExportedHtml(
        exportResultsType: ExportResultType,
        html: string,
        event: SupportedMouseEvent,
        source: TelemetryEventSource,
    ): ExportResultsTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            exportResultsType,
            exportResultsData: html.length,
        };
    }

    public forAddSelector(event: SupportedMouseEvent, inputType: string, source: TelemetryEventSource): ScopingTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            inputType,
        };
    }

    public forDeleteSelector(event: SupportedMouseEvent, inputType: string, source: TelemetryEventSource): ScopingTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            inputType,
        };
    }

    public forSelectDetailsView(event: SupportedMouseEvent, type: VisualizationType): DetailsViewOpenTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            detailsView: VisualizationType[type],
        };
    }

    public forSelectTestStep(event: SupportedMouseEvent, type: VisualizationType, step: string): TestStepSelectTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            selectedTest: VisualizationType[type],
            selectedStep: step,
        };
    }

    public forRequirementStatus(
        type: VisualizationType,
        step: string,
        passed: boolean,
        numInstances: number,
    ): RequirementStatusTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[type],
            selectedStep: step,
            passed: passed,
            numInstances: numInstances,
        };
    }

    public forOpenDetailsView(
        event: SupportedMouseEvent,
        type: VisualizationType,
        source: TelemetryEventSource,
    ): DetailsViewOpenTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            detailsView: VisualizationType[type],
        };
    }

    public forDetailsViewOpened(selectedPivot: DetailsViewPivotType): DetailsViewOpenedTelemetryData {
        return {
            ...this.fromDetailsViewNoTriggeredBy(),
            selectedDetailsViewPivot: DetailsViewPivotType[selectedPivot],
        };
    }

    public forSettingsPanelOpen(
        event: SupportedMouseEvent,
        source: TelemetryEventSource,
        sourceItem: SettingsOpenSourceItem,
    ): SettingsOpenTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            sourceItem,
        };
    }

    public forFileIssueClick(
        event: SupportedMouseEvent,
        source: TelemetryEventSource,
        service: FileIssueClickService,
    ): FileIssueClickTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            service,
        };
    }

    public forInspectElement(event: SupportedMouseEvent, target: string[]): InspectTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.IssueDetailsDialog),
            target: target,
        };
    }

    public forDetailsViewNavPivotActivated(event: SupportedMouseEvent, pivotKey: string): DetailsViewPivotSelectedTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            pivotKey,
        };
    }

    public forAssessmentActionFromDetailsViewNoTriggeredBy(type: VisualizationType): AssessmentTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[type],
        };
    }

    public forAssessmentActionFromDetailsView(type: VisualizationType, event: SupportedMouseEvent): AssessmentTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            selectedTest: VisualizationType[type],
        };
    }

    public forTestStepFromDetailsView(test: VisualizationType, step: string): TestStepActionTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedStep: step,
            selectedTest: VisualizationType[test],
        };
    }

    public forCancelStartOver(event: SupportedMouseEvent, test: VisualizationType, step: string): TestStepSelectTelemetryData {
        return {
            ...this.fromDetailsView(event),
            selectedTest: VisualizationType[test],
            selectedStep: step,
        };
    }

    public fromDetailsViewNoTriggeredBy(): BaseTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };
    }

    public fromDetailsView(event: SupportedMouseEvent): BaseTelemetryData {
        return this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView);
    }

    public fromHamburgerMenu(event: SupportedMouseEvent): BaseTelemetryData {
        return this.withTriggeredByAndSource(event, TelemetryEventSource.HamburgerMenu);
    }

    public fromLaunchPad(event: SupportedMouseEvent): BaseTelemetryData {
        return this.withTriggeredByAndSource(event, TelemetryEventSource.LaunchPad);
    }

    public withTriggeredByAndSource(event: SupportedMouseEvent, source: TelemetryEventSource): BaseTelemetryData {
        return {
            triggeredBy: this.getTriggeredBy(event),
            source: source,
        };
    }

    public forAssessmentRequirementScan: ForRuleAnalyzerScanCallback = (
        analyzerResult,
        scanDuration,
        elementsScanned,
        testName,
        requirementName,
    ) => {
        const telemetry: AssessmentRequirementScanTelemetryData = {
            ...this.forTestScan(analyzerResult, scanDuration, elementsScanned, testName),
            requirementName,
        };

        return telemetry;
    };

    public forTestScan: ForRuleAnalyzerScanCallback = (analyzerResult, scanDuration, elementsScanned, testName) => {
        const telemetry: RuleAnalyzerScanTelemetryData = {
            scanDuration: scanDuration,
            NumberOfElementsScanned: elementsScanned,
            include: analyzerResult.include,
            exclude: analyzerResult.exclude,
            testName,
        };

        return telemetry;
    };

    public forIssuesAnalyzerScan: ForIssuesAnalyzerScanCallback = (analyzerResult, scanDuration, elementsScanned, testName) => {
        const passedRuleResults: IDictionaryStringTo<number> = this.generateTelemetryRuleResult(analyzerResult.originalResult.passes);
        const failedRuleResults: IDictionaryStringTo<number> = this.generateTelemetryRuleResult(analyzerResult.originalResult.violations);
        const telemetry: IssuesAnalyzerScanTelemetryData = {
            ...this.forTestScan(analyzerResult, scanDuration, elementsScanned, testName),
            passedRuleResults: JSON.stringify(passedRuleResults),
            failedRuleResults: JSON.stringify(failedRuleResults),
        };

        return telemetry;
    };

    private getTriggeredBy(event: SupportedMouseEvent): TriggeredBy {
        // MouseEvent => event.detail === 0 ? "keypress" : "mouseclick"
        // React.SyntheticEvent<MouseEvent> event.nativeEvent can be cast to MouseEvent
        // React.MouseEvent<any> event.nativeEvent can be cast to MouseEvent
        if (!event) {
            return TriggeredByNotApplicable;
        }
        const reactEvent = event as React.MouseEvent<any>;
        const mouseEvent = (reactEvent.nativeEvent || event) as MouseEvent;
        return mouseEvent.detail === 0 ? 'keypress' : 'mouseclick';
    }

    private generateTelemetryRuleResult(axeRule: AxeRule[]): IDictionaryStringTo<number> {
        const ruleResults: IDictionaryStringTo<number> = {};
        axeRule.forEach(element => {
            const key: string = element.id;
            if (key != null) {
                ruleResults[key] = element.nodes.length;
            }
        });
        return ruleResults;
    }
}
