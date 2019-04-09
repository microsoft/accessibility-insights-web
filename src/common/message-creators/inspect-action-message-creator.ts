// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { InspectMode } from '../../background/inspect-modes';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { InspectPayload } from './../../background/actions/inspect-actions';
import { TelemetryEventSource } from './../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class InspectActionMessageCreator extends BaseActionMessageCreator {
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
    public changeInspectMode(event: React.MouseEvent<HTMLElement> | MouseEvent, inspectMode: InspectMode): void {
        const messageType = Messages.Inspect.ChangeInspectMode;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload: InspectPayload = {
            inspectMode,
            telemetry,
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload: payload,
        });
    }
}
