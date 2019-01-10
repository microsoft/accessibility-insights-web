// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseActionPayload } from '../../../../../background/actions/action-payloads';
import { AssessmentActionCreator } from '../../../../../background/actions/assessment-action-creator';
import { AssessmentActions } from '../../../../../background/actions/assessment-actions';
import { ChromeAdapter } from '../../../../../background/browser-adapter';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { Action } from '../../../../../common/flux/action';
import { Messages } from '../../../../../common/messages';
import * as TelemetryEvents from '../../../../../common/telemetry-events';

describe('AssessmentActionCreatorTest', () => {
    let registerTypeToPayloadCallbackMock: IMock<IRegisterTypeToPayloadCallback>;
    let assessmentActionsMock: IMock<AssessmentActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    const tabId = -1;
    let testObject: AssessmentActionCreator;
    const AssessmentMessages = Messages.Assessment;

    beforeEach(() => {
        assessmentActionsMock = Mock.ofType(AssessmentActions, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((type, callback) => { });

        testObject = new AssessmentActionCreator(
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
            registerTypeToPayloadCallbackMock.object,
        );
    });

    afterEach(() => {
        telemetryEventHandlerMock.verifyAll();
    });

    test('onPassUnmarkedInstances', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.PASS_UNMARKED_INSTANCES, payload, tabId))
            .verifiable(Times.once());

        const updateTabIdActionMock = createActionMock(tabId);
        const passUnmarkedInstanceActionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('passUnmarkedInstance', passUnmarkedInstanceActionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.PassUnmarkedInstances, payload, tabId);

        testObject.registerCallbacks();

        updateTabIdActionMock.verifyAll();
        passUnmarkedInstanceActionMock.verifyAll();
    });

    test('onContinuePreviousAssessment', () => {
        const payload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CONTINUE_PREVIOUS_ASSESSMENT, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(tabId);
        setupAssessmentActionsMock('continuePreviousAssessment', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ContinuePreviousAssessment, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onEditFailureInstance', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.EDIT_FAILURE_INSTANCE, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('editFailureInstance', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.EditFailureInstance, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onRemoveFailureInstance', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.REMOVE_FAILURE_INSTANCE, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('removeFailureInstance', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.RemoveFailureInstance, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onRemoveFailureInstance', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.ADD_FAILURE_INSTANCE, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('addFailureInstance', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.AddFailureInstance, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onChangeManualTestStepStatus', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload, tabId))
            .verifiable(Times.once());

        const updateTabIdActionMock = createActionMock(tabId);
        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeStepStatus', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeStepStatus, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
        updateTabIdActionMock.verifyAll();
    });

    test('onUndoChangeManualTestStepStatus', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.UNDO_ASSESSMENT_STEP_STATUS_CHANGE, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('undoStepStatusChange', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.UndoChangeStepStatus, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onUndoAssessmentInstanceStatusChange', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.UNDO_ASSESSMENT_STATUS_CHANGE, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('undoInstanceStatusChange', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.Undo, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onChangeAssessmentInstanceStatus', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload, tabId))
            .verifiable(Times.once());

        const updateTabIdActionMock = createActionMock(tabId);
        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeInstanceStatus', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeStatus, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
        updateTabIdActionMock.verifyAll();
    });

    test('onChangeAssessmentVisualizationState', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('changeAssessmentVisualizationState', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeVisualizationState, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onChangeVisualizationStateForAll', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('changeAssessmentVisualizationStateForAll', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeVisualizationStateForAll, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onStartOverAssessment', () => {
        const payload: BaseActionPayload = {};

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('resetData', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.StartOver, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onStartOverAllAssessments', () => {
        const payload: BaseActionPayload = {};

        const actionMock = createActionMock(tabId);
        setupAssessmentActionsMock('resetAllAssessmentsData', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.StartOverAllAssessments, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onAssessmentScanCompleted', () => {
        const payload: BaseActionPayload = {};
        const updateTabIdActionMock = createActionMock(tabId);
        const actionMock = createActionMock(payload);

        setupAssessmentActionsMock('scanCompleted', actionMock);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.AssessmentScanCompleted, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onGetAssessmentCurrentState', () => {
        const actionMock = createActionMock(null);
        setupAssessmentActionsMock('getCurrentState', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.GetCurrentState, null, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onSelectTestStep', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.SELECT_TEST_STEP, payload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('selectTestStep', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.SelectTestStep, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onScanUpdate', () => {
        const payload = {
            key: {
                toTitleCase: () => 'Hello',
            },
        };

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry('ScanUpdateHello', payload as BaseActionPayload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('scanUpdate', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ScanUpdate, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onTrackingCompleted', () => {
        const payload = {
            key: {
                toTitleCase: () => 'Hello',
            },
        };

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry('TrackingCompletedHello', payload as BaseActionPayload, tabId))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('trackingCompleted', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.TrackingCompleted, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onPivotChildSelected', () => {
        const payload: BaseActionPayload = {};
        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateSelectedPivotChild', actionMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.Visualizations.DetailsView.Select, payload, tabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    function createActionMock<T>(actionPayload: T): IMock<Action<T>> {
        const actionMock = Mock.ofType<Action<T>>(Action);
        actionMock
            .setup(action => action.invoke(actionPayload))
            .verifiable(Times.once());

        return actionMock;
    }

    function setupAssessmentActionsMock(actionName: keyof AssessmentActions, actionMock: IMock<Action<any>>) {
        assessmentActionsMock
            .setup(actions => actions[actionName])
            .returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, actionPayload: any, tabId: number) {
        registerTypeToPayloadCallbackMock
            .setup(regitrar => regitrar(message, It.is(param => _.isFunction(param))))
            .callback((message, handler) => handler(actionPayload, tabId));
    }
});
