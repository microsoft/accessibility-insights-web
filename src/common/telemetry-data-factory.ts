// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import * as React from 'react';
import { ReportExportServiceKey } from 'report-export/types/report-export-service';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import { DictionaryStringTo } from '../types/common-types';
import {
    AssessmentRequirementScanTelemetryData,
    AssessmentTelemetryData,
    AutoDetectedFailuresDialogStateTelemetryData,
    BaseTelemetryData,
    DetailsViewOpenedTelemetryData,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    ExportFastPassResultsTelemetryData,
    ExportResultsTelemetryData,
    FeatureFlagToggleTelemetryData,
    FileIssueClickTelemetryData,
    IssuesAnalyzerScanTelemetryData,
    NeedsReviewAnalyzerScanTelemetryData,
    ReportExportFormat,
    RequirementActionTelemetryData,
    RequirementSelectTelemetryData,
    RequirementStatusTelemetryData,
    RuleAnalyzerScanTelemetryData,
    ScopingTelemetryData,
    SelectGettingStartedTelemetryData,
    SetAllUrlsPermissionTelemetryData,
    SettingsOpenSourceItem,
    SettingsOpenTelemetryData,
    TabStopAutomatedFailuresInstanceCount,
    TabStopRequirementInstanceCount,
    TabStopsAutomatedResultsTelemetryData,
    TelemetryEventSource,
    ToggleTelemetryData,
    TriggeredBy,
    TriggeredByNotApplicable,
} from './extension-telemetry-events';
import {
    ForIssuesAnalyzerScanCallback,
    ForNeedsReviewAnalyzerScanCallback,
    ForRuleAnalyzerScanCallback,
} from './types/analyzer-telemetry-callbacks';
import { DetailsViewPivotType } from './types/store-data/details-view-pivot-type';
import { VisualizationType } from './types/visualization-type';

export type SupportedMouseEvent =
    | React.SyntheticEvent<MouseEvent>
    | React.MouseEvent<any>
    | MouseEvent
    | React.MouseEvent<HTMLElement>
    | React.KeyboardEvent<HTMLElement>
    | React.SyntheticEvent<Element, Event>
    | undefined;

export class TelemetryDataFactory {
    public forVisualizationToggleByCommand(enabled: boolean): ToggleTelemetryData {
        return {
            triggeredBy: 'shortcut',
            enabled,
            source: TelemetryEventSource.ShortcutCommand,
        };
    }

