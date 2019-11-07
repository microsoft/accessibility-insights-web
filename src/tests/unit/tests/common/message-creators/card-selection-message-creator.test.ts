// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionPayload, RuleExpandCollapsePayload } from 'background/actions/action-payloads';
import { Message } from 'common/message';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

describe('Card Selection Message Creator', () => {
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: CardSelectionMessageCreator;

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        testSubject = new CardSelectionMessageCreator(dispatcherMock.object);
    });

    it('dispatches message for toggleCardSelection', () => {
        const resultInstanceUid = 'test-uid';
        const ruleId = 'test-rule-id';
        const payload: CardSelectionPayload = {
            resultInstanceUid,
            ruleId,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.CardSelectionToggled,
            payload,
        };

        testSubject.toggleCardSelection(ruleId, resultInstanceUid);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });

    test('toggleRuleExpandCollapse', () => {
        const ruleId = 'test-rule-id';
        const payload: RuleExpandCollapsePayload = {
            ruleId,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.RuleExpansionToggled,
            payload,
        };

        testSubject.toggleRuleExpandCollapse(ruleId);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });

    test('collapseAllRules', () => {
        const expectedMessage: Message = {
            messageType: Messages.CardSelection.CollapseAllRules,
        };

        testSubject.collapseAllRules();

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });

    test('expandAllRules', () => {
        const expectedMessage: Message = {
            messageType: Messages.CardSelection.ExpandAllRules,
        };

        testSubject.expandAllRules();

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });

    test('toggleVisualHelper', () => {
        const expectedMessage: Message = {
            messageType: Messages.CardSelection.ToggleVisualHelper,
        };

        testSubject.toggleVisualHelper();

        dispatcherMock.verify(dm => dm.dispatchMessage(expectedMessage), Times.once());
    });
});
