// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { LoadAssessmentPayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { keys } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    AssessmentTelemetryData,
    BaseTelemetryData,
    RequirementActionTelemetryData,
    RequirementSelectTelemetryData,
    SelectGettingStartedTelemetryData,
    TelemetryEventSource,
    TriggeredByNotApplicable,
} from '../../../../../common/extension-telemetry-events';
import { AssessmentMessages, Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('AssessmentActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: AssessmentActionMessageCreator;
    const assessmentMessageStubs = getMessageStubs();

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        testSubject = new AssessmentActionMessageCreator(
            telemetryFactoryMock.object,
            dispatcherMock.object,
            assessmentMessageStubs,
        );
    });

    function getMessageStubs(): AssessmentMessages {
        const messagesMock = Mock.ofType<AssessmentMessages>();
        const messagesStub = {} as AssessmentMessages;
        keys(messagesMock.object).forEach(messageType => {
            messagesStub[messageType] = `stub for ${messageType}`;
        });
        return messagesStub;
    }

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
            messageType: assessmentMessageStubs.SelectTestRequirement,
            payload: {
                telemetry: telemetry,
                selectedTestSubview: selectedRequirement,
                selectedTest: view,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectRequirement(event, view, selectedRequirement))
            .returns(() => telemetry);

        testSubject.selectRequirement(event, HeadingsTestStep.headingFunction, view);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('selectNextRequirement', () => {
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
            messageType: assessmentMessageStubs.SelectNextRequirement,
            payload: {
                telemetry: telemetry,
                selectedTestSubview: selectedRequirement,
                selectedTest: view,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectRequirement(event, view, selectedRequirement))
            .returns(() => telemetry);

        testSubject.selectNextRequirement(event, HeadingsTestStep.headingFunction, view);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('selectGettingStarted', () => {
        const view = VisualizationType.Headings;
        const event = eventStubFactory.createKeypressEvent() as any;
        const telemetry: SelectGettingStartedTelemetryData = {
            triggeredBy: 'keypress',
            selectedTest: VisualizationType[view],
            source: testSource,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.SelectGettingStarted,
            payload: {
                telemetry: telemetry,
                selectedTest: view,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectGettingStarted(event, view))
            .returns(() => telemetry);

        testSubject.selectGettingStarted(event, view);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('expandTestNav', () => {
        const view = VisualizationType.Headings;

        const expectedMessage = {
            messageType: assessmentMessageStubs.ExpandTestNav,
            payload: {
                selectedTest: view,
            },
        };

        testSubject.expandTestNav(view);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('collapseTestNav', () => {
        const expectedMessage = {
            messageType: assessmentMessageStubs.CollapseTestNav,
        };

        testSubject.collapseTestNav();

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('startOverTest', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: AssessmentTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
            selectedTest: VisualizationType[VisualizationType.HeadingsAssessment],
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.StartOverTest,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf =>
                tf.forAssessmentActionFromDetailsView(VisualizationType.HeadingsAssessment, event),
            )
            .returns(() => telemetry);

        testSubject.startOverTest(event, VisualizationType.HeadingsAssessment);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('startOverTestWithoutTelemetry', () => {
        const expectedMessage = {
            messageType: assessmentMessageStubs.StartOverTest,
            payload: {
                test: VisualizationType.HeadingsAssessment,
            },
        };

        testSubject.startOverTestWithoutTelemetry(VisualizationType.HeadingsAssessment);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('enableVisualHelper', () => {
        const requirement = 'fake-requirement-name';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[VisualizationType.HeadingsAssessment],
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.EnableVisualHelper,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf =>
                tf.forAssessmentActionFromDetailsViewNoTriggeredBy(
                    VisualizationType.HeadingsAssessment,
                ),
            )
            .returns(() => telemetry);

        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, requirement);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('enableVisualHelper without scan', () => {
        const requirement = 'fake-requirement-name';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[VisualizationType.HeadingsAssessment],
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.EnableVisualHelperWithoutScan,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf =>
                tf.forAssessmentActionFromDetailsViewNoTriggeredBy(
                    VisualizationType.HeadingsAssessment,
                ),
            )
            .returns(() => telemetry);

        testSubject.enableVisualHelper(VisualizationType.HeadingsAssessment, requirement, false);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('enableVisualHelper, with scan, without telemetry', () => {
        const requirement = 'fake-requirement-name';

        const expectedMessage = {
            messageType: assessmentMessageStubs.EnableVisualHelper,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry: undefined,
            },
        };

        telemetryFactoryMock
            .setup(tf =>
                tf.forAssessmentActionFromDetailsViewNoTriggeredBy(
                    VisualizationType.HeadingsAssessment,
                ),
            )
            .verifiable(Times.never());

        testSubject.enableVisualHelper(
            VisualizationType.HeadingsAssessment,
            requirement,
            true,
            false,
        );

        telemetryFactoryMock.verifyAll();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('enableVisualHelper, without scan, without telemetry', () => {
        const requirement = 'fake-requirement-name';

        const expectedMessage = {
            messageType: assessmentMessageStubs.EnableVisualHelperWithoutScan,
            payload: {
                test: VisualizationType.HeadingsAssessment,
                requirement,
                telemetry: undefined,
            },
        };

        telemetryFactoryMock
            .setup(tf =>
                tf.forAssessmentActionFromDetailsViewNoTriggeredBy(
                    VisualizationType.HeadingsAssessment,
                ),
            )
            .verifiable(Times.never());

        testSubject.enableVisualHelper(
            VisualizationType.HeadingsAssessment,
            requirement,
            false,
            false,
        );

        telemetryFactoryMock.verifyAll();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('disableVisualHelpersForTest', () => {
        const expectedMessage = {
            messageType: assessmentMessageStubs.DisableVisualHelperForTest,
            payload: {
                test: VisualizationType.HeadingsAssessment,
            },
        };

        testSubject.disableVisualHelpersForTest(VisualizationType.HeadingsAssessment);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('disableVisualHelper', () => {
        const test = -1;
        const requirement = 'requirement';
        const telemetry = {};

        const expectedMessage = {
            messageType: assessmentMessageStubs.DisableVisualHelper,
            payload: {
                test: test,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forRequirementFromDetailsView(test, requirement))
            .returns(() => telemetry as RequirementActionTelemetryData);

        testSubject.disableVisualHelper(test, requirement);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('changeManualTestStatus', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedRequirement: 'requirement',
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.ChangeStatus,
            payload: {
                test: 1,
                requirement: 'requirement',
                status: 1,
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry);

        testSubject.changeManualTestStatus(1, 1, 'requirement', 'selector');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('changeManualTestRequirementStatus', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedRequirement: 'requirement',
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.ChangeRequirementStatus,
            payload: {
                test: 1,
                requirement: 'requirement',
                status: 1,
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry);

        testSubject.changeManualRequirementStatus(1, 1, 'requirement');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('undoManualTestStatusChange', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedTest: VisualizationType[1],
            selectedRequirement: 'requirement',
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.Undo,
            payload: {
                test: 1,
                requirement: 'requirement',
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry);

        testSubject.undoManualTestStatusChange(1, 'requirement', 'selector');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('undoManualRequirementStatusChange', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.UndoChangeRequirementStatus,
            payload: {
                test: 1,
                requirement: 'requirement',
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.undoManualRequirementStatusChange(1, 'requirement');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('changeAssessmentVisualizationState', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.ChangeVisualizationState,
            payload: {
                test: 1,
                requirement: 'requirement',
                isVisualizationEnabled: true,
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.changeAssessmentVisualizationState(true, 1, 'requirement', 'selector');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('addResultDescription', () => {
        const persistedDescription = 'persisted description';
        const expectedMessage = {
            messageType: assessmentMessageStubs.AddResultDescription,
            payload: {
                description: persistedDescription,
            },
        };

        testSubject.addResultDescription(persistedDescription);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('addFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedRequirement: 'requirement',
            selectedTest: 'test',
        };

        const instanceData = {
            failureDescription: 'description',
            path: 'path',
            snippet: 'snippet',
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.AddFailureInstance,
            payload: {
                test: 1,
                requirement: 'requirement',
                instanceData: instanceData,
                telemetry: telemetry,
            },
        };
        telemetryFactoryMock
            .setup(tf => tf.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry);

        testSubject.addFailureInstance(instanceData, 1, 'requirement');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('removeFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
            selectedRequirement: 'requirement',
            selectedTest: 'test',
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.RemoveFailureInstance,
            payload: {
                test: 1,
                requirement: 'requirement',
                id: '1',
                telemetry: telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forRequirementFromDetailsView(1, 'requirement'))
            .returns(() => telemetry);

        testSubject.removeFailureInstance(1, 'requirement', '1');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('editFailureInstance', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const instanceData = {
            failureDescription: 'des',
            path: 'path',
            snippet: 'snippet',
        };
        const expectedMessage = {
            messageType: assessmentMessageStubs.EditFailureInstance,
            payload: {
                test: 1,
                requirement: 'requirement',
                id: '1',
                instanceData: instanceData,
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.editFailureInstance(instanceData, 1, 'requirement', '1');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('passUnmarkedInstances', () => {
        const test = VisualizationType.Headings;
        const requirement = 'missingHeadings';
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.PassUnmarkedInstances,
            payload: {
                test: test,
                requirement: requirement,
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.passUnmarkedInstances(test, requirement);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('changeAssessmentVisualizationStateForAll', () => {
        const telemetry = {
            source: TelemetryEventSource.DetailsView,
            triggeredBy: TriggeredByNotApplicable,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.ChangeVisualizationStateForAll,
            payload: {
                test: 1,
                requirement: 'requirement',
                isVisualizationEnabled: true,
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.changeAssessmentVisualizationStateForAll(true, 1, 'requirement');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('continuePreviousAssessment', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.ContinuePreviousAssessment,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.continuePreviousAssessment(event);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('loadAssessment', () => {
        const assessmentData: VersionedAssessmentData = {
            version: 2,
            assessmentData: {} as AssessmentStoreData,
        };
        const tabId = -1;
        const telemetry: BaseTelemetryData = {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessageToLoadAssessment = {
            messageType: assessmentMessageStubs.LoadAssessment,
            payload: {
                tabId,
                versionedAssessmentData: {
                    version: 2,
                    assessmentData: {} as AssessmentStoreData,
                },
                telemetry,
                detailsViewId: 'testId',
            } as LoadAssessmentPayload,
        };
        const expectedMessageToGoToOverview = {
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: 'Overview',
        };

        telemetryFactoryMock
            .setup(tf => tf.fromDetailsViewNoTriggeredBy())
            .returns(() => telemetry);

        testSubject.loadAssessment(assessmentData, tabId, 'testId');

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessageToLoadAssessment)),
            Times.once(),
        );
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessageToGoToOverview)),
            Times.once(),
        );
    });

    test('saveAssessment', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessageToSaveAssessment = {
            messageType: assessmentMessageStubs.SaveAssessment,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.saveAssessment(event);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessageToSaveAssessment)),
            Times.once(),
        );
    });

    test('startOverAllAssessments', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessageToStartOverAllAssessments = {
            messageType: assessmentMessageStubs.StartOverAllAssessments,
            payload: {
                telemetry,
            },
        };
        const expectedMessageToSetDetailsViewRightContentPanel = {
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: 'Overview',
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.startOverAllAssessments(event);

        dispatcherMock.verify(
            dispatcher =>
                dispatcher.dispatchMessage(It.isValue(expectedMessageToStartOverAllAssessments)),
            Times.once(),
        );
        dispatcherMock.verify(
            dispatcher =>
                dispatcher.dispatchMessage(
                    It.isValue(expectedMessageToSetDetailsViewRightContentPanel),
                ),
            Times.once(),
        );
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
            messageType: assessmentMessageStubs.CancelStartOver,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forCancelStartOver(event, test, requirement))
            .returns(() => telemetry);

        testSubject.cancelStartOver(event, test, requirement);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('cancelStartOverAssessment', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const telemetry: BaseTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.DetailsView,
        };

        const expectedMessage = {
            messageType: assessmentMessageStubs.CancelStartOverAllAssessments,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.cancelStartOverAllAssessments(event);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    function setupTelemetryFactory(
        methodName: keyof TelemetryDataFactory,
        telemetry: any,
        event?: any,
    ): void {
        const setupFunc = event ? tfm => tfm[methodName](event) : tfm => tfm[methodName]();
        telemetryFactoryMock.setup(setupFunc).returns(() => telemetry);
    }
});
