// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { HeadingsTestStep } from '../../../../../assessments/headings/test-steps/test-steps';
import { OnDetailsViewPivotSelected } from '../../../../../background/actions/action-payloads';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import {
    COPY_ISSUE_DETAILS,
    DetailsViewOpenTelemetryData,
    DetailsViewPivotSelectedTelemetryData,
    DETAILS_VIEW_OPEN,
    ExportResultsTelemetryData,
    EXPORT_RESULTS,
    FeatureFlagToggleTelemetryData,
    SourceAndTriggeredBy,
    TelemetryEventSource,
    TestStepActionTelemetryData,
    TestStepSelectTelemetryData,
    TriggeredByNotApplicable,
    TriggeredBy,
    AssessmentTelemetryData,
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
        const telemetryStub: SourceAndTriggeredBy = {
            triggeredBy: 'mouseclick',
            source: testSource,
        };
        const eventStub = {};
        const expectedMessage: IMessage = {
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
            detailsView: VisualizationType[view],
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

    test('selectTestStep', () => {
        const view = VisualizationType.Headings;
        const selectedStep = HeadingsTestStep.headingFunction;
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: TestStepSelectTelemetryData = {
            triggeredBy: 'keypress',
            selectedTest: VisualizationType[view],
            selectedStep: selectedStep,
            source: testSource,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.SelectTestStep,
            payload: {
                telemetry: telemetry,
                selectedStep: selectedStep,
                selectedTest: view,
            },
        };
        setupPostMessage(expectedMessage);

        telemetryFactoryMock
            .setup(tf => tf.forSelectTestStep(event, view, selectedStep))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.selectTestStep(event, HeadingsTestStep.headingFunction, view);
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
        const tabId = 1;
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

    test('startOverAssessment', () => {
        const stepStub = 'fake-step';
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
                step: stepStub,
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsView(VisualizationType.HeadingsAssessment, event))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.startOverAssessment(event, VisualizationType.HeadingsAssessment, stepStub);
    });

    test('continuePreviousAssessment', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: SourceAndTriggeredBy = {
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
        const telemetry: SourceAndTriggeredBy = {
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
        const step = 'fake-step-name';
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
                step,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, step);
    });

    test('enableVisualHelper without scan', () => {
        const step = 'fake-step-name';
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
                step,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, step, false);
    });

    test('enableVisualHelper, with scan, without telemetry', () => {
        const step = 'fake-step-name';

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EnableVisualHelper,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                step,
                telemetry: null,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => null)
            .verifiable(Times.never());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, step, true, false);
    });

    test('enableVisualHelper, without scan, without telemetry', () => {
        const step = 'fake-step-name';

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.EnableVisualHelperWithoutScan,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                step,
                telemetry: null,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forAssessmentActionFromDetailsViewNoTriggeredBy(VisualizationType.HeadingsAssessment))
            .returns(() => null)
            .verifiable(Times.never());
        setupPostMessage(expectedMessage);
        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, step, false, false);
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
        const step = 'step';
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
            .setup(tfm => tfm.forTestStepFromDetailsView(test, step))
            .returns(() => telemetry as TestStepActionTelemetryData);

        setupPostMessage(expectedMessage);

        testSubject.disableVisualHelper(test, step);
    });

    test('changeManualTestStatus', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedStep: 'step',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ChangeStatus,
            payload: {
                test: 1,
                step: 'step',
                status: 1,
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forTestStepFromDetailsView(1, 'step')).returns(() => telemetry);

        setupPostMessage(expectedMessage);

        testSubject.changeManualTestStatus(1, 1, 'step', 'selector');
    });

    test('undoManualTestStatusChange', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedStep: 'step',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.Undo,
            payload: {
                test: 1,
                step: 'step',
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forTestStepFromDetailsView(1, 'step')).returns(() => telemetry);

        setupPostMessage(expectedMessage);

        testSubject.undoManualTestStatusChange(1, 'step', 'selector');
    });

    test('changeManualTestStepStatus', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedStep: 'step',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.ChangeStepStatus,
            payload: {
                test: 1,
                step: 'step',
                status: 1,
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock.setup(tfm => tfm.forTestStepFromDetailsView(1, 'step')).returns(() => telemetry);
        setupPostMessage(expectedMessage);

        testSubject.changeManualTestStepStatus(1, 1, 'step');
    });

    test('undoStepStatusChange', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.UndoChangeStepStatus,
            payload: {
                test: 1,
                step: 'step',
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.undoManualTestStepStatusChange(1, 'step');
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
                step: 'step',
                isVisualizationEnabled: true,
                selector: 'selector',
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.changeAssessmentVisualizationState(true, 1, 'step', 'selector');
    });

    test('addFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedStep: 'step',
            selectedTest: 'test',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.AddFailureInstance,
            payload: {
                test: 1,
                step: 'step',
                description: 'description',
                telemetry: telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forTestStepFromDetailsView(1, 'step'))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);

        testSubject.addFailureInstance('description', 1, 'step');
    });

    test('removeFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedStep: 'step',
            selectedTest: 'test',
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.RemoveFailureInstance,
            payload: {
                test: 1,
                step: 'step',
                id: '1',
                telemetry: telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forTestStepFromDetailsView(1, 'step'))
            .returns(() => telemetry)
            .verifiable(Times.once());
        setupPostMessage(expectedMessage);

        testSubject.removeFailureInstance(1, 'step', '1');
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
                step: 'step',
                id: '1',
                description: description,
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.editFailureInstance(description, 1, 'step', '1');
    });

    test('passUnmarkedInstances', () => {
        const test = VisualizationType.Headings;
        const step = 'missingHeadings';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.PassUnmarkedInstances,
            payload: {
                test: test,
                step: step,
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.passUnmarkedInstances(test, step);
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
                step: 'step',
                isVisualizationEnabled: true,
                selector: null,
                telemetry: telemetry,
            },
        };
        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);
        setupPostMessage(expectedMessage);

        testSubject.changeAssessmentVisualizationStateForAll(true, 1, 'step');
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

        const telemetry: SourceAndTriggeredBy = {
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
            .setup(tf => tf.withSourceAndTriggeredBy(event, TelemetryEventSource.DetailsView))
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
        const step = 'selected step';
        const telemetry: TestStepSelectTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: 'selected test',
            selectedStep: step,
        };

        const expectedMessage = {
            tabId: tabId,
            type: Messages.Assessment.CancelStartOver,
            payload: {
                telemetry,
            },
        };

        setupPostMessage(expectedMessage);
        telemetryFactoryMock.setup(tf => tf.forCancelStartOver(event, test, step)).returns(() => telemetry);

        testSubject.cancelStartOver(event, test, step);
    });

    test('cancelStartOverAllAssessments', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: SourceAndTriggeredBy = {
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
