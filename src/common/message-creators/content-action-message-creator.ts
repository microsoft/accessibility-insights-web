// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { BaseActionPayload } from '../../background/actions/action-payloads';
import { ContentPayload } from '../../background/actions/content-actions';
import { ActionInitiators } from '../action/action-initiator';
import { Message } from '../message';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { CONTENT_HYPERLINK_OPENED, CONTENT_PAGE_OPENED, TelemetryEventSource } from '../telemetry-events';
import { BaseActionMessageCreator } from './base-action-message-creator';

export class ContentActionMessageCreator extends BaseActionMessageCreator {
    public initiators: Pick<ActionInitiators, 'openExternalLink'> = {
        openExternalLink: this.openExternalLink,
    };

    constructor(
        postMessage: (message: Message) => void,
        tabId: number,
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
    ) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
        this.source = source;
    }

    @autobind
    public openContentPage(event: React.MouseEvent<any> | MouseEvent, contentPath: string): void {
        const messageType = Messages.Telemetry.Send;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload = {
            eventName: CONTENT_PAGE_OPENED,
            telemetry: { ...telemetry, contentPath },
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    private openExternalLink(event: React.MouseEvent<any> | MouseEvent, details: { href: string }): void {
        this.openContentHyperLink(event, details.href);
    }

    @autobind
    public openContentHyperLink(event: React.MouseEvent<any> | MouseEvent, href: string): void {
        const messageType = Messages.Telemetry.Send;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload = {
            eventName: CONTENT_HYPERLINK_OPENED,
            telemetry: { ...telemetry, href },
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public openContentPanel(event: React.MouseEvent<HTMLElement> | MouseEvent, contentPath: string): void {
        const messageType = Messages.ContentPanel.OpenPanel;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload: ContentPayload = {
            telemetry,
            contentPath,
        };
        this.dispatchMessage({
            type: messageType,
            tabId: this._tabId,
            payload,
        });
    }

    @autobind
    public closeContentPanel(): void {
        const messageType = Messages.ContentPanel.ClosePanel;
        const telemetry = this.telemetryFactory.fromDetailsViewNoTriggeredBy();
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
