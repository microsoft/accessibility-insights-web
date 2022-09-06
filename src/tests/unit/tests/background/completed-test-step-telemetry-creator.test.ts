// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CompletedTestStepTelemetryCreator } from 'background/completed-test-step-telemetry-creator';
import { Interpreter } from 'background/interpreter';
import { AssessmentStore } from 'background/stores/assessment-store';
import { TabStore } from 'background/stores/tab-store';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import {
    CHANGE_OVERALL_REQUIREMENT_STATUS,
    RequirementStatusTelemetryData,
    TelemetryEventSource,
    TriggeredByNotApplicable,
} from '../../../../common/extension-telemetry-events';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import {
    AssessmentData,
    AssessmentStoreData,
} from '../../../../common/types/store-data/assessment-result-data';
import { TabStoreData } from '../../../../common/types/store-data/tab-store-data';
import { CreateTestAssessmentProvider } from '../../common/test-assessment-provider';

function testBeforeAfterAssessmentData(
    expectedTelemetry: RequirementStatusTelemetryData,
    expectedTimes: Times,
    before: AssessmentStoreData,
    after: AssessmentStoreData,
    requirementDetails?: any,
): void {
    const assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
    const assessmentProvider = CreateTestAssessmentProvider();
    const telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
    const interpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
    const testSubject = new CompletedTestStepTelemetryCreator(
        assessmentStoreMock.object,
        assessmentProvider,
        telemetryFactoryMock.object,
        interpreterMock.object,
    );

    const expectedMessage: Message = {
        messageType: Messages.Telemetry.Send,
        tabId: 1,
        payload: {
            eventName: CHANGE_OVERALL_REQUIREMENT_STATUS,
            telemetry: expectedTelemetry,
        },
    };

    interpreterMock.setup(m => m.interpret(It.isValue(expectedMessage))).verifiable(expectedTimes);

    telemetryFactoryMock
        .setup(m =>
            m.forRequirementStatus(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()),
        )
        .returns((viz, step, passed, instances, _) =>
            getMockTelemetryData(viz, step, passed, instances, requirementDetails),
        )
        .verifiable(Times.atLeastOnce());

    let callback;
    assessmentStoreMock
        .setup(store => store.addChangedListener(It.is(param => param instanceof Function)))
        .callback(listenerCallback => {
            callback = listenerCallback;
        })
        .verifiable(Times.atLeastOnce());
    assessmentStoreMock
        .setup(m => m.getState())
        .returns(() => before)
        .verifiable(Times.atLeastOnce());

    testSubject.initialize();
    callback();

    assessmentStoreMock.reset();
    assessmentStoreMock
        .setup(m => m.getState())
        .returns(() => after)
        .verifiable(Times.atLeastOnce());

    callback();

    assessmentStoreMock.verifyAll();
    interpreterMock.verifyAll();
}

