// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { TelemetryEventSource } from './../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class BugActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;

    constructor(postMessage: (message: IMessage) => void, tabId: number, telemetryFactory: TelemetryDataFactory) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
    }

    public openSettingsPanel(event: React.MouseEvent<HTMLElement>, source: TelemetryEventSource): void {
        const type = Messages.SettingsPanel.OpenPanel;
        const telemetry = this.telemetryFactory.withSourceAndTriggeredBy(event, source);
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: type,
            tabId: this._tabId,
            payload,
        });
    }
}
