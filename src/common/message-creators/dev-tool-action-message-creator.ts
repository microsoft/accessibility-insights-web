// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectElementPayload, InspectFrameUrlPayload, OnDevToolOpenPayload } from '../../background/actions/action-payloads';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class DevToolActionMessageCreator extends BaseActionMessageCreator {
    protected telemetryFactory: TelemetryDataFactory;

    constructor(postMessage: (message: Message) => void, tabId: number, telemetryFactory: TelemetryDataFactory) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
    }

    public setDevToolStatus(status: boolean): void {
        const message: Message = {
            tabId: this._tabId,
            type: Messages.DevTools.DevtoolStatus,
            payload: {
                status: status,
            } as OnDevToolOpenPayload,
        };

        this.dispatchMessage(message);
    }

    public setInspectElement(event: React.SyntheticEvent<MouseEvent>, target: string[]): void {
        const payload: InspectElementPayload = {
            target: target,
            telemetry: this.telemetryFactory.forInspectElement(event, target),
        };
        const message: Message = {
            tabId: this._tabId,
            type: Messages.DevTools.InspectElement,
            payload,
        };

        this.dispatchMessage(message);
    }

    public setInspectFrameUrl(frameUrl: string): void {
        const payload: InspectFrameUrlPayload = {
            frameUrl: frameUrl,
        };
        const message: Message = {
            tabId: this._tabId,
            type: Messages.DevTools.InspectFrameUrl,
            payload,
        };

        this.dispatchMessage(message);
    }
}
