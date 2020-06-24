// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { TelemetryEventSource } from 'common/types/telemetry-data';
import * as React from 'react';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { ScopingPayload } from './../../background/actions/scoping-actions';

export class ScopingActionMessageCreator {
    constructor(
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
        private readonly dispatcher: ActionMessageDispatcher,
    ) {}

    public addSelector = (
        event: React.MouseEvent<HTMLElement> | MouseEvent,
        inputType: string,
        selector: string[],
    ): void => {
        const messageType = Messages.Scoping.AddSelector;
        const telemetry = this.telemetryFactory.forAddSelector(event, inputType, this.source);
        const payload: ScopingPayload = {
            inputType,
            selector,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload: payload,
        });
    };

    public deleteSelector = (
        event: React.MouseEvent<HTMLElement> | MouseEvent,
        inputType: string,
        selector: string[],
    ): void => {
        const messageType = Messages.Scoping.DeleteSelector;
        const telemetry = this.telemetryFactory.forDeleteSelector(event, inputType, this.source);
        const payload: ScopingPayload = {
            inputType,
            selector,
            telemetry,
        };

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload: payload,
        });
    };
}
