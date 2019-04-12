// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { RegisterTypeToPayloadCallback } from '../../common/message';
import { Messages } from '../../common/messages';
import * as TelemetryEvents from '../../common/telemetry-events';
import { BrowserAdapter } from '../browser-adapter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { DetailsViewController } from './../details-view-controller';
import { BaseActionPayload, OpenIssueFilingSettingsDialogPayload, OpenNewWindowPayload } from './action-payloads';
import { IssueFilingActions } from './issue-filing-actions';

export class IssueFilingActionCreator {
    constructor(
        private issueFilingActions: IssueFilingActions,
        private browserAdapter: BrowserAdapter,
        private telemetryEventHandler: TelemetryEventHandler,
        private registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
        private detailsViewController: DetailsViewController,
    ) {}

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.IssueFiling.OpenDialog, this.onOpenIssueFilingDialog);
        this.registerTypeToPayloadCallback(Messages.IssueFiling.CloseDialog, this.onCloseIssueFilingDialog);
        this.registerTypeToPayloadCallback(Messages.IssueFiling.OpenNewWindow, this.onOpenNewWindowForIssueFiling);
    }

    @autobind
    private onOpenIssueFilingDialog(payload: OpenIssueFilingSettingsDialogPayload, tabId: number): void {
        this.issueFilingActions.openIssueFilingSettingsDialog.invoke(payload);
        this.detailsViewController.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ISSUE_FILING_SETTINGS_DIALOG_OPEN, payload);
    }

    @autobind
    private onCloseIssueFilingDialog(payload: BaseActionPayload): void {
        this.issueFilingActions.closeIssueFilingSettingsDialog.invoke(null);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ISSUE_FILING_SETTINGS_DIALOG_CLOSE, payload);
    }

    @autobind
    private onOpenNewWindowForIssueFiling(payload: OpenNewWindowPayload): void {
        this.browserAdapter.createTabInNewWindow(payload.url);
        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.ISSUE_FILING_WINDOW_OPEN, payload);
    }
}
