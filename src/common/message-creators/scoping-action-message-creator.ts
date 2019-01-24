// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { IScopingPayload } from './../../background/actions/scoping-actions';
import { TelemetryEventSource } from './../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';
import { autobind } from '@uifabric/utilities';

export class ScopingActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;
    private source: TelemetryEventSource;

    constructor(
        postMessage: (message: IMessage) => void,
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
        const type = Messages.Scoping.AddSelector;
        const telemetry = this.telemetryFactory.forAddSelector(event, inputType, this.source);
        const payload: IScopingPayload = {
            inputType,
            selector,
            telemetry,
        };

        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload: payload,
        });
    }

    @autobind
    public deleteSelector(event: React.MouseEvent<HTMLElement> | MouseEvent, inputType: string, selector: string[]): void {
        const type = Messages.Scoping.DeleteSelector;
        const telemetry = this.telemetryFactory.forDeleteSelector(event, inputType, this.source);
        const payload: IScopingPayload = {
            inputType,
            selector,
            telemetry,
        };

        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload: payload,
        });
    }
}
