// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from '../../common/extension-telemetry-events';

import { Messages } from '../../common/messages';
import { CardSelectionActions } from '../actions/card-selection-actions';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { CardSelectionPayload } from './action-payloads';

export class CardSelectionActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly cardSelectionActions: CardSelectionActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.CardSelection.CardSelectionToggled, this.onCardSelectionToggle);
    }

    private onCardSelectionToggle = (payload: CardSelectionPayload): void => {
        this.cardSelectionActions.toggleCardSelection.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.CARD_SELECTION_TOGGLED, payload);
    };
}
