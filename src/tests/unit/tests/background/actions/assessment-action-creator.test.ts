// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    AssessmentActionInstancePayload,
    BaseActionPayload,
    ChangeInstanceSelectionPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    ExpandTestNavPayload,
    OnDetailsViewOpenPayload,
    RemoveFailureInstancePayload,
    SelectGettingStartedPayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
} from 'background/actions/action-payloads';
import { AssessmentActionCreator } from 'background/actions/assessment-action-creator';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { gettingStartedSubview } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ScanBasePayload,
    ScanCompletedPayload,
    ScanUpdatePayload,
} from 'injected/analyzers/analyzer';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('AssessmentActionCreatorTest', () => {
    let assessmentActionsMock: IMock<AssessmentActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    const AssessmentMessages = Messages.Assessment;
    const testTabId = -1;
    const telemetryOnlyPayload: BaseActionPayload = {
        telemetry: {
            source: -1 as TelemetryEventSource,
            triggeredBy: 'N/A',
        },
    };

    beforeEach(() => {
        assessmentActionsMock = Mock.ofType(AssessmentActions, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('handles PassUnmarkedInstances message', () => {
        const updateTabIdActionMock = createActionMock(testTabId);
        const passUnmarkedInstanceActionMock = createActionMock(telemetryOnlyPayload);

        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('passUnmarkedInstance', passUnmarkedInstanceActionMock);

        const interpreterMock = createInterpreterMock(
            AssessmentMessages.PassUnmarkedInstances,
            telemetryOnlyPayload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        updateTabIdActionMock.verifyAll();
        passUnmarkedInstanceActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.PASS_UNMARKED_INSTANCES,
                    telemetryOnlyPayload,
                ),
            Times.once(),
        );
    });

    it('handles ContinuePreviousAssessment message', () => {
        const continuePreviousAssessmentMock = createActionMock(testTabId);
        const actionsMock = createActionsMock(
            'continuePreviousAssessment',
            continuePreviousAssessmentMock.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.ContinuePreviousAssessment,
            telemetryOnlyPayload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        continuePreviousAssessmentMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.CONTINUE_PREVIOUS_ASSESSMENT,
                    telemetryOnlyPayload,
                ),
            Times.once(),
        );
    });

    it('handles EditFailureInstance message', () => {
        const payload: EditFailureInstancePayload = {
            id: 'test-id',
            ...telemetryOnlyPayload,
        } as EditFailureInstancePayload;

        const editFailureInstanceMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'editFailureInstance',
            editFailureInstanceMock.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.EditFailureInstance,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        editFailureInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.EDIT_FAILURE_INSTANCE, payload),
            Times.once(),
        );
    });

    it('handles RemoveFailureInstance message', () => {
        const payload: RemoveFailureInstancePayload = {
            id: 'test-id',
            ...telemetryOnlyPayload,
        } as RemoveFailureInstancePayload;

        const removeFailureInstanceMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'removeFailureInstance',
            removeFailureInstanceMock.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.RemoveFailureInstance,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        removeFailureInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.REMOVE_FAILURE_INSTANCE, payload),
            Times.once(),
        );
    });

    it('handles AddFailureInstance message', () => {
        const payload: AddFailureInstancePayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as AddFailureInstancePayload;

        const addFailureInstanceMock = createActionMock(payload);
        const actionsMock = createActionsMock('addFailureInstance', addFailureInstanceMock.object);
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.AddFailureInstance,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        addFailureInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ADD_FAILURE_INSTANCE, payload),
            Times.once(),
        );
    });

    it('handles AddResultDescription message', () => {
        const payload: AddResultDescriptionPayload = {
            description: 'test-description',
        };

        const addResultDescriptionMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'addResultDescription',
            addResultDescriptionMock.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.AddResultDescription,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        addResultDescriptionMock.verifyAll();
    });

    it('handles ChangeManualRequirementStatus message', () => {
        const payload: ChangeRequirementStatusPayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as ChangeRequirementStatusPayload;

        const updateTabIdActionMock = createActionMock(testTabId);
        const changeRequirementStatusMock = createActionMock(payload);

        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeRequirementStatus', changeRequirementStatusMock);

        const interpreterMock = createInterpreterMock(
            AssessmentMessages.ChangeRequirementStatus,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        changeRequirementStatusMock.verifyAll();
        updateTabIdActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload),
            Times.once(),
        );
    });

    it('handles UndoChangeManualRequirementStatus message', () => {
        const payload: ChangeRequirementStatusPayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as ChangeRequirementStatusPayload;

        const undoRequirementStatusChange = createActionMock(payload);
        const actionsMock = createActionsMock(
            'undoRequirementStatusChange',
            undoRequirementStatusChange.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.UndoChangeRequirementStatus,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        undoRequirementStatusChange.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(TelemetryEvents.UNDO_REQUIREMENT_STATUS_CHANGE, payload),
            Times.once(),
        );
    });

    it('handles UndoAssessmentInstanceStatusChange message', () => {
        const payload: AssessmentActionInstancePayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as AssessmentActionInstancePayload;

        const undoInstanceStatusChangeMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'undoInstanceStatusChange',
            undoInstanceStatusChangeMock.object,
        );
        const interpreterMock = createInterpreterMock(AssessmentMessages.Undo, payload);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        undoInstanceStatusChangeMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.UNDO_TEST_STATUS_CHANGE, payload),
            Times.once(),
        );
    });

    it('handles ChangeAssessmentInstanceStatus message', () => {
        const payload: ChangeInstanceSelectionPayload = {
            selector: 'test-selector',
            ...telemetryOnlyPayload,
        } as ChangeInstanceSelectionPayload;

        const updateTabIdActionMock = createActionMock(testTabId);
        const changeInstanceStatusMock = createActionMock(payload);

        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeInstanceStatus', changeInstanceStatusMock);

        const interpreterMock = createInterpreterMock(
            AssessmentMessages.ChangeStatus,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        changeInstanceStatusMock.verifyAll();
        updateTabIdActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload),
            Times.once(),
        );
    });

    it('handles ChangeAssessmentVisualizationState message', () => {
        const payload: ChangeInstanceSelectionPayload = {
            isVisualizationEnabled: true,
            ...telemetryOnlyPayload,
        } as ChangeInstanceSelectionPayload;

        const changeAssessmentVisualizationStateMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'changeAssessmentVisualizationState',
            changeAssessmentVisualizationStateMock.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.ChangeVisualizationState,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        changeAssessmentVisualizationStateMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS,
                    payload,
                ),
            Times.once(),
        );
    });

    it('handles ChangeVisualizationStateForAll message', () => {
        const payload: ChangeInstanceSelectionPayload = {
            isVisualizationEnabled: true,
            ...telemetryOnlyPayload,
        } as ChangeInstanceSelectionPayload;

        const changeAssessmentVisualizationStateForAllMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'changeAssessmentVisualizationStateForAll',
            changeAssessmentVisualizationStateForAllMock.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.ChangeVisualizationStateForAll,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        changeAssessmentVisualizationStateForAllMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL,
                    payload,
                ),
            Times.once(),
        );
    });

    it('handles StartOverAssessment message', () => {
        const payload: ToggleActionPayload = {
            test: -1 as VisualizationType,
        };

        const resetDataMock = createActionMock(payload);
        const actionsMock = createActionsMock('resetData', resetDataMock.object);
        const interpreterMock = createInterpreterMock(AssessmentMessages.StartOverTest, payload);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        resetDataMock.verifyAll();
    });

    it('handles StartOverAllAssessments message', () => {
        const payload = {};

        const resetAllAssessmentsData = createActionMock(testTabId);
        const actionsMock = createActionsMock(
            'resetAllAssessmentsData',
            resetAllAssessmentsData.object,
        );
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.StartOverAllAssessments,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        resetAllAssessmentsData.verifyAll();
    });

    it('handles AssessmentScanCompleted message', () => {
        const payload: ScanCompletedPayload<any> = {
            key: 'test-key',
        } as ScanCompletedPayload<any>;

        const updateTabIdActionMock = createActionMock(testTabId);
        const scanCompleteMock = createActionMock(payload);

        setupAssessmentActionsMock('scanCompleted', scanCompleteMock);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);

        const interpreterMock = createInterpreterMock(
            AssessmentMessages.AssessmentScanCompleted,
            payload,
            testTabId,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        scanCompleteMock.verifyAll();
    });

    it('handles GetCurrentState message', () => {
        const getCurrentStateMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.AssessmentStore),
            null,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it('handles SelectTestRequirement message', () => {
        const payload: SelectTestSubviewPayload = {
            selectedTestSubview: 'test-requirement',
            ...telemetryOnlyPayload,
        } as SelectTestSubviewPayload;

        const selectRequirementMock = createActionMock(payload);
        const actionsMock = createActionsMock('selectTestSubview', selectRequirementMock.object);
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.SelectTestRequirement,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        selectRequirementMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.SELECT_REQUIREMENT, payload),
            Times.once(),
        );
    });

    it('handles SelectNextRequirement message', () => {
        const payload: SelectTestSubviewPayload = {
            selectedTestSubview: 'test-requirement',
            ...telemetryOnlyPayload,
        } as SelectTestSubviewPayload;

        const selectNextRequirement = createActionMock(payload);
        const actionsMock = createActionsMock('selectTestSubview', selectNextRequirement.object);
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.SelectNextRequirement,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        selectNextRequirement.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.SELECT_NEXT_REQUIREMENT, payload),
            Times.once(),
        );
    });

    it('handles SelectGettingStarted message', () => {
        const payload: SelectGettingStartedPayload = {
            ...telemetryOnlyPayload,
        } as SelectGettingStartedPayload;
        const actionPayload: SelectTestSubviewPayload = {
            selectedTestSubview: gettingStartedSubview,
            ...telemetryOnlyPayload,
        } as SelectTestSubviewPayload;

        const selectRequirementMock = createActionMock(actionPayload);
        const actionsMock = createActionsMock('selectTestSubview', selectRequirementMock.object);
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.SelectGettingStarted,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        selectRequirementMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.SELECT_GETTING_STARTED, payload),
            Times.once(),
        );
    });

    it('handles ExpandTestNav message', () => {
        const payload: ExpandTestNavPayload = {
            selectedTest: 1,
        } as ExpandTestNavPayload;

        const expandTestNavMock = createActionMock(payload);
        const actionsMock = createActionsMock('expandTestNav', expandTestNavMock.object);
        const interpreterMock = createInterpreterMock(AssessmentMessages.ExpandTestNav, payload);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        expandTestNavMock.verifyAll();
    });

    it('handles CollapseTestNav message', () => {
        const collapseTestNavMock = createActionMock(null);
        const actionsMock = createActionsMock('collapseTestNav', collapseTestNavMock.object);
        const interpreterMock = createInterpreterMock(AssessmentMessages.CollapseTestNav, null);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        collapseTestNavMock.verifyAll();
    });

    it('handles ScanUpdate message', () => {
        const payload: ScanUpdatePayload = {
            key: 'hello',
            ...telemetryOnlyPayload,
        } as ScanUpdatePayload;

        const scanUpdateMock = createActionMock(payload);
        const actionsMock = createActionsMock('scanUpdate', scanUpdateMock.object);
        const interpreterMock = createInterpreterMock(AssessmentMessages.ScanUpdate, payload);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        scanUpdateMock.verifyAll();
        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry('ScanUpdateHello', payload as BaseActionPayload))
            .verifiable(Times.once());
    });

    it('handles TrackingCompleted message', () => {
        const payload: ScanBasePayload = {
            key: 'hello',
            ...telemetryOnlyPayload,
        } as ScanBasePayload;

        const trackingCompletedMock = createActionMock(payload);
        const actionsMock = createActionsMock('trackingCompleted', trackingCompletedMock.object);
        const interpreterMock = createInterpreterMock(
            AssessmentMessages.TrackingCompleted,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        trackingCompletedMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry('TrackingCompletedHello', payload),
            Times.once(),
        );
    });

    it('handles PivotChildSelected message', () => {
        const payload: OnDetailsViewOpenPayload = {
            pivotType: -1 as DetailsViewPivotType,
        } as OnDetailsViewOpenPayload;

        const updateSelectedPivotChildMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'updateSelectedPivotChild',
            updateSelectedPivotChildMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.DetailsView.Select,
            payload,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        updateSelectedPivotChildMock.verifyAll();
    });

    function setupAssessmentActionsMock(
        actionName: keyof AssessmentActions,
        actionMock: IMock<Action<any>>,
    ): void {
        assessmentActionsMock
            .setup(actions => actions[actionName])
            .returns(() => actionMock.object);
    }

    function createActionsMock<ActionName extends keyof AssessmentActions>(
        actionName: ActionName,
        action: AssessmentActions[ActionName],
    ): IMock<AssessmentActions> {
        const actionsMock = Mock.ofType<AssessmentActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
