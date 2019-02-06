// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { OnDevToolOpenPayload, InspectElementPayload, InspectFrameUrlPayload } from '../../background/actions/action-payloads';
import { BaseActionMessageCreator } from '../message-creators/base-action-message-creator';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';

export class DevToolActionMessageCreator extends BaseActionMessageCreator {
    protected telemetryFactory: TelemetryDataFactory;

    constructor(postMessage: (message: IMessage) => void, tabId: number, telemetryFactory: TelemetryDataFactory) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
    }

    public setDevToolStatus(status: boolean) {
        const message: IMessage = {
            tabId: this._tabId,
            type: Messages.DevTools.DevtoolStatus,
            payload: {
                status: status,
            } as OnDevToolOpenPayload,
        };

        this.dispatchMessage(message);
    }

    public setInspectElement(event: React.SyntheticEvent<MouseEvent>, target: string[]) {
        const payload: InspectElementPayload = {
            target: target,
            telemetry: this.telemetryFactory.forInspectElement(event, target),
        };
        const message: IMessage = {
            tabId: this._tabId,
            type: Messages.DevTools.InspectElement,
            payload,
        };

        this.dispatchMessage(message);
    }

    public setInspectFrameUrl(frameUrl: string) {
        const payload: InspectFrameUrlPayload = {
            frameUrl: frameUrl,
        };
        const message: IMessage = {
            tabId: this._tabId,
            type: Messages.DevTools.InspectFrameUrl,
            payload,
        };

        this.dispatchMessage(message);
    }
}
