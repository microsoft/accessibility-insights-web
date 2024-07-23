// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentRequirementScanTelemetryData,
    AssessmentTelemetryData,
    BaseTelemetryData,
    DetailsViewOpenedTelemetryData,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    ExportFastPassResultsTelemetryData,
    ExportResultsTelemetryData,
    FeatureFlagToggleTelemetryData,
    FileIssueClickTelemetryData,
    RequirementActionTelemetryData,
    RequirementSelectTelemetryData,
    RuleAnalyzerScanTelemetryData,
    SelectGettingStartedTelemetryData,
    SetAllUrlsPermissionTelemetryData,
    SettingsOpenSourceItem,
    SettingsOpenTelemetryData,
    TabStopsAutomatedResultsTelemetryData,
    TelemetryEventSource,
    ToggleTelemetryData,
    TriggeredByNotApplicable,
} from 'common/extension-telemetry-events';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import { EventStubFactory } from './../../common/event-stub-factory';

describe('TelemetryDataFactoryTest', () => {
    const testObject: TelemetryDataFactory = new TelemetryDataFactory();
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = 1 as TelemetryEventSource;
    const mouseClickEvent = eventStubFactory.createMouseClickEvent() as any;
    const keypressEvent = eventStubFactory.createKeypressEvent() as any;
    const sourceStub: TelemetryEventSource = -1 as TelemetryEventSource;

    test('forAddSelector', () => {
        const event = mouseClickEvent;

        const source = TelemetryEventSource.AdHocTools;
        const inputType = 'inputType';

        const result = testObject.forAddSelector(event, inputType, source);

        const expected = {
            triggeredBy: 'mouseclick',
            source: source,
            inputType: inputType,
        };

        expect(result).toEqual(expected);
    });

    test('forDeleteSelector', () => {
        const event = mouseClickEvent;

        const source = TelemetryEventSource.AdHocTools;
        const inputType = 'inputType';

        const result = testObject.forDeleteSelector(event, inputType, source);

        const expected = {
            triggeredBy: 'mouseclick',
            source: source,
            inputType: inputType,
        };

        expect(result).toEqual(expected);
    });

    test('forToggle by keypress', () => {
        const event = keypressEvent;
        const enabled = true;

        const result = testObject.forToggle(event, enabled, testSource);

        const expected = {
            triggeredBy: 'keypress',
            enabled,
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forToggle by mouseclick', () => {
        const event = mouseClickEvent;
        const enabled = true;

        const result = testObject.forToggle(event, enabled, testSource);

        const expected = {
            triggeredBy: 'mouseclick',
            enabled,
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forSelectDetailsView by keypress', () => {
        const event = keypressEvent;
        const visualizationType = VisualizationType.Color;
        const source = TelemetryEventSource.DetailsView;

        const result = testObject.forSelectDetailsView(event, visualizationType);

        const expected: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[visualizationType],
            triggeredBy: 'keypress',
            source,
        };

        expect(result).toEqual(expected);
    });

    test('forSelectDetailsView by mouseclick', () => {
        const event = mouseClickEvent;
        const visualizationType = VisualizationType.Color;
        const source = TelemetryEventSource.DetailsView;

        const result = testObject.forSelectDetailsView(event, visualizationType);

        const expected: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[visualizationType],
            triggeredBy: 'mouseclick',
            source,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewOpened', () => {
        const detailsViewPivotStub = -1 as DetailsViewPivotType;
        const result = testObject.forDetailsViewOpened(detailsViewPivotStub);
        const expected: DetailsViewOpenedTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedDetailsViewPivot: DetailsViewPivotType[detailsViewPivotStub],
        };

        expect(result).toEqual(expected);
    });

    test('forSettingsPanelOpen', () => {
        const event = mouseClickEvent;
        const source = TelemetryEventSource.DetailsView;
        const sourceItem: SettingsOpenSourceItem = 'menu';

        const result = testObject.forSettingsPanelOpen(event, source, sourceItem);

        const expected: SettingsOpenTelemetryData = {
            triggeredBy: 'mouseclick',
            source,
            sourceItem,
        };
        expect(result).toEqual(expected);
    });

    test('forOpenDetailsView by keypress', () => {
        const visualizationType = VisualizationType.Headings;
        const event = keypressEvent;

        const result = testObject.forOpenDetailsView(event, visualizationType, testSource);

        const expected: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[visualizationType],
            triggeredBy: 'keypress',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forOpenDetailsView by mouseclick', () => {
        const visualizationType = VisualizationType.Headings;
        const event = mouseClickEvent;

        const result = testObject.forOpenDetailsView(event, visualizationType, testSource);

        const expected: DetailsViewOpenTelemetryData = {
            selectedTest: VisualizationType[visualizationType],
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewNavPivotActivated by keypress', () => {
        const event = {
            nativeEvent: {
                detail: 0,
            },
        } as any;

        const pivotKey = 'test item key';

        const result = testObject.forDetailsViewNavPivotActivated(event, pivotKey);

        const expected: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'keypress',
            pivotKey,
            source: TelemetryEventSource.DetailsView,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewNavPivotActivated by mouseclick', () => {
        const event = {
            nativeEvent: {
                detail: 1,
            },
        } as any;

        const pivotKey = 'test item key';

        const result = testObject.forDetailsViewNavPivotActivated(event, pivotKey);

        const expected: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'mouseclick',
            pivotKey,
            source: TelemetryEventSource.DetailsView,
        };

        expect(result).toEqual(expected);
    });

    test('forDetailsViewEventWithoutTrigger', () => {
        const result = testObject.fromDetailsViewNoTriggeredBy();
        const source = TelemetryEventSource.DetailsView;

        const expected: BaseTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source,
        };

        expect(result).toEqual(expected);
    });

    test('forVisualizationToggleByCommand', () => {
        const toEnabled = true;
        const result = testObject.forVisualizationToggleByCommand(toEnabled);

        const expected: ToggleTelemetryData = {
            triggeredBy: 'shortcut',
            enabled: toEnabled,
            source: TelemetryEventSource.ShortcutCommand,
        };

        expect(result).toEqual(expected);
    });

    test('forOpenShortcutConfigureTab', () => {
        const event = keypressEvent;
        const result: BaseTelemetryData = testObject.fromHamburgerMenu(event);

        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.HamburgerMenu,
        };

        expect(result).toEqual(expected);
    });

    test('forOpenTutorial', () => {
        const event = keypressEvent;
        const result: BaseTelemetryData = testObject.fromLaunchPad(event);

        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.LaunchPad,
        };

        expect(result).toEqual(expected);
    });

    test('forInspectElement', () => {
        const event = keypressEvent;
        const result: BaseTelemetryData = testObject.forInspectElement(event);

        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.IssueDetailsDialog,
        };

        expect(result).toEqual(expected);
    });

    test('withSourceAndTriggeredBy', () => {
        const event = mouseClickEvent;
        const expected: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        const actual = testObject.withTriggeredByAndSource(event, testSource);

        expect(actual).toEqual(expected);
    });

    test('forSelectRequirement', () => {
        const event = mouseClickEvent;
        const expected: RequirementSelectTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
            selectedRequirement: 'requirement',
        };

        const actual: RequirementSelectTelemetryData = testObject.forSelectRequirement(
            event,
            VisualizationType.Headings,
            'requirement',
        );

        expect(actual).toEqual(expected);
    });

    test('forSelectGettingStarted', () => {
        const event = mouseClickEvent;
        const visualizationType = VisualizationType.Headings;
        const expected: SelectGettingStartedTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[visualizationType],
        };

        const actual: SelectGettingStartedTelemetryData = testObject.forSelectGettingStarted(
            event,
            visualizationType,
        );

        expect(actual).toEqual(expected);
    });

    test('forSelectDetailsView without event', () => {
        const event = null;
        const expected: RequirementSelectTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
            selectedRequirement: 'requirement',
        };

        const actual: RequirementSelectTelemetryData = testObject.forSelectRequirement(
            event,
            VisualizationType.Headings,
            'requirement',
        );

        expect(actual).toEqual(expected);
    });

    test('forAssessmentActionFromDetailsViewNoTriggeredBy', () => {
        const expected: AssessmentTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
        };

        const actual: AssessmentTelemetryData =
            testObject.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.Headings);

        expect(actual).toEqual(expected);
    });

    test('forAssessmentActionFromDetailsView', () => {
        const event = mouseClickEvent;
        const expected: AssessmentTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.Headings],
        };

        const actual: AssessmentTelemetryData = testObject.forAssessmentActionFromDetailsView(
            VisualizationType.Headings,
            event,
        );

        expect(actual).toEqual(expected);
    });

    test('forAddRemoveFailureInstanceFromDetailsView', () => {
        const expected: RequirementActionTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedRequirement: 'requirement',
            selectedTest: VisualizationType[-1],
        };

        const actual: RequirementActionTelemetryData = testObject.forRequirementFromDetailsView(
            -1 as VisualizationType,
            'requirement',
        );

        expect(actual).toEqual(expected);
    });

    test('fromCancelStartOver', () => {
        const test = VisualizationType.ColorSensoryAssessment;
        const requirement = 'requirement';
        const expected = {
            selectedRequirement: requirement,
            selectedTest: VisualizationType[test],
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
        };

        const actual = testObject.forCancelStartOver(mouseClickEvent, test, requirement);

        expect(actual).toEqual(expected);
    });

    test('fromDetailsView', () => {
        const event = eventStubFactory.createNativeKeypressEvent() as any;
        const expected: BaseTelemetryData = {
            triggeredBy: 'keypress',
            source: TelemetryEventSource.DetailsView,
        };

        const actual = testObject.fromDetailsView(event);

        expect(actual).toEqual(expected);
    });

    test('forFeatureFlagToggle', () => {
        const event = mouseClickEvent;
        const expected: FeatureFlagToggleTelemetryData = {
            triggeredBy: 'mouseclick',
            enabled: true,
            source: TelemetryEventSource.DetailsView,
            featureFlagId: 'id',
        };

        const actual: FeatureFlagToggleTelemetryData = testObject.forFeatureFlagToggle(
            event,
            true,
            TelemetryEventSource.DetailsView,
            'id',
        );

        expect(actual).toEqual(expected);
    });

    test('forAssessmentRequirementScan', () => {
        const testVisualizationType = VisualizationType.Color;
        const requirementName = 'requirement';
        const analyzerResultStub = {
            include: [],
            exclude: [],
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forAssessmentRequirementScan(
            analyzerResultStub,
            elapsedTime,
            elementsScanned,
            testVisualizationType,
            requirementName,
        );
        const expected: AssessmentRequirementScanTelemetryData = {
            scanDuration: elapsedTime,
            NumberOfElementsScanned: elementsScanned,
            include: analyzerResultStub.include,
            exclude: analyzerResultStub.exclude,
            testName: VisualizationType[testVisualizationType],
            requirementName,
        };

        expect(actual).toEqual(expected);
    });

    test('forTestScan', () => {
        const testVisualizationType = VisualizationType.ContrastAssessment;
        const analyzerResultStub = {
            include: [],
            exclude: [],
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forTestScan(
            analyzerResultStub,
            elapsedTime,
            elementsScanned,
            testVisualizationType,
        );
        const expected: RuleAnalyzerScanTelemetryData = {
            scanDuration: elapsedTime,
            NumberOfElementsScanned: elementsScanned,
            include: analyzerResultStub.include,
            exclude: analyzerResultStub.exclude,
            testName: VisualizationType[testVisualizationType],
        };

        expect(actual).toEqual(expected);
    });

    test('forIssuesAnalyzerScan', () => {
        const testVisualizationType = VisualizationType.CustomWidgets;
        const analyzerResultStub = {
            include: [],
            exclude: [],
            originalResult: {
                passes: [
                    {
                        id: 'test',
                        nodes: [{}, {}],
                    },
                ],
                violations: [
                    {
                        id: 'test',
                        nodes: [{}],
                    },
                    {
                        id: 'test-2',
                        nodes: [{}],
                    },
                ],
            },
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forIssuesAnalyzerScan(
            analyzerResultStub,
            elapsedTime,
            elementsScanned,
            testVisualizationType,
        );
        const passedRuleResultsStub = {
            test: 2,
        };

        expect(actual.scanDuration).toBe(elapsedTime);
        expect(actual.NumberOfElementsScanned).toBe(elementsScanned);
        expect(actual.include).toBe(analyzerResultStub.include);
        expect(actual.exclude).toBe(analyzerResultStub.exclude);
        expect(JSON.parse(actual.passedRuleResults)).toEqual(passedRuleResultsStub);
    });

    test('forNeedsReviewAnalyzerScan', () => {
        const testVisualizationType = VisualizationType.Headings;
        const analyzerResultStub = {
            include: [],
            exclude: [],
            originalResult: {
                passes: [
                    {
                        id: 'test',
                        nodes: [{}, {}],
                    },
                ],
                violations: [
                    {
                        id: 'test',
                        nodes: [{}],
                    },
                    {
                        id: 'test-2',
                        nodes: [{}],
                    },
                ],
                incomplete: [
                    {
                        id: 'test',
                        nodes: [{}],
                    },
                ],
            },
        } as AxeAnalyzerResult;
        const elapsedTime = 50;
        const elementsScanned = 2;
        const actual = testObject.forNeedsReviewAnalyzerScan(
            analyzerResultStub,
            elapsedTime,
            elementsScanned,
            testVisualizationType,
        );
        const passedRuleResultsStub = {
            test: 2,
        };
        const incompleteRuleResultsStub = {
            test: 1,
        };
        const failedRuleResultsStub = {
            test: 1,
            'test-2': 1,
        };

        expect(actual.scanDuration).toBe(elapsedTime);
        expect(actual.NumberOfElementsScanned).toBe(elementsScanned);
        expect(actual.include).toBe(analyzerResultStub.include);
        expect(actual.exclude).toBe(analyzerResultStub.exclude);
        expect(JSON.parse(actual.passedRuleResults)).toEqual(passedRuleResultsStub);
        expect(JSON.parse(actual.incompleteRuleResults)).toEqual(incompleteRuleResultsStub);
        expect(JSON.parse(actual.failedRuleResults)).toEqual(failedRuleResultsStub);
    });

    test('forExportedResults by keypress', () => {
        const serviceKey = 'html';
        const event = keypressEvent;
        const exportResultsType = 'Assessment';

        const result = testObject.forExportedResults(
            exportResultsType,
            serviceKey,
            event,
            testSource,
        );

        const expected: ExportResultsTelemetryData = {
            exportResultsType: exportResultsType,
            exportResultsService: serviceKey,
            triggeredBy: 'keypress',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forExportedResults by mouseclick', () => {
        const serviceKey = 'html';
        const event = mouseClickEvent;
        const exportResultsType = 'FastPass';

        const result = testObject.forExportedResults(
            exportResultsType,
            serviceKey,
            event,
            testSource,
        );

        const expected: ExportResultsTelemetryData = {
            exportResultsType: exportResultsType,
            exportResultsService: serviceKey,
            triggeredBy: 'mouseclick',
            source: testSource,
        };

        expect(result).toEqual(expected);
    });

    test('forExportedResults', () => {
        const serviceKey = 'html';
        const event = mouseClickEvent;
        const exportResultsType = 'FastPass';
        const tabStopRequirementData = {
            'focus-indicator': {
                status: 'pass',
                instances: [],
                isExpanded: false,
            },
            'input-focus': {
                instances: [
                    { id: 'test-id-1', description: 'test desc 1' },
                    { id: 'test-id-2', description: 'test desc 2' },
                ],
                status: 'fail',
                isExpanded: false,
            },
            'keyboard-navigation': {
                instances: [],
                isExpanded: false,
                status: 'unknown',
            },
            'keyboard-traps': {
                instances: [],
                isExpanded: false,
                status: 'fail',
            },
            'tab-order': {
                instances: [],
                isExpanded: false,
                status: 'pass',
            },
        } as TabStopRequirementState;
        const wereAutomatedChecksRun = true;
        const result = testObject.forExportedResultsWithFastPassData(
            tabStopRequirementData,
            wereAutomatedChecksRun,
            exportResultsType,
            serviceKey,
            event,
            testSource,
        );

        const expected: ExportFastPassResultsTelemetryData = {
            exportResultsType: exportResultsType,
            exportResultsService: serviceKey,
            triggeredBy: 'mouseclick',
            source: testSource,
            wereAutomatedChecksRun: true,
            tabStopRequirementInstanceCount: {
                pass: { 'focus-indicator': 1, 'tab-order': 1 },
                unknown: { 'keyboard-navigation': 1 },
                fail: { 'input-focus': 2, 'keyboard-traps': 0 },
            },
        };

        expect(result).toEqual(expected);
    });

    test('forFileIssueClick', () => {
        const service = 'test-service';

        const result = testObject.forFileIssueClick(mouseClickEvent, testSource, service);

        const expected: FileIssueClickTelemetryData = {
            service,
            source: testSource,
            triggeredBy: 'mouseclick',
        };

        expect(result).toEqual(expected);
    });

    test('forSetAllUrlPermissionState', () => {
        const permissionState = true;

        const result = testObject.forSetAllUrlPermissionState(
            mouseClickEvent,
            testSource,
            permissionState,
        );

        const expected: SetAllUrlsPermissionTelemetryData = {
            permissionState,
            source: testSource,
            triggeredBy: 'mouseclick',
        };

        expect(result).toEqual(expected);
    });

    test('forLeftNavPanelExpanded', () => {
        const expected: BaseTelemetryData = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
        };

        const result = testObject.forLeftNavPanelExpanded(mouseClickEvent);

        expect(result).toEqual(expected);
    });

    test('forAutomatedTabStopsResults', () => {
        const tabbingResults: AutomatedTabStopRequirementResult[] = [
            { requirementId: 'tab-order', html: null, selector: null, description: null },
            { requirementId: 'tab-order', html: null, selector: null, description: null },
            { requirementId: 'keyboard-traps', html: null, selector: null, description: null },
        ];

        const result = testObject.forAutomatedTabStopsResults(tabbingResults, sourceStub);

        const expected: TabStopsAutomatedResultsTelemetryData = {
            tabStopAutomatedFailuresInstanceCount: { 'tab-order': 2, 'keyboard-traps': 1 },
            source: sourceStub,
            triggeredBy: 'N/A',
        };

        expect(result).toEqual(expected);
    });

    test('forAutomatedTabStopsResults returns undefined when no results', () => {
        const result = testObject.forAutomatedTabStopsResults([], sourceStub);
        expect(result).toBeUndefined();
    });

    test('forTabStopRequirement', () => {
        const requirementId: TabStopRequirementId = 'tab-order';
        const result = testObject.forTabStopRequirement(requirementId, sourceStub);
        const expected = {
            source: sourceStub,
            requirementId: requirementId,
            triggeredBy: TriggeredByNotApplicable,
        };
        expect(result).toEqual(expected);
    });

    test('forSetAutoDetectedFailuresDialogState', () => {
        const enabled = true;
        const result = testObject.forSetAutoDetectedFailuresDialogState(enabled);
        const expected = {
            enabled,
        };
        expect(result).toEqual(expected);
    });

    test('forSetAutoDetectedFailuresDialogState when undefined', () => {
        const result = testObject.forSetAutoDetectedFailuresDialogState(undefined);
        expect(result).toBeUndefined();
    });
});
