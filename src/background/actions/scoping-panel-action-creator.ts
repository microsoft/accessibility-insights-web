// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SCOPING_CLOSE, SCOPING_OPEN } from 'common/extension-telemetry-events';
import { createDefaultLogger } from 'common/logging/default-logger';
import { Logger } from 'common/logging/logger';
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
        private readonly logger: Logger = createDefaultLogger(),
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

    private async onOpenScopingPanel(payload: BaseActionPayload, tabId: number): Promise<void> {
        this.scopingActions.openScopingPanel.invoke(null);
        await this.detailsViewController.showDetailsViewP(tabId).catch(this.logger.error);
        this.telemetryEventHandler.publishTelemetry(SCOPING_OPEN, payload);
    }

    private onCloseScopingPanel(payload: BaseActionPayload): void {
        this.scopingActions.closeScopingPanel.invoke(null);
        this.telemetryEventHandler.publishTelemetry(SCOPING_CLOSE, payload);
    }
}
