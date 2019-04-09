// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { HeadingsTestStep } from '../../../../../assessments/headings/test-steps/test-steps';
import { OnDetailsViewPivotSelected } from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import {
    AssessmentTelemetryData,
    BaseTelemetryData,
    COPY_ISSUE_DETAILS,
    DETAILS_VIEW_OPEN,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    EXPORT_RESULTS,
    ExportResultsTelemetryData,
    FeatureFlagToggleTelemetryData,
    RequirementActionTelemetryData,
    RequirementSelectTelemetryData,
    TelemetryEventSource,
    TriggeredByNotApplicable,
} from '../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { WindowUtils } from '../../../../../common/window-utils';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { DetailsViewRightContentPanelType } from '../../../../../DetailsView/components/left-nav/details-view-right-content-panel-type';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('DetailsViewActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let windowUtilsMock: IMock<WindowUtils>;
    let postMessageMock: IMock<(message) => {}>;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let testSubject: DetailsViewActionMessageCreator;
    let tabId: number;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        postMessageMock = Mock.ofInstance(message => {
            return null;
        });
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        tabId = 1;
        testSubject = new DetailsViewActionMessageCreator(
            postMessageMock.object,
            tabId,
            telemetryFactoryMock.object,
            windowUtilsMock.object,
        );
    });

    afterEach(() => {
        windowUtilsMock.verifyAll();
        postMessageMock.verifyAll();
        telemetryFactoryMock.verifyAll();
    });

    test('updateIssuesSelectedTargets', () => {
        const selectedTargets: string[] = ['#headings-1', '#landmark-1'];
        const expectedMessage = {
            type: Messages.Visualizations.Issues.UpdateSelectedTargets,
            tabId: tabId,
            payload: selectedTargets,
        };
        setupPostMessage(expectedMessage);

        testSubject.updateIssuesSelectedTargets(selectedTargets);
    });

    test('updateFocusedInstanceTarget', () => {
        const instanceTarget = ['#headings-1'];
        const expectedMessage = {
            type: Messages.Visualizations.Issues.UpdateFocusedInstance,
            tabId: tabId,
            payload: instanceTarget,
        };
        setupPostMessage(expectedMessage);

        testSubject.updateFocusedInstanceTarget(instanceTarget);
    });

    test('switchToTargetTab', () => {
        const telemetryStub: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };
        const eventStub = {};
        const expectedMessage: Message = {
            type: Messages.Tab.Switch,
            tabId: tabId,
            payload: {
                telemetry: telemetryStub,
            },
        };
        setupPostMessage(expectedMessage);
        setupTelemetryFactory('fromDetailsView', telemetryStub, eventStub);

        testSubject.switchToTargetTab(eventStub as any);
    });

    test('selectDetailsView', () => {
        const view = VisualizationType.Headings;
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: DetailsViewOpenTelemetryData = {
            triggeredBy: 'keypress',
            selectedTest: VisualizationType[view],
            source: testSource,
        };
        const pivot = DetailsViewPivotType.allTest;

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Visualizations.DetailsView.Select,
            payload: {
                telemetry: telemetry,
                detailsViewType: view,
                pivotType: pivot,
            },
        };
        setupPostMessage(expectedMessage);

        telemetryFactoryMock
            .setup(tf => tf.forSelectDetailsView(event, view))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.selectDetailsView(event, VisualizationType.Headings, pivot);
    });

    test('selectRequirement', () => {
        const view = VisualizationType.Headings;
        const selectedRequirement = HeadingsTestStep.headingFunction;
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: RequirementSelectTelemetryData = {
            triggeredBy: 'keypress',
            selectedTest: VisualizationType[view],
            selectedRequirement: selectedRequirement,
            source: testSource,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.SelectTestRequirement,
            payload: {
                telemetry: telemetry,
                selectedRequirement: selectedRequirement,
                selectedTest: view,
            },
        };
        setupPostMessage(expectedMessage);

        telemetryFactoryMock
            .setup(tf => tf.forSelectRequirement(event, view, selectedRequirement))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.selectRequirement(event, HeadingsTestStep.headingFunction, view);
    });

    test('setFeatureFlag', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: FeatureFlagToggleTelemetryData = {
            triggeredBy: 'keypress',
            enabled: true,
            source: testSource,
            featureFlagId: 'test-id',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.FeatureFlags.SetFeatureFlag,
            payload: {
                feature: 'test-id',
                enabled: true,
                telemetry: telemetry,
            },
        };
        setupPostMessage(expectedMessage);

        telemetryFactoryMock
            .setup(tf => tf.forFeatureFlagToggle(event, true, TelemetryEventSource.DetailsView, 'test-id'))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.setFeatureFlag('test-id', true, event);
    });

    test('sendPivotItemClicked', () => {
        const pivot = DetailsViewPivotType.allTest;
        const telemetryData: DetailsViewPivotSelectedTelemetryData = {
            triggeredBy: 'keypress',
            pivotKey: DetailsViewPivotType[pivot],
            source: testSource,
        };

        const payload: OnDetailsViewPivotSelected = {
            telemetry: telemetryData,
            pivotKey: pivot,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Visualizations.DetailsView.PivotSelect,
            payload: payload,
        };
        setupPostMessage(expectedMessage);
        const mouseEventStub = {} as any;

        telemetryFactoryMock
            .setup(tf => tf.forDetailsViewNavPivotActivated(mouseEventStub, DetailsViewPivotType[pivot]))
            .returns(() => telemetryData)
            .verifiable();

        testSubject.sendPivotItemClicked(DetailsViewPivotType[pivot], mouseEventStub);
    });

    test('closePreviewFeaturesPanel', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.PreviewFeatures.ClosePanel,
            payload: {
                telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.closePreviewFeaturesPanel();
    });

    test('closeScopingPanel', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Scoping.ClosePanel,
            payload: {
                telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.closeScopingPanel();
    });

    test('closeSettingsPanel', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.SettingsPanel.ClosePanel,
            payload: {
                telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.closeSettingsPanel();
    });

    test('detailsViewOpened', () => {
        const telemetry = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
            selectedDetailsViewPivot: DetailsViewPivotType[1],
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Telemetry.Send,
            payload: {
                eventName: DETAILS_VIEW_OPEN,
                telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forDetailsViewOpened(1)).returns(() => telemetry);

        setupPostMessage(expectedMessage);
        testSubject.detailsViewOpened(1);
    });

    test('startOverTest', () => {
        const requirementStub = 'fake-requirement';
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: AssessmentTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.HeadingsAssessment],
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.StartOver,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement: requirementStub,
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsView(VisualizationType.HeadingsAssessment, event))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.startOverAssessment(event, VisualizationType.HeadingsAssessment, requirementStub);
    });

    test('continuePreviousAssessment', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ContinuePreviousAssessment,
            payload: {
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock
            .setup(tf => tf.fromDetailsView(event))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.continuePreviousAssessment(event);
    });

    test('startoverAllAssessments', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.StartOverAllAssessments,
            payload: {
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock
            .setup(tf => tf.fromDetailsView(event))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.startOverAllAssessments(event);
    });

    test('enableVisualHelper', () => {
        const requirement = 'fake-requirement-name';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[VisualizationType.HeadingsAssessment],
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EnableVisualHelper,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, requirement);
    });

    test('enableVisualHelper without scan', () => {
        const requirement = 'fake-requirement-name';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[VisualizationType.HeadingsAssessment],
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EnableVisualHelperWithoutScan,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, requirement, false);
    });

    test('enableVisualHelper, with scan, without telemetry', () => {
        const requirement = 'fake-requirement-name';

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EnableVisualHelper,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry: null,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => null)
            .verifiable(Times.never());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, requirement, true, false);
    });

    test('enableVisualHelper, without scan, without telemetry', () => {
        const requirement = 'fake-requirement-name';

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EnableVisualHelperWithoutScan,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry: null,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => null)
            .verifiable(Times.never());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, requirement, false, false);
    });

    test('disableVisualHelpersForTest', () => {
        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.DisableVisualHelperForTest,
            payload: {
                test: VisualizationType.HeadingsAssessment,
            },
        };
        setupPostMessage(expectedMessage);

        testSubject.disableVisualHelpersForTest(VisualizationType.HeadingsAssessment);
    });

    test('disableVisualHelper', () => {
        const test = -1;
        const requirement = 'requirement';
        const telemetry = {};

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.DisableVisualHelper,
            payload: {
                test: test,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forRequirementFromDetailsView(test, requirement))
            .returns(() => telemetry as RequirementActionTelemetryData);

        setupPostMessage(expectedMessage);

        testSubject.disableVisualHelper(test, requirement);
    });

    test('changeManualTestStatus', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedRequirement: 'requirement',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ChangeStatus,
            payload: {
                test: 1,
                requirement: 'requirement',
                status: 1,
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forRequirementFromDetailsView(1, 'requirement')).returns(() => telemetry);

        setupPostMessage(expectedMessage);

        testSubject.changeManualTestStatus(1, 1, 'requirement', 'selector');
    });

    test('undoManualTestStatusChange', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedRequirement: 'requirement',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.Undo,
            payload: {
                test: 1,
                requirement: 'requirement',
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forRequirementFromDetailsView(1, 'requirement')).returns(() => telemetry);

        setupPostMessage(expectedMessage);

        testSubject.undoManualTestStatusChange(1, 'requirement', 'selector');
    });

    test('changeManualTestrequirementStatus', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedRequirement: 'requirement',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ChangeRequirementStatus,
            payload: {
                test: 1,
                requirement: 'requirement',
                status: 1,
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forRequirementFromDetailsView(1, 'requirement')).returns(() => telemetry);
        setupPostMessage(expectedMessage);

        testSubject.changeManualRequirementStatus(1, 1, 'requirement');
    });

    test('undoRequirementStatusChange', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.UndoChangeRequirementStatus,
            payload: {
                test: 1,
                requirement: 'requirement',
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.undoManualRequirementStatusChange(1, 'requirement');
    });

    test('changeAssessmentVisualizationState', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ChangeVisualizationState,
            payload: {
                test: 1,
                requirement: 'requirement',
                isVisualizationEnabled: true,
                selector: 'selector',
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.changeAssessmentVisualizationState(true, 1, 'requirement', 'selector');
    });

    test('addFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedRequirement: 'requirement',
            selectedTest: 'test',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.AddFailureInstance,
            payload: {
                test: 1,
                requirement: 'requirement',
                description: 'description',
                telemetry: telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);

        testSubject.addFailureInstance('description', 1, 'requirement');
    });

    test('removeFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedRequirement: 'requirement',
            selectedTest: 'test',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.RemoveFailureInstance,
            payload: {
                test: 1,
                requirement: 'requirement',
                id: '1',
                telemetry: telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);

        testSubject.removeFailureInstance(1, 'requirement', '1');
    });

    test('editFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };
        const description = 'des';
        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EditFailureInstance,
            payload: {
                test: 1,
                requirement: 'requirement',
                id: '1',
                description: description,
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.editFailureInstance(description, 1, 'requirement', '1');
    });

    test('passUnmarkedInstances', () => {
        const test = VisualizationType.Headings;
        const requirement = 'missingHeadings';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.PassUnmarkedInstances,
            payload: {
                test: test,
                requirement: requirement,
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.passUnmarkedInstances(test, requirement);
    });

    test('changeAssessmentVisualizationStateForAll', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ChangeVisualizationStateForAll,
            payload: {
                test: 1,
                requirement: 'requirement',
                isVisualizationEnabled: true,
                selector: null,
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.changeAssessmentVisualizationStateForAll(true, 1, 'requirement');
    });

    test('exportResultsClicked', () => {
        const html = 'html content';
        const event = eventStubFactory.createMouseClickEvent() as any;

        const telemetry: ExportResultsTelemetryData = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
            exportResultsData: 12,
            exportResultsType: 'export result type',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Telemetry.Send,
            payload: {
                eventName: EXPORT_RESULTS,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forExportedHtml('Assessment', html, event, TelemetryEventSource.DetailsView))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);

        testSubject.exportResultsClicked('Assessment', html, event);

        setupPostMessage(expectedMessage);

        telemetryFactoryMock.verifyAll();
        postMessageMock.verifyAll();
    });

    test('copyIssueDetailsClicked', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;

        const telemetry: BaseTelemetryData = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: 'mouseclick',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Telemetry.Send,
            payload: {
                eventName: COPY_ISSUE_DETAILS,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.withTriggeredByAndSource(event, TelemetryEventSource.DetailsView))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);

        testSubject.copyIssueDetailsClicked(event);

        setupPostMessage(expectedMessage);

        telemetryFactoryMock.verifyAll();
        postMessageMock.verifyAll();
    });

    test('cancelStartOver', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const test = -1;
        const requirement = 'selected requirement';
        const telemetry: RequirementSelectTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: 'selected test',
            selectedRequirement: requirement,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.CancelStartOver,
            payload: {
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock.setup(tf => tf.forCancelStartOver(event, test, requirement)).returns(() => telemetry);

        testSubject.cancelStartOver(event, test, requirement);
    });

    test('cancelStartOverAssessment', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.CancelStartOverAllAssessments,
            payload: {
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.cancelStartOverAllAssessments(event);
        postMessageMock.verifyAll();
    });

    test('changeRightContentPanel', () => {
        const viewTypeStub = 'test view type' as DetailsViewRightContentPanelType;
        const expectedMessage = {
            tabId: tabId,
            type: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: viewTypeStub,
        };

        setupPostMessage(expectedMessage);
        testSubject.changeRightContentPanel(viewTypeStub);
        postMessageMock.verifyAll();
    });

    function setupPostMessage(expectedMessage): void {
        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable(Times.once());
    }

    function setupTelemetryFactory(methodName: keyof TelemetryDataFactory, telemetry: any, event?: any): void {
        const setupFunc = event ? tfm => tfm[methodName](event) : tfm => tfm[methodName]();
        telemetryFactoryMock
            .setup(setupFunc)
            .returns(() => telemetry)
            .verifiable(Times.once());
    }
});
