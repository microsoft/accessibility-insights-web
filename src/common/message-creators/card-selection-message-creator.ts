// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionPayload, RuleExpandCollapsePayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';

export class CardSelectionMessageCreator {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}

    public toggleCardSelection(ruleId: string, resultInstanceUid: string): void {
        const payload: CardSelectionPayload = {
            resultInstanceUid,
            ruleId,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.CardSelectionToggled,
            payload,
        });
    }

    public toggleRuleExpandCollapse(ruleId: string): void {
        const payload: RuleExpandCollapsePayload = {
            ruleId,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.CardSelection.RuleExpansionToggled,
            payload,
        });
    }
}
