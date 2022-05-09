// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InspectElementPayload,
    InspectFrameUrlPayload,
    OnDevToolStatusPayload,
} from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';

import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';

export class DevToolActionMessageCreator {
    constructor(
        protected readonly telemetryFactory: TelemetryDataFactory,
        protected readonly dispatcher: ActionMessageDispatcher,
    ) {}

    public setDevToolStatus(status: boolean): void {
        const message: Message = {
            messageType: Messages.DevTools.DevtoolStatus,
            payload: {
                status: status,
            } as OnDevToolStatusPayload,
        };

        this.dispatcher.dispatchMessage(message);
    }

    public setInspectElement(event: React.SyntheticEvent<MouseEvent>, target: string[]): void {
        const payload: InspectElementPayload = {
            target: target,
            telemetry: this.telemetryFactory.forInspectElement(event, target),
        };
        const message: Message = {
            messageType: Messages.DevTools.InspectElement,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
    }

    public setInspectFrameUrl(frameUrl: string): void {
        const payload: InspectFrameUrlPayload = {
            frameUrl: frameUrl,
        };
        const message: Message = {
            messageType: Messages.DevTools.InspectFrameUrl,
            payload,
        };

        this.dispatcher.dispatchMessage(message);
    }
}
