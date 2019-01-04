// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { IInspectPayload } from './../../background/actions/inspect-actions';
import { TelemetryEventSource } from './../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';
import { autobind } from '@uifabric/utilities';
import { InspectMode } from '../../background/inspect-modes';

export class InspectActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;
    private source: TelemetryEventSource;

    constructor(postMessage: (message: IMessage) => void, tabId: number, telemetryFactory: TelemetryDataFactory, source: TelemetryEventSource) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
        this.source = source;
    }

    @autobind
    public changeInspectMode(event: React.MouseEvent<HTMLElement> | MouseEvent, inspectMode: InspectMode): void {
        const type = Messages.Inspect.ChangeInspectMode;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload: IInspectPayload = {
            inspectMode,
            telemetry,
        };
        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload: payload,
        });
    }
}
