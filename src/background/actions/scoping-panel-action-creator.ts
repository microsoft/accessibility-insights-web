// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SCOPING_CLOSE, SCOPING_OPEN } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { DetailsViewController } from '../details-view-controller';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';
import { ScopingActions } from './scoping-actions';

export class ScopingPanelActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly scopingActions: ScopingActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly detailsViewController: DetailsViewController,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Scoping.OpenPanel,
            (payload, tabId) => this.onOpenScopingPanel(payload, tabId),
        );
        this.interpreter.registerTypeToPayloadCallback(Messages.Scoping.ClosePanel, payload =>
            this.onCloseScopingPanel(payload),
        );
    }

    private onOpenScopingPanel(payload: BaseActionPayload, tabId: number): void {
        this.scopingActions.openScopingPanel.invoke(null);
        this.detailsViewController.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(SCOPING_OPEN, payload);
    }

    private onCloseScopingPanel(payload: BaseActionPayload): void {
        this.scopingActions.closeScopingPanel.invoke(null);
        this.telemetryEventHandler.publishTelemetry(SCOPING_CLOSE, payload);
    }
}
