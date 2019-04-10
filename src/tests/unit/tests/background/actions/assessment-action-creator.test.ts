// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BaseActionPayload, ToggleActionPayload } from '../../../../../background/actions/action-payloads';
import { AssessmentActionCreator } from '../../../../../background/actions/assessment-action-creator';
import { AssessmentActions } from '../../../../../background/actions/assessment-actions';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import * as TelemetryEvents from '../../../../../common/telemetry-events';
import { VisualizationType } from '../../../../../common/types/visualization-type';

describe('AssessmentActionCreatorTest', () => {
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;
    let assessmentActionsMock: IMock<AssessmentActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    const testTabId = -1;
    let testObject: AssessmentActionCreator;
    const AssessmentMessages = Messages.Assessment;

    beforeEach(() => {
        assessmentActionsMock = Mock.ofType(AssessmentActions, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((theType, callback) => {});

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
            .setup(tp => tp.publishTelemetry(TelemetryEvents.PASS_UNMARKED_INSTANCES, payload))
            .verifiable(Times.once());

        const updateTabIdActionMock = createActionMock(testTabId);
        const passUnmarkedInstanceActionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('passUnmarkedInstance', passUnmarkedInstanceActionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.PassUnmarkedInstances, payload, testTabId);

        testObject.registerCallbacks();

        updateTabIdActionMock.verifyAll();
        passUnmarkedInstanceActionMock.verifyAll();
    });

    test('onContinuePreviousAssessment', () => {
        const payload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CONTINUE_PREVIOUS_ASSESSMENT, payload))
            .verifiable(Times.once());

        const actionMock = createActionMock(testTabId);
        setupAssessmentActionsMock('continuePreviousAssessment', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ContinuePreviousAssessment, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onEditFailureInstance', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock.setup(tp => tp.publishTelemetry(TelemetryEvents.EDIT_FAILURE_INSTANCE, payload)).verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('editFailureInstance', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.EditFailureInstance, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onRemoveFailureInstance', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.REMOVE_FAILURE_INSTANCE, payload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('removeFailureInstance', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.RemoveFailureInstance, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onRemoveFailureInstance', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock.setup(tp => tp.publishTelemetry(TelemetryEvents.ADD_FAILURE_INSTANCE, payload)).verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('addFailureInstance', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.AddFailureInstance, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onChangeManualRequirementStatus', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload))
            .verifiable(Times.once());

        const updateTabIdActionMock = createActionMock(testTabId);
        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeRequirementStatus', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeRequirementStatus, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
        updateTabIdActionMock.verifyAll();
    });

    test('onUndoChangeManualRequirementStatus', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.UNDO_REQUIREMENT_STATUS_CHANGE, payload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('undoRequirementStatusChange', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.UndoChangeRequirementStatus, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onUndoAssessmentInstanceStatusChange', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.UNDO_TEST_STATUS_CHANGE, payload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('undoInstanceStatusChange', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.Undo, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onChangeAssessmentInstanceStatus', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload))
            .verifiable(Times.once());

        const updateTabIdActionMock = createActionMock(testTabId);
        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeInstanceStatus', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeStatus, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
        updateTabIdActionMock.verifyAll();
    });

    test('onChangeAssessmentVisualizationState', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS, payload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('changeAssessmentVisualizationState', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeVisualizationState, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onChangeVisualizationStateForAll', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL, payload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('changeAssessmentVisualizationStateForAll', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ChangeVisualizationStateForAll, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onStartOverAssessment', () => {
        const payload: BaseActionPayload = {};

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('resetData', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.StartOver, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onUpdateInstanceVisibility', () => {
        const payload: ToggleActionPayload = { test: -1 as VisualizationType };

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateInstanceVisibility', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.UpdateInstanceVisibility, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onStartOverAllAssessments', () => {
        const payload: BaseActionPayload = {};

        const actionMock = createActionMock(testTabId);
        setupAssessmentActionsMock('resetAllAssessmentsData', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.StartOverAllAssessments, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onAssessmentScanCompleted', () => {
        const payload: BaseActionPayload = {};
        const updateTabIdActionMock = createActionMock(testTabId);
        const actionMock = createActionMock(payload);

        setupAssessmentActionsMock('scanCompleted', actionMock);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.AssessmentScanCompleted, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onGetAssessmentCurrentState', () => {
        const actionMock = createActionMock(null);
        setupAssessmentActionsMock('getCurrentState', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.GetCurrentState, null, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onSelectTestStep', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock.setup(tp => tp.publishTelemetry(TelemetryEvents.SELECT_REQUIREMENT, payload)).verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('selectRequirement', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.SelectTestRequirement, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onScanUpdate', () => {
        const payload = {
            key: 'hello',
        };

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry('ScanUpdateHello', payload as BaseActionPayload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('scanUpdate', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.ScanUpdate, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onTrackingCompleted', () => {
        const payload = {
            key: 'hello',
        };

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry('TrackingCompletedHello', payload as BaseActionPayload))
            .verifiable(Times.once());

        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('trackingCompleted', actionMock);
        setupRegisterTypeToPayloadCallbackMock(AssessmentMessages.TrackingCompleted, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    test('onPivotChildSelected', () => {
        const payload: BaseActionPayload = {};
        const actionMock = createActionMock(payload);
        setupAssessmentActionsMock('updateSelectedPivotChild', actionMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.Visualizations.DetailsView.Select, payload, testTabId);

        testObject.registerCallbacks();

        actionMock.verifyAll();
    });

    function createActionMock<T>(actionPayload: T): IMock<Action<T>> {
        const actionMock = Mock.ofType<Action<T>>(Action);
        actionMock.setup(action => action.invoke(actionPayload)).verifiable(Times.once());

        return actionMock;
    }

    function setupAssessmentActionsMock(actionName: keyof AssessmentActions, actionMock: IMock<Action<any>>): void {
        assessmentActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, actionPayload: any, tabId: number): void {
        registerTypeToPayloadCallbackMock
            .setup(regitrar => regitrar(message, It.is(isFunction)))
            .callback((theMessage, handler) => handler(actionPayload, tabId));
    }
});
