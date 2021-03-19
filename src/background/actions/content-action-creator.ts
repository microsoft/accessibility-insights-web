// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CONTENT_PANEL_CLOSED, CONTENT_PANEL_OPENED } from 'common/extension-telemetry-events';
import { createDefaultLogger } from 'common/logging/default-logger';
import { Logger } from 'common/logging/logger';
import { Messages } from 'common/messages';
import { ExtensionDetailsViewController } from '../extension-details-view-controller';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';
import { ContentActions, ContentPayload } from './content-actions';

export class ContentActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly contentActions: ContentActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly detailsViewController: ExtensionDetailsViewController,
        private readonly logger: Logger = createDefaultLogger(),
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.ContentPanel.OpenPanel,
            this.onOpenContentPanel,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.ContentPanel.ClosePanel,
            this.onCloseContentPanel,
        );
    }

    private onOpenContentPanel = async (payload: ContentPayload, tabId: number): Promise<void> => {
        this.contentActions.openContentPanel.invoke(payload);
        await this.detailsViewController.showDetailsView(tabId).catch(this.logger.error);
        this.telemetryEventHandler.publishTelemetry(CONTENT_PANEL_OPENED, payload);
    };

    private onCloseContentPanel = (payload: BaseActionPayload): void => {
        this.contentActions.closeContentPanel.invoke();
        this.telemetryEventHandler.publishTelemetry(CONTENT_PANEL_CLOSED, payload);
    };
}
