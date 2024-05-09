// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
} from 'background/actions/action-payloads';
import { BaseTelemetryData, TelemetryEventSource } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { IMock, Mock, Times } from 'typemoq';

describe('Card Selection Message Creator', () => {
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: AutomatedChecksCardSelectionMessageCreator;
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
        testSubject = new AutomatedChecksCardSelectionMessageCreator(
            dispatcherMock.object,
            telemetryDataFactoryMock.object,
            sourceStub,
        );
    });

    it('dispatches message for toggleCardSelection', () => {
        const resultInstanceUid = 'test-uid';
        const ruleId = 'test-rule-id';
        const payload: CardSelectionPayload = {
            resultInstanceUid,
            ruleId,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.CardSelectionToggled,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.toggleCardSelection(ruleId, resultInstanceUid, eventStub);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });

    test('toggleRuleExpandCollapse', () => {
        const ruleId = 'test-rule-id';
        const payload: RuleExpandCollapsePayload = {
            ruleId,
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.RuleExpansionToggled,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.toggleRuleExpandCollapse(ruleId, eventStub);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });

    test('collapseAllRules', () => {
        const payload: BaseActionPayload = {
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.CollapseAllRules,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.collapseAllRules(eventStub);

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });

    test('expandAllRules', () => {
        const payload: BaseActionPayload = {
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.ExpandAllRules,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.expandAllRules(eventStub);

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });

    test('toggleVisualHelper', () => {
        const payload: BaseActionPayload = {
            telemetry: telemetryStub,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.ToggleVisualHelper,
            payload,
        };

        telemetryDataFactoryMock
            .setup(tdfm => tdfm.withTriggeredByAndSource(eventStub, sourceStub))
            .returns(() => telemetryStub);

        testSubject.toggleVisualHelper(eventStub);

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });
});