    public forToggle(
        event: SupportedMouseEvent,
        enabled: boolean,
        source: TelemetryEventSource,
    ): ToggleTelemetryData {
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

    public forExportedResults(
        reportExportFormat: ReportExportFormat,
        selectedServiceKey: ReportExportServiceKey,
        event: SupportedMouseEvent,
        source: TelemetryEventSource,
    ): ExportResultsTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            exportResultsType: reportExportFormat,
            exportResultsService: selectedServiceKey,
        };
    }

    public forExportedResultsWithFastPassData(
        tabStopRequirementData: TabStopRequirementState,
        wereAutomatedChecksRun: boolean,
        reportExportFormat: ReportExportFormat,
        selectedServiceKey: ReportExportServiceKey,
        event: React.MouseEvent<HTMLElement>,
        source: TelemetryEventSource,
    ): ExportFastPassResultsTelemetryData {
        const tabStopRequirementInstanceCount: TabStopRequirementInstanceCount = {
            pass: {},
            fail: {},
            unknown: {},
        };

        Object.entries(tabStopRequirementData).forEach(([requirementId, data]) => {
            if (data.status === 'fail') {
                tabStopRequirementInstanceCount[data.status][requirementId] = data.instances.length;
            } else {
                tabStopRequirementInstanceCount[data.status][requirementId] = 1;
            }
        });

        return {
            ...this.withTriggeredByAndSource(event, source),
            exportResultsType: reportExportFormat,
            exportResultsService: selectedServiceKey,
            wereAutomatedChecksRun,
            tabStopRequirementInstanceCount,
        };
    }

    public forAddSelector(
        event: SupportedMouseEvent,
        inputType: string,
        source: TelemetryEventSource,
    ): ScopingTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            inputType,
        };
    }

    public forDeleteSelector(
        event: SupportedMouseEvent,
        inputType: string,
        source: TelemetryEventSource,
    ): ScopingTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            inputType,
        };
    }

    public forSelectDetailsView(
        event: SupportedMouseEvent,
        visualizationType: VisualizationType,
    ): DetailsViewOpenTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            selectedTest: VisualizationType[visualizationType],
        };
    }

    public forSelectRequirement(
        event: SupportedMouseEvent,
        visualizationType: VisualizationType,
        requirement: string,
    ): RequirementSelectTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            selectedTest: VisualizationType[visualizationType],
            selectedRequirement: requirement,
        };
    }

    public forSelectGettingStarted(
        event: SupportedMouseEvent,
        visualizationType: VisualizationType,
    ): SelectGettingStartedTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            selectedTest: VisualizationType[visualizationType],
        };
    }

    public forRequirementStatus(
        visualizationType: VisualizationType,
        requirement: string,
        passed: boolean,
        numInstances: number,
    ): RequirementStatusTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[visualizationType],
            selectedRequirement: requirement,
            passed: passed,
            numInstances: numInstances,
        };
    }

    public forOpenDetailsView(
        event: SupportedMouseEvent,
        visualizationType: VisualizationType,
        source: TelemetryEventSource,
    ): DetailsViewOpenTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            selectedTest: VisualizationType[visualizationType],
        };
    }

    public forDetailsViewOpened(
        selectedPivot: DetailsViewPivotType,
    ): DetailsViewOpenedTelemetryData {
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
        service: string,
    ): FileIssueClickTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            service,
        };
    }

    public forInspectElement(event: SupportedMouseEvent): BaseTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.IssueDetailsDialog),
        };
    }

    public forDetailsViewNavPivotActivated(
        event: SupportedMouseEvent,
        pivotKey: string,
    ): DetailsViewPivotSelectedTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            pivotKey,
        };
    }

    public forAssessmentActionFromDetailsViewNoTriggeredBy(
        visualizationType: VisualizationType,
    ): AssessmentTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[visualizationType],
        };
    }

    public forAssessmentActionFromDetailsView(
        visualizationType: VisualizationType,
        event: SupportedMouseEvent,
    ): AssessmentTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView),
            selectedTest: VisualizationType[visualizationType],
        };
    }

    public forRequirementFromDetailsView(
        test: VisualizationType,
        requirement: string,
    ): RequirementActionTelemetryData {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedRequirement: requirement,
            selectedTest: VisualizationType[test],
        };
    }

    public forTabStopRequirement(
        requirementId: TabStopRequirementId,
        source: TelemetryEventSource,
    ) {
        return {
            triggeredBy: TriggeredByNotApplicable,
            source,
            requirementId: requirementId,
        };
    }

    public forCancelStartOver(
        event: SupportedMouseEvent,
        test: VisualizationType,
        requirement: string,
    ): RequirementSelectTelemetryData {
        return {
            ...this.fromDetailsView(event),
            selectedTest: VisualizationType[test],
            selectedRequirement: requirement,
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

    public withTriggeredByAndSource(
        event: SupportedMouseEvent,
        source: TelemetryEventSource,
    ): BaseTelemetryData {
        return {
            triggeredBy: this.getTriggeredBy(event),
            source: source,
        };
    }

    public forAssessmentRequirementScan: ForRuleAnalyzerScanCallback = (
        analyzerResult,
        scanDuration,
        elementsScanned,
        testVisualizationType,
        requirementName,
    ) => {
        const telemetry: AssessmentRequirementScanTelemetryData = {
            ...this.forTestScan(
                analyzerResult,
                scanDuration,
                elementsScanned,
                testVisualizationType,
            ),
            requirementName,
        };

        return telemetry;
    };

    public forTestScan: ForRuleAnalyzerScanCallback = (
        analyzerResult,
        scanDuration,
        elementsScanned,
        testVisualizationType,
    ) => {
        const telemetry: RuleAnalyzerScanTelemetryData = {
            scanDuration: scanDuration,
            NumberOfElementsScanned: elementsScanned,
            include: analyzerResult.include,
            exclude: analyzerResult.exclude,
            testName: VisualizationType[testVisualizationType],
        };

        return telemetry;
    };

    public forIssuesAnalyzerScan: ForIssuesAnalyzerScanCallback = (
        analyzerResult,
        scanDuration,
        elementsScanned,
        testVisualizationType,
    ) => {
        const passedRuleResults: DictionaryStringTo<number> = this.generateTelemetryRuleResult(
            analyzerResult.originalResult.passes,
        );
        const failedRuleResults: DictionaryStringTo<number> = this.generateTelemetryRuleResult(
            analyzerResult.originalResult.violations,
        );
        const telemetry: IssuesAnalyzerScanTelemetryData = {
            ...this.forTestScan(
                analyzerResult,
                scanDuration,
                elementsScanned,
                testVisualizationType,
            ),
            passedRuleResults: JSON.stringify(passedRuleResults),
            failedRuleResults: JSON.stringify(failedRuleResults),
        };

        return telemetry;
    };

    public forNeedsReviewAnalyzerScan: ForNeedsReviewAnalyzerScanCallback = (
        analyzerResult,
        scanDuration,
        elementsScanned,
        testVisualizationType,
    ) => {
        const passedRuleResults: DictionaryStringTo<number> = this.generateTelemetryRuleResult(
            analyzerResult.originalResult.passes,
        );
        const failedRuleResults: DictionaryStringTo<number> = this.generateTelemetryRuleResult(
            analyzerResult.originalResult.violations,
        );
        const incompleteRuleResults: DictionaryStringTo<number> = this.generateTelemetryRuleResult(
            analyzerResult.originalResult.incomplete,
        );
        const telemetry: NeedsReviewAnalyzerScanTelemetryData = {
            ...this.forTestScan(
                analyzerResult,
                scanDuration,
                elementsScanned,
                testVisualizationType,
            ),
            passedRuleResults: JSON.stringify(passedRuleResults),
            failedRuleResults: JSON.stringify(failedRuleResults),
            incompleteRuleResults: JSON.stringify(incompleteRuleResults),
        };

        return telemetry;
    };

    public forLeftNavPanelExpanded(event: SupportedMouseEvent): BaseTelemetryData {
        return {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: this.getTriggeredBy(event),
        };
    }

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

    private generateTelemetryRuleResult(axeRule: AxeRule[]): DictionaryStringTo<number> {
        const ruleResults: DictionaryStringTo<number> = {};
        axeRule.forEach(element => {
            const key: string = element.id;
            if (key != null) {
                ruleResults[key] = element.nodes.length;
            }
        });
        return ruleResults;
    }

    public forSetAllUrlPermissionState(
        event: SupportedMouseEvent,
        source: TelemetryEventSource,
        permissionState: boolean,
    ): SetAllUrlsPermissionTelemetryData {
        return {
            ...this.withTriggeredByAndSource(event, source),
            permissionState,
        };
    }

    public forAutomatedTabStopsResults(
        results: AutomatedTabStopRequirementResult[],
        source: TelemetryEventSource,
    ): TabStopsAutomatedResultsTelemetryData | undefined {
        if (!results || results.length === 0) {
            return undefined;
        }

        const tabStopAutomatedFailuresInstanceCount: TabStopAutomatedFailuresInstanceCount = {};
        results.forEach(({ requirementId }) => {
            const count = tabStopAutomatedFailuresInstanceCount[requirementId] ?? 0;
            tabStopAutomatedFailuresInstanceCount[requirementId] = count + 1;
        });

        return {
            triggeredBy: TriggeredByNotApplicable,
            source,
            tabStopAutomatedFailuresInstanceCount,
        };
    }

    public forSetAutoDetectedFailuresDialogState(
        enabled: boolean,
    ): AutoDetectedFailuresDialogStateTelemetryData | undefined {
        if (enabled === undefined) {
            return undefined;
        }

        return {
            enabled,
        };
    }
}
