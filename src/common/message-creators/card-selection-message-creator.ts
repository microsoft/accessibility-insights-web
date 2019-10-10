// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionPayload } from 'background/actions/action-payloads';
import { Messages } from 'common/messages';

import { ActionMessageDispatcher } from './action-message-dispatcher';

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
}
