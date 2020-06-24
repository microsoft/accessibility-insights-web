// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from 'background/inspect-modes';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import * as React from 'react';

import { TelemetryEventSource } from 'common/types/telemetry-data';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { InspectPayload } from './../../background/actions/inspect-actions';

export class InspectActionMessageCreator {
    constructor(
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
        private readonly dispatcher: ActionMessageDispatcher,
    ) {}

    public changeInspectMode = (
        event: React.MouseEvent<HTMLElement> | MouseEvent,
        inspectMode: InspectMode,
    ): void => {
        const messageType = Messages.Inspect.ChangeInspectMode;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload: InspectPayload = {
            inspectMode,
            telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload: payload,
        });
    };
}
