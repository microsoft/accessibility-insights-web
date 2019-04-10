// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from '../../background/actions/action-payloads';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { TelemetryEventSource } from '../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class DropdownActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;

    constructor(postMessage: (message: Message) => void, tabId: number, telemetryFactory: TelemetryDataFactory) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
    }

    public openPreviewFeaturesPanel(event: React.MouseEvent<HTMLElement>, source: TelemetryEventSource): void {
        const messageType = Messages.PreviewFeatures.OpenPanel;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, source);
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    public openScopingPanel(event: React.MouseEvent<HTMLElement>, source: TelemetryEventSource): void {
        const messageType = Messages.Scoping.OpenPanel;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, source);
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    public openSettingsPanel(event: React.MouseEvent<HTMLElement>, source: TelemetryEventSource): void {
        const messageType = Messages.SettingsPanel.OpenPanel;
        const telemetry = this.telemetryFactory.forSettingsPanelOpen(event, source, 'menu');
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }
}
