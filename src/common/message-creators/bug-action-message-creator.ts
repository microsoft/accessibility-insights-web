// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from '../../background/actions/action-payloads';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { FILE_ISSUE_CLICK, FileIssueClickService, TelemetryEventSource } from '../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class BugActionMessageCreator extends BaseActionMessageCreator {
    constructor(
        postMessage: (message: Message) => void,
        tabId: number,
        private telemetryFactory: TelemetryDataFactory,
        private source: TelemetryEventSource,
    ) {
        super(postMessage, tabId);
    }

    public openSettingsPanel(event: React.MouseEvent<HTMLElement>): void {
        const messageType = Messages.SettingsPanel.OpenPanel;
        const telemetry = this.telemetryFactory.forSettingsPanelOpen(event, this.source, 'fileIssueSettingsPrompt');
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    public trackFileIssueClick(event: React.MouseEvent<HTMLElement>, service: FileIssueClickService): void {
        const telemetry = this.telemetryFactory.forFileIssueClick(event, this.source, service);
        this.sendTelemetry(FILE_ISSUE_CLICK, telemetry);
    }
}
