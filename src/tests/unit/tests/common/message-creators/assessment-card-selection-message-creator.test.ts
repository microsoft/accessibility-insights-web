// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentSingleRuleExpandCollapsePayload,
} from 'background/actions/action-payloads';
import { BaseTelemetryData, TelemetryEventSource } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { AssessmentCardSelectionMessageCreator } from 'common/message-creators/assessment-card-selection-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { IMock, Mock, Times } from 'typemoq';

describe('AssessmentCardSelectionMessageCreator', () => {
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: AssessmentCardSelectionMessageCreator;
    let telemetryDataFactoryMock: IMock<TelemetryDataFactory>;
    let sourceStub: TelemetryEventSource;
    let eventStub: React.SyntheticEvent;
    let telemetryStub: BaseTelemetryData;

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        telemetryDataFactoryMock = Mock.ofType<TelemetryDataFactory>();
        sourceStub = -1 as TelemetryEventSource;
        eventStub = {} as React.SyntheticEvent;
        telemetryStub = {} as BaseTelemetryData;
        testSubject = new AssessmentCardSelectionMessageCreator(
            dispatcherMock.object,
            telemetryDataFactoryMock.object,
            sourceStub,
            Messages.AssessmentCardSelection,
        );
    });

    it('dispatches message for toggleCardSelection', () => {
        const testKey = 'test-testKey';
        const resultInstanceUid = 'test-uid';
        const ruleId = 'test-rule-id';
        const payload: AssessmentCardSelectionPayload = {
            testKey,
            resultInstanceUid,
            ruleId,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.AssessmentCardSelection.CardSelectionToggled,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.toggleCardSelection(ruleId, resultInstanceUid, eventStub, testKey);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });

    test('toggleRuleExpandCollapse', () => {
        const testKey = 'test-testKey';
        const ruleId = 'test-rule-id';
        const payload: AssessmentSingleRuleExpandCollapsePayload = {
            testKey,
            ruleId,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.AssessmentCardSelection.RuleExpansionToggled,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.toggleRuleExpandCollapse(ruleId, eventStub, testKey);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });

    test('collapseAllRules', () => {
        const testKey = 'test-testKey';
        const payload: AssessmentExpandCollapsePayload = {
            testKey,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.AssessmentCardSelection.CollapseAllRules,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.collapseAllRules(eventStub, testKey);

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });

    test('expandAllRules', () => {
        const testKey = 'test-testKey';
        const payload: AssessmentExpandCollapsePayload = {
            testKey,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.AssessmentCardSelection.ExpandAllRules,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.expandAllRules(eventStub, testKey);

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });

    test('toggleVisualHelper', () => {
        const testKey = 'test-testKey';
        const payload: AssessmentCardToggleVisualHelperPayload = {
            testKey,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.AssessmentCardSelection.ToggleVisualHelper,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.toggleVisualHelper(eventStub, testKey);

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });
});
