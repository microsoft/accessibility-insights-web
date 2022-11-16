// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingsTestStep } from 'assessments/headings/test-steps/test-steps';
import { LoadAssessmentPayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { SharedAssessmentActionMessageCreator } from 'DetailsView/actions/shared-assessment-action-message-creator';
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
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('SharedAssessmentActionMessageCreatorTest', () => {
    const eventStubFactory = new EventStubFactory();
    const testSource: TelemetryEventSource = -1 as TelemetryEventSource;
    const messageType: string = 'test-message-type';
    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: SharedAssessmentActionMessageCreator;

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        telemetryFactoryMock = Mock.ofType(TelemetryDataFactory);
        testSubject = new SharedAssessmentActionMessageCreator(
            telemetryFactoryMock.object,
            dispatcherMock.object,
        );
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
            messageType,
            payload: {
                telemetry: telemetry,
                selectedTestSubview: selectedRequirement,
                selectedTest: view,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectRequirement(event, view, selectedRequirement))
            .returns(() => telemetry);

        testSubject.selectRequirement(event, HeadingsTestStep.headingFunction, view, messageType);

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
            messageType,
            payload: {
                telemetry: telemetry,
                selectedTestSubview: selectedRequirement,
                selectedTest: view,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectRequirement(event, view, selectedRequirement))
            .returns(() => telemetry);

        testSubject.selectNextRequirement(
            event,
            HeadingsTestStep.headingFunction,
            view,
            messageType,
        );

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
            messageType,
            payload: {
                telemetry: telemetry,
                selectedTest: view,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forSelectGettingStarted(event, view))
            .returns(() => telemetry);

        testSubject.selectGettingStarted(event, view, messageType);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('expandTestNav', () => {
        const view = VisualizationType.Headings;

        const expectedMessage = {
            messageType,
            payload: {
                selectedTest: view,
            },
        };

        testSubject.expandTestNav(view, messageType);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('collapseTestNav', () => {
        const expectedMessage = {
            messageType,
        };

        testSubject.collapseTestNav(messageType);

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
            messageType,
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

        testSubject.startOverTest(event, VisualizationType.HeadingsAssessment, messageType);

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
            messageType,
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

        testSubject.enableVisualHelper(
            VisualizationType.HeadingsAssessment,
            requirement,
            true,
            messageType,
        );

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('enableVisualHelper, without telemetry', () => {
        const requirement = 'fake-requirement-name';

        const expectedMessage = {
            messageType,
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
            messageType,
        );

        telemetryFactoryMock.verifyAll();
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('disableVisualHelpersForTest', () => {
        const expectedMessage = {
            messageType,
            payload: {
                test: VisualizationType.HeadingsAssessment,
            },
        };

        testSubject.disableVisualHelpersForTest(VisualizationType.HeadingsAssessment, messageType);

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
            messageType,
            payload: {
                test: test,
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tfm => tfm.forRequirementFromDetailsView(test, requirement))
            .returns(() => telemetry as RequirementActionTelemetryData);

        testSubject.disableVisualHelper(test, requirement, messageType);

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
            messageType,
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

        testSubject.changeManualTestStatus(1, 1, 'requirement', 'selector', messageType);

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
            messageType,
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

        testSubject.changeManualRequirementStatus(1, 1, 'requirement', messageType);

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
            messageType,
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

        testSubject.undoManualTestStatusChange(1, 'requirement', 'selector', messageType);

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
            messageType,
            payload: {
                test: 1,
                requirement: 'requirement',
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.undoManualRequirementStatusChange(1, 'requirement', messageType);

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
            messageType,
            payload: {
                test: 1,
                requirement: 'requirement',
                isVisualizationEnabled: true,
                selector: 'selector',
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.changeAssessmentVisualizationState(
            true,
            1,
            'requirement',
            'selector',
            messageType,
        );

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessage)),
            Times.once(),
        );
    });

    test('addResultDescription', () => {
        const persistedDescription = 'persisted description';
        const expectedMessage = {
            messageType,
            payload: {
                description: persistedDescription,
            },
        };

        testSubject.addResultDescription(persistedDescription, messageType);

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
            messageType,
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

        testSubject.addFailureInstance(instanceData, 1, 'requirement', messageType);

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
            messageType,
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

        testSubject.removeFailureInstance(1, 'requirement', '1', messageType);

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
            messageType,
            payload: {
                test: 1,
                requirement: 'requirement',
                id: '1',
                instanceData: instanceData,
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.editFailureInstance(instanceData, 1, 'requirement', '1', messageType);

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
            messageType,
            payload: {
                test: test,
                requirement: requirement,
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.passUnmarkedInstances(test, requirement, messageType);

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
            messageType,
            payload: {
                test: 1,
                requirement: 'requirement',
                isVisualizationEnabled: true,
                telemetry: telemetry,
            },
        };

        setupTelemetryFactory('fromDetailsViewNoTriggeredBy', telemetry);

        testSubject.changeAssessmentVisualizationStateForAll(true, 1, 'requirement', messageType);

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
            messageType,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.continuePreviousAssessment(event, messageType);

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
            messageType,
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

        testSubject.loadAssessment(assessmentData, tabId, 'testId', messageType);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessageToLoadAssessment)),
            Times.once(),
        );
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(expectedMessageToGoToOverview)),
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
            messageType,
            payload: {
                telemetry,
            },
        };
        const expectedMessageToSetDetailsViewRightContentPanel = {
            messageType: Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload: 'Overview',
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.startOverAllAssessments(event, messageType);

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
            messageType,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock
            .setup(tf => tf.forCancelStartOver(event, test, requirement))
            .returns(() => telemetry);

        testSubject.cancelStartOver(event, test, requirement, messageType);

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
            messageType,
            payload: {
                telemetry,
            },
        };

        telemetryFactoryMock.setup(tf => tf.fromDetailsView(event)).returns(() => telemetry);

        testSubject.cancelStartOverAllAssessments(event, messageType);

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