describe('CompletedTestStepTelemetryCreatorTest', () => {
    test('constructor', () => {
        expect(new CompletedTestStepTelemetryCreator(null, null, null, null)).toBeDefined();
    });

    test('initialize: onAssessmentChange, telemetry sent because one test step switches to PASS', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', true, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.once(), before, after);
    });

    test('initialize: onAssessmentChange, no telemetry sent because tabId is null', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;
        after.persistedTabInfo = null;

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', true, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.never(), before, after);
    });

    test('initialize: onAssessmentChange, telemetry sent because one manual test step switches to FAIL with failure instance', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-2'].stepFinalResult =
            ManualTestStatus.FAIL;

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-2', false, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.once(), before, after);
    });

    test('initialize: onAssessmentChange, no telemetry sent because one test step switches from PASS to UNKNOWN', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        before.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;
        const after = getMockAssessmentStoreDataUnknowns();

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', true, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.never(), before, after);
    });

    test('initialize: onAssessmentChange, telemetry sent because one test step switches from UNKNOWN to FAIL', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.FAIL;

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', false, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.once(), before, after);
    });

    test('initialize: onAssessmentChange, no telemetry sent because one test step switches from FAIL to UNKNOWN', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        before.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.FAIL;
        const after = getMockAssessmentStoreDataUnknowns();

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', false, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.never(), before, after);
    });

    test('initialize: onAssessmentChange, no telemetry sent because one test step remains PASS and PASS', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        before.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', true, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.never(), before, after);
    });

    test('initialize: onAssessmentChange, single telemetry sent because two test steps switch from UNKNOWN to PASS', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-2'].stepFinalResult =
            ManualTestStatus.PASS;

        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', true, 1);
        testBeforeAfterAssessmentData(expectedTelemetry, Times.once(), before, after);
    });

    test('initialize: onAssessmentChange, requirementDetails are sent when specified in step', () => {
        const before = getMockAssessmentStoreDataUnknowns();
        const after = getMockAssessmentStoreDataUnknowns();
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;
        after.assessments['assessment-1'].testStepStatus['assessment-1-step-2'].stepFinalResult =
            ManualTestStatus.PASS;

        const requirementDetails = {
            skyColor: 'blue',
            cloudCount: 2,
        };
        const expectedTelemetry = getMockTelemetryData(
            -1,
            'assessment-1-step-1',
            true,
            1,
            requirementDetails,
        );
        testBeforeAfterAssessmentData(
            expectedTelemetry,
            Times.once(),
            before,
            after,
            requirementDetails,
        );
    });

    test('initialize: onAssessmentChange, no telemetry sent because all test steps have UNKNOWN status', () => {
        const assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
        const assessmentProvider = CreateTestAssessmentProvider();
        const telemetryFactory = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        const interpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        const testSubject = new CompletedTestStepTelemetryCreator(
            assessmentStoreMock.object,
            assessmentProvider,
            telemetryFactory.object,
            interpreterMock.object,
        );

        assessmentStoreMock
            .setup(tsm => tsm.getState())
            .returns(() => getMockAssessmentStoreDataUnknowns())
            .verifiable(Times.atLeastOnce());

        let callback;
        assessmentStoreMock
            .setup(store => store.addChangedListener(It.is(param => param instanceof Function)))
            .callback(listenerCallback => {
                callback = listenerCallback;
            })
            .verifiable(Times.atLeastOnce());

        const expectedMessage: Message = {
            messageType: Messages.Telemetry.Send,
        };
        interpreterMock
            .setup(im => im.interpret(It.isValue(expectedMessage)))
            .verifiable(Times.never());

        testSubject.initialize();
        callback();

        assessmentStoreMock.verifyAll();
        interpreterMock.verifyAll();
    });

    test('initialize: onAssessmentChange, telemetry sent when manipulating state initially received/verify deep cloning property', () => {
        let callback;
        const assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
        const assessmentProvider = CreateTestAssessmentProvider();
        const telemetryFactoryMock = Mock.ofType(TelemetryDataFactory, MockBehavior.Strict);
        const tabStoreMock = Mock.ofType(TabStore, MockBehavior.Strict);
        const interpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);
        const data = getMockAssessmentStoreDataUnknowns();
        const expectedTelemetry = getMockTelemetryData(-1, 'assessment-1-step-1', true, 1);
        const expectedMessage: Message = {
            messageType: Messages.Telemetry.Send,
            tabId: 1,
            payload: {
                eventName: CHANGE_OVERALL_REQUIREMENT_STATUS,
                telemetry: expectedTelemetry,
            },
        };
        const tabStoreData: TabStoreData = {
            title: 'DetailsViewContainerTest title',
            url: 'http://detailsViewContainerTest/url/',
            id: 1,
            isClosed: false,
            isChanged: false,
            isPageHidden: false,
            isOriginChanged: false,
        };
        const testSubject = new CompletedTestStepTelemetryCreator(
            assessmentStoreMock.object,
            assessmentProvider,
            telemetryFactoryMock.object,
            interpreterMock.object,
        );

        tabStoreMock.setup(m => m.getState()).returns(() => tabStoreData);

        telemetryFactoryMock
            .setup(m =>
                m.forRequirementStatus(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()),
            )
            .returns((viz, step, passed, instances, requirementDetails) =>
                getMockTelemetryData(viz, step, passed, instances, requirementDetails),
            )
            .verifiable();

        assessmentStoreMock
            .setup(store => store.addChangedListener(It.is(param => param instanceof Function)))
            .callback(listenerCallback => {
                callback = listenerCallback;
            })
            .verifiable(Times.atLeastOnce());

        assessmentStoreMock
            .setup(tsm => tsm.getState())
            .returns(() => data)
            .verifiable(Times.atLeastOnce());

        interpreterMock
            .setup(im => im.interpret(It.isValue(expectedMessage)))
            .verifiable(Times.once());

        testSubject.initialize();
        data.assessments['assessment-1'].testStepStatus['assessment-1-step-1'].stepFinalResult =
            ManualTestStatus.PASS;
        callback();

        assessmentStoreMock.verifyAll();
        interpreterMock.verifyAll();
    });
});

