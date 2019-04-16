// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from '../../background/actions/action-payloads';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { FILE_ISSUE_CLICK, FileIssueClickService, TelemetryEventSource } from '../telemetry-events';
import { ActionMessageDispatcher } from './action-message-dispatcher';

export class BugActionMessageCreator {
    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private telemetryFactory: TelemetryDataFactory,
        private source: TelemetryEventSource,
    ) {}

    public openSettingsPanel(event: React.MouseEvent<HTMLElement>): void {
        const messageType = Messages.SettingsPanel.OpenPanel;
        const telemetry = this.telemetryFactory.forSettingsPanelOpen(event, this.source, 'fileIssueSettingsPrompt');
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    }

    public trackFileIssueClick(event: React.MouseEvent<HTMLElement>, service: FileIssueClickService): void {
        const telemetry = this.telemetryFactory.forFileIssueClick(event, this.source, service);
        this.dispatcher.sendTelemetry(FILE_ISSUE_CLICK, telemetry);
    }
}
