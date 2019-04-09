// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { Messages } from '../../common/messages';
import { SCOPING_CLOSE, SCOPING_OPEN } from '../../common/telemetry-events';
import { DetailsViewController } from '../details-view-controller';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';
import { ScopingActions } from './scoping-actions';

export class ScopingActionCreator {
    private scopingActions: ScopingActions;
    private registerTypeToPayloadCallback: RegisterTypeToPayloadCallback;
    private telemetryEventHandler: TelemetryEventHandler;
    private detailsViewController: DetailsViewController;

    constructor(
        scopingActions: ScopingActions,
        telemetryEventHandler: TelemetryEventHandler,
        registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
        detailsViewController: DetailsViewController,
    ) {
        this.scopingActions = scopingActions;
        this.telemetryEventHandler = telemetryEventHandler;
        this.detailsViewController = detailsViewController;
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.Scoping.OpenPanel, (payload, tabId) => this.onOpenScopingPanel(payload, tabId));
        this.registerTypeToPayloadCallback(Messages.Scoping.ClosePanel, payload => this.onCloseScopingPanel(payload));
    }

    private onOpenScopingPanel(payload: BaseActionPayload, tabId: number): void {
        this.scopingActions.openScopingPanel.invoke(null);
        this.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(SCOPING_OPEN, payload);
    }

    private onCloseScopingPanel(payload: BaseActionPayload): void {
        this.scopingActions.closeScopingPanel.invoke(null);
        this.telemetryEventHandler.publishTelemetry(SCOPING_CLOSE, payload);
    }

    private showDetailsView(tabId: number): void {
        this.detailsViewController.showDetailsView(tabId);
    }
}
