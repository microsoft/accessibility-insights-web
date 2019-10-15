// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionPayload } from 'background/actions/action-payloads';
import { Dispatcher } from 'common/message-creators/types/dispatcher';
import { Messages } from 'common/messages';

export class CardSelectionMessageCreator {
    constructor(private readonly dispatcher: Dispatcher) {}

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
}
