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
    OnDetailsViewInitializedPayload,
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
import { SyncAction } from 'common/flux/sync-action';
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
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { createSyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('AssessmentActionCreatorTest', () => {
    let assessmentActionsMock: IMock<AssessmentActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;

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
        interpreterMock = new MockInterpreter();
    });

    it('handles PassUnmarkedInstances message', async () => {
        const updateTabIdActionMock = createSyncActionMock(testTabId);
        const passUnmarkedInstanceActionMock = createSyncActionMock(telemetryOnlyPayload);

        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('passUnmarkedInstance', passUnmarkedInstanceActionMock);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.PassUnmarkedInstances,
            telemetryOnlyPayload,
            testTabId,
        );

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

    it('handles ContinuePreviousAssessment message', async () => {
        const continuePreviousAssessmentMock = createSyncActionMock(testTabId);
        const actionsMock = createActionsMock(
            'continuePreviousAssessment',
            continuePreviousAssessmentMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.ContinuePreviousAssessment,
            telemetryOnlyPayload,
            testTabId,
        );

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

    it('handles EditFailureInstance message', async () => {
        const payload: EditFailureInstancePayload = {
            id: 'test-id',
            ...telemetryOnlyPayload,
        } as EditFailureInstancePayload;

        const editFailureInstanceMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'editFailureInstance',
            editFailureInstanceMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.EditFailureInstance,
            payload,
            testTabId,
        );

        editFailureInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.EDIT_FAILURE_INSTANCE, payload),
            Times.once(),
        );
    });

    it('handles RemoveFailureInstance message', async () => {
        const payload: RemoveFailureInstancePayload = {
            id: 'test-id',
            ...telemetryOnlyPayload,
        } as RemoveFailureInstancePayload;

        const removeFailureInstanceMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'removeFailureInstance',
            removeFailureInstanceMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.RemoveFailureInstance, payload);

        removeFailureInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.REMOVE_FAILURE_INSTANCE, payload),
            Times.once(),
        );
    });

    it('handles AddFailureInstance message', async () => {
        const payload: AddFailureInstancePayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as AddFailureInstancePayload;

        const addFailureInstanceMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('addFailureInstance', addFailureInstanceMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.AddFailureInstance, payload);

        addFailureInstanceMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ADD_FAILURE_INSTANCE, payload),
            Times.once(),
        );
    });

    it('handles AddResultDescription message', async () => {
        const payload: AddResultDescriptionPayload = {
            description: 'test-description',
        };

        const addResultDescriptionMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'addResultDescription',
            addResultDescriptionMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.AddResultDescription, payload);

        addResultDescriptionMock.verifyAll();
    });

    it('handles ChangeManualRequirementStatus message', async () => {
        const payload: ChangeRequirementStatusPayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as ChangeRequirementStatusPayload;

        const updateTabIdActionMock = createSyncActionMock(testTabId);
        const changeRequirementStatusMock = createSyncActionMock(payload);

        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeRequirementStatus', changeRequirementStatusMock);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.ChangeRequirementStatus,
            payload,
            testTabId,
        );

        changeRequirementStatusMock.verifyAll();
        updateTabIdActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload),
            Times.once(),
        );
    });

    it('handles UndoChangeManualRequirementStatus message', async () => {
        const payload: ChangeRequirementStatusPayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as ChangeRequirementStatusPayload;

        const undoRequirementStatusChange = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'undoRequirementStatusChange',
            undoRequirementStatusChange.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.UndoChangeRequirementStatus,
            payload,
            testTabId,
        );

        undoRequirementStatusChange.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(TelemetryEvents.UNDO_REQUIREMENT_STATUS_CHANGE, payload),
            Times.once(),
        );
    });

    it('handles UndoAssessmentInstanceStatusChange message', async () => {
        const payload: AssessmentActionInstancePayload = {
            test: -1 as VisualizationType,
            ...telemetryOnlyPayload,
        } as AssessmentActionInstancePayload;

        const undoInstanceStatusChangeMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'undoInstanceStatusChange',
            undoInstanceStatusChangeMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.Undo, payload);

        undoInstanceStatusChangeMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.UNDO_TEST_STATUS_CHANGE, payload),
            Times.once(),
        );
    });

    it('handles ChangeAssessmentInstanceStatus message', async () => {
        const payload: ChangeInstanceSelectionPayload = {
            selector: 'test-selector',
            ...telemetryOnlyPayload,
        } as ChangeInstanceSelectionPayload;

        const updateTabIdActionMock = createSyncActionMock(testTabId);
        const changeInstanceStatusMock = createSyncActionMock(payload);

        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);
        setupAssessmentActionsMock('changeInstanceStatus', changeInstanceStatusMock);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.ChangeStatus, payload, testTabId);

        changeInstanceStatusMock.verifyAll();
        updateTabIdActionMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.CHANGE_INSTANCE_STATUS, payload),
            Times.once(),
        );
    });

    it('handles ChangeAssessmentVisualizationState message', async () => {
        const payload: ChangeInstanceSelectionPayload = {
            isVisualizationEnabled: true,
            ...telemetryOnlyPayload,
        } as ChangeInstanceSelectionPayload;

        const changeAssessmentVisualizationStateMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'changeAssessmentVisualizationState',
            changeAssessmentVisualizationStateMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.ChangeVisualizationState, payload);

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

    it('handles ChangeVisualizationStateForAll message', async () => {
        const payload: ChangeInstanceSelectionPayload = {
            isVisualizationEnabled: true,
            ...telemetryOnlyPayload,
        } as ChangeInstanceSelectionPayload;

        const changeAssessmentVisualizationStateForAllMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'changeAssessmentVisualizationStateForAll',
            changeAssessmentVisualizationStateForAllMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.ChangeVisualizationStateForAll,
            payload,
            testTabId,
        );

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

    it('handles StartOverAssessment message', async () => {
        const payload: ToggleActionPayload = {
            test: -1 as VisualizationType,
        };

        const resetDataMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('resetData', resetDataMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.StartOverTest, payload);

        resetDataMock.verifyAll();
    });

    it('handles StartOverAllAssessments message', async () => {
        const payload = {};

        const resetAllAssessmentsData = createSyncActionMock(testTabId);
        const actionsMock = createActionsMock(
            'resetAllAssessmentsData',
            resetAllAssessmentsData.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.StartOverAllAssessments,
            payload,
            testTabId,
        );

        resetAllAssessmentsData.verifyAll();
    });

    it('handles AssessmentScanCompleted message', async () => {
        const payload: ScanCompletedPayload<any> = {
            key: 'test-key',
        } as ScanCompletedPayload<any>;

        const updateTabIdActionMock = createSyncActionMock(testTabId);
        const scanCompleteMock = createSyncActionMock(payload);

        setupAssessmentActionsMock('scanCompleted', scanCompleteMock);
        setupAssessmentActionsMock('updateTargetTabId', updateTabIdActionMock);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.AssessmentScanCompleted,
            payload,
            testTabId,
        );

        scanCompleteMock.verifyAll();
    });

    it('handles GetCurrentState message', async () => {
        const getCurrentStateMock = createSyncActionMock<void>(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            getStoreStateMessage(StoreNames.AssessmentStore),
            null,
        );

        getCurrentStateMock.verifyAll();
    });

    it('handles SelectTestRequirement message', async () => {
        const payload: SelectTestSubviewPayload = {
            selectedTestSubview: 'test-requirement',
            ...telemetryOnlyPayload,
        } as SelectTestSubviewPayload;

        const selectRequirementMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('selectTestSubview', selectRequirementMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.SelectTestRequirement, payload);

        selectRequirementMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.SELECT_REQUIREMENT, payload),
            Times.once(),
        );
    });

    it('handles SelectNextRequirement message', async () => {
        const payload: SelectTestSubviewPayload = {
            selectedTestSubview: 'test-requirement',
            ...telemetryOnlyPayload,
        } as SelectTestSubviewPayload;

        const selectNextRequirement = createSyncActionMock(payload);
        const actionsMock = createActionsMock('selectTestSubview', selectNextRequirement.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.SelectNextRequirement, payload);

        selectNextRequirement.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.SELECT_NEXT_REQUIREMENT, payload),
            Times.once(),
        );
    });

    it('handles SelectGettingStarted message', async () => {
        const payload: SelectGettingStartedPayload = {
            ...telemetryOnlyPayload,
        } as SelectGettingStartedPayload;
        const actionPayload: SelectTestSubviewPayload = {
            selectedTestSubview: gettingStartedSubview,
            ...telemetryOnlyPayload,
        } as SelectTestSubviewPayload;

        const selectRequirementMock = createSyncActionMock(actionPayload);
        const actionsMock = createActionsMock('selectTestSubview', selectRequirementMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.SelectGettingStarted, payload);

        selectRequirementMock.verifyAll();
        telemetryEventHandlerMock.verify(
            tp => tp.publishTelemetry(TelemetryEvents.SELECT_GETTING_STARTED, payload),
            Times.once(),
        );
    });

    it('handles ExpandTestNav message', async () => {
        const payload: ExpandTestNavPayload = {
            selectedTest: 1,
        } as ExpandTestNavPayload;

        const expandTestNavMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('expandTestNav', expandTestNavMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.ExpandTestNav, payload);

        expandTestNavMock.verifyAll();
    });

    it('handles CollapseTestNav message', async () => {
        const collapseTestNavMock = createSyncActionMock(null);
        const actionsMock = createActionsMock('collapseTestNav', collapseTestNavMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.CollapseTestNav, null);

        collapseTestNavMock.verifyAll();
    });

    it('handles ScanUpdate message', async () => {
        const payload: ScanUpdatePayload = {
            key: 'hello',
            ...telemetryOnlyPayload,
        } as ScanUpdatePayload;

        const scanUpdateMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('scanUpdate', scanUpdateMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.ScanUpdate, payload);

        scanUpdateMock.verifyAll();
        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry('ScanUpdateHello', payload as BaseActionPayload))
            .verifiable(Times.once());
    });

    it('handles TrackingCompleted message', async () => {
        const payload: ScanBasePayload = {
            key: 'hello',
            ...telemetryOnlyPayload,
        } as ScanBasePayload;

        const trackingCompletedMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('trackingCompleted', trackingCompletedMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(AssessmentMessages.TrackingCompleted, payload);

        trackingCompletedMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry('TrackingCompletedHello', payload),
            Times.once(),
        );
    });

    it('handles PivotChildSelected message', async () => {
        const payload: OnDetailsViewOpenPayload = {
            pivotType: -1 as DetailsViewPivotType,
        } as OnDetailsViewOpenPayload;

        const updateSelectedPivotChildMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock(
            'updateSelectedPivotChild',
            updateSelectedPivotChildMock.object,
        );

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Visualizations.DetailsView.Select, payload);

        updateSelectedPivotChildMock.verifyAll();
    });

    it('handles SaveAssessment message', async () => {
        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            assessmentActionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            AssessmentMessages.SaveAssessment,
            telemetryOnlyPayload,
            testTabId,
        );

        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(TelemetryEvents.SAVE_ASSESSMENT, telemetryOnlyPayload),
            Times.once(),
        );
    });

    it('handles DetailsViewInitialize message', async () => {
        const payload: OnDetailsViewInitializedPayload = {
            detailsViewId: 'testId',
        } as OnDetailsViewInitializedPayload;

        const detailsViewInitMock = createSyncActionMock(payload);
        const actionsMock = createActionsMock('updateDetailsViewId', detailsViewInitMock.object);

        const testSubject = new AssessmentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.DetailsView.Initialize,
            payload,
        );

        detailsViewInitMock.verifyAll();
    });

    function setupAssessmentActionsMock(
        actionName: keyof AssessmentActions,
        actionMock: IMock<SyncAction<any>>,
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
