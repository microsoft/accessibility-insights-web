// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { ScopingPayload } from './../../background/actions/scoping-actions';
import { TelemetryEventSource } from './../telemetry-events';
import { ActionMessageDispatcher } from './action-message-dispatcher';

export class ScopingActionMessageCreator {
    constructor(
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
        private readonly dispatcher: ActionMessageDispatcher,
    ) {}

    @autobind
    public addSelector(event: React.MouseEvent<HTMLElement> | MouseEvent, inputType: string, selector: string[]): void {
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
    }

    @autobind
    public deleteSelector(event: React.MouseEvent<HTMLElement> | MouseEvent, inputType: string, selector: string[]): void {
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
    }
}