function getMockTelemetryData(
    test: number,
    requirement: string,
    passed: boolean,
    instances: number,
    requirementDetails?: any,
): RequirementStatusTelemetryData {
    const telemetry = {
        selectedRequirement: requirement,
        selectedTest: test.toString(),
        passed: passed,
        numInstances: instances,
        source: TelemetryEventSource.DetailsView,
        triggeredBy: TriggeredByNotApplicable,
    };

    if (requirementDetails) {
        telemetry['requirementDetails'] = requirementDetails;
    }

    return telemetry;
}

function getMockAssessmentStoreDataUnknowns(): AssessmentStoreData {
    const assessments: { [key: string]: AssessmentData } = {
        'assessment-1': {
            fullAxeResultsMap: null,
            testStepStatus: {
                'assessment-1-step-1': {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: false,
                },
                'assessment-1-step-2': {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: false,
                },
                'assessment-1-step-3': {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: false,
                },
            },
            generatedAssessmentInstancesMap: {
                h1: {
                    testStepResults: {
                        'assessment-1-step-1': {
                            id: 'id',
                            status: ManualTestStatus.UNKNOWN,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                            isVisible: true,
                        },
                        'assessment-1-step-3': {
                            id: 'id',
                            status: ManualTestStatus.UNKNOWN,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                            isVisible: true,
                        },
                    },
                    target: [],
                    html: '',
                },
            },
            manualTestStepResultMap: {
                'assessment-1-step-2': {
                    instances: [
                        {
                            id: '',
                            description: '',
                        },
                    ],
                    status: ManualTestStatus.UNKNOWN,
                    id: '',
                },
            },
        },
        'assessment-2': {
            fullAxeResultsMap: null,
            testStepStatus: {
                'assessment-2-step-1': {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: false,
                },
                'assessment-2-step-2': {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: false,
                },
            },
            generatedAssessmentInstancesMap: {
                h1: {
                    testStepResults: {
                        'assessment-2-step-1': {
                            id: 'id',
                            status: ManualTestStatus.UNKNOWN,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                            isVisible: true,
                        },
                        'assessment-2-step-2': {
                            id: 'id',
                            status: ManualTestStatus.UNKNOWN,
                            isCapturedByUser: false,
                            failureSummary: '',
                            isVisualizationEnabled: true,
                            isVisible: true,
                        },
                    },
                    target: [],
                    html: '',
                },
            },
            manualTestStepResultMap: {},
        },
    };
    const assessmentStoreMockData = {
        assessments,
        assessmentNavState: null,
        persistedTabInfo: {
            id: 1,
            url: 'url',
            title: 'title',
        },
    } as AssessmentStoreData;
    return assessmentStoreMockData;
}
