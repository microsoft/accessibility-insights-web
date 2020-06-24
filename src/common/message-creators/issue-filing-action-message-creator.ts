// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload, FileIssuePayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';

import { ToolData } from 'common/types/store-data/unified-data-interface';
import { TelemetryEventSource } from 'common/types/telemetry-data';
import { FILE_ISSUE_CLICK } from '../extension-telemetry-events';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';

type SupportedMouseEvent = React.MouseEvent<HTMLElement> | React.SyntheticEvent<Element, Event>;

export class IssueFilingActionMessageCreator {
    constructor(
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
    ) {}

    public openSettingsPanel(event: React.MouseEvent<HTMLElement>): void {
        const messageType = Messages.SettingsPanel.OpenPanel;
        const telemetry = this.telemetryFactory.forSettingsPanelOpen(
            event,
            this.source,
            'fileIssueSettingsPrompt',
        );
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    }

    public trackFileIssueClick(event: React.MouseEvent<HTMLElement>, service: string): void {
        const telemetry = this.telemetryFactory.forFileIssueClick(event, this.source, service);
        this.dispatcher.sendTelemetry(FILE_ISSUE_CLICK, telemetry);
    }

    public fileIssue(
        event: SupportedMouseEvent,
        serviceKey: string,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ): void {
        const messageType = Messages.IssueFiling.FileIssue;
        const telemetry = this.telemetryFactory.forFileIssueClick(event, this.source, serviceKey);
        const payload: FileIssuePayload = {
            telemetry,
            issueData,
            service: serviceKey,
            toolData,
        };
        const message: Message = {
            messageType,
            payload,
        };
        this.dispatcher.dispatchMessage(message);
    }
}
