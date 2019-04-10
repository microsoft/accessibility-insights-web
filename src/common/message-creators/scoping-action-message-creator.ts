// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { ScopingPayload } from './../../background/actions/scoping-actions';
import { TelemetryEventSource } from './../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class ScopingActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;
    private source: TelemetryEventSource;

    constructor(
        postMessage: (message: Message) => void,
        tabId: number,
        telemetryFactory: TelemetryDataFactory,
        source: TelemetryEventSource,
    ) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
        this.source = source;
    }

    @autobind
    public addSelector(event: React.MouseEvent<HTMLElement> | MouseEvent, inputType: string, selector: string[]): void {
        const messageType = Messages.Scoping.AddSelector;
        const telemetry = this.telemetryFactory.forAddSelector(event, inputType, this.source);
        const payload: ScopingPayload = {
            inputType,
            selector,
            telemetry,
        };

        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
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

        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload: payload,
        });
    }
}
