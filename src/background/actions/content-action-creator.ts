// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CONTENT_PANEL_CLOSED, CONTENT_PANEL_OPENED } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';

import { DetailsViewController } from '../details-view-controller';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';
import { ContentActions, ContentPayload } from './content-actions';

export class ContentActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly contentActions: ContentActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly detailsViewController: DetailsViewController,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.ContentPanel.OpenPanel, this.onOpenContentPanel);
        this.interpreter.registerTypeToPayloadCallback(Messages.ContentPanel.ClosePanel, this.onCloseContentPanel);
    }

    private onOpenContentPanel = (payload: ContentPayload, tabId: number): void => {
        this.contentActions.openContentPanel.invoke(payload);
        this.showDetailsView(tabId);
        this.telemetryEventHandler.publishTelemetry(CONTENT_PANEL_OPENED, payload);
    };

    private onCloseContentPanel = (payload: BaseActionPayload): void => {
        this.contentActions.closeContentPanel.invoke(null);
        this.telemetryEventHandler.publishTelemetry(CONTENT_PANEL_CLOSED, payload);
    };

    private showDetailsView(tabId: number): void {
        this.detailsViewController.showDetailsView(tabId);
    }
}
