// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="../message.d.ts" />

import { Messages } from '../messages';
import { PayloadWithEventName } from '../../background/actions/action-payloads';
import { TelemetryData } from '../telemetry-events';

export abstract class BaseActionMessageCreator {
    private _postMessageDelegate: (message: IMessage) => void;
    protected _tabId: number;

    constructor(postMessage: (message: IMessage) => void, tabId: number) {
        this._postMessageDelegate = postMessage;
        this._tabId = tabId;
    }

    protected dispatchMessage(message: IMessage): void {
        this._postMessageDelegate(message);
    }

    protected dispatchType(type: string): void {
        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
        });
    }

    protected sendTelemetry(eventName: string, eventData: TelemetryData): void {
        const payload: PayloadWithEventName = {
            eventName: eventName,
            telemetry: eventData,
        };
        const message: IMessage = {
            type: Messages.Telemetry.Send,
            payload,
        };

        if (this._tabId) {
            message.tabId = this._tabId;
        }

        this.dispatchMessage(message);
    }
}
