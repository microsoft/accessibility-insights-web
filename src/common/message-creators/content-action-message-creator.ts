// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { BaseActionPayload } from '../../background/actions/action-payloads';
import { ContentPayload } from '../../background/actions/content-actions';
import { ActionInitiators } from '../action/action-initiator';
import { Messages } from '../messages';
import { TelemetryDataFactory } from '../telemetry-data-factory';
import { CONTENT_HYPERLINK_OPENED, CONTENT_PAGE_OPENED, TelemetryEventSource } from '../telemetry-events';
import { ActionMessageDispatcher } from './action-message-dispatcher';

export class ContentActionMessageCreator {
    public initiators: Pick<ActionInitiators, 'openExternalLink'> = {
        openExternalLink: this.openExternalLink,
    };

    constructor(
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly source: TelemetryEventSource,
        private readonly dispatcher: ActionMessageDispatcher,
    ) {}

    @autobind
    public openContentPage(event: React.MouseEvent<any> | MouseEvent, contentPath: string): void {
        const messageType = Messages.Telemetry.Send;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload = {
            eventName: CONTENT_PAGE_OPENED,
            telemetry: { ...telemetry, contentPath },
        };

        this.dispatcher.dispatchMessage({
            messageType,
            payload,
        });
    }

    @autobind
    public openContentHyperLink(event: React.MouseEvent<any> | MouseEvent, href: string): void {
        const messageType = Messages.Telemetry.Send;
        const telemetry = this.telemetryFactory.withTriggeredByAndSource(event, this.source);
        const payload = {
            eventName: CONTENT_HYPERLINK_OPENED,
            telemetry: { ...telemetry, href },
        };
        this.dispatcher.dispatchMessage({
            messageType: messageType,
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

        this.dispatcher.dispatchMessage({
            messageType,
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

        this.dispatcher.dispatchMessage({
            messageType: messageType,
            payload,
        });
    }

    @autobind
    private openExternalLink(event: React.MouseEvent<any> | MouseEvent, details: { href: string }): void {
        this.openContentHyperLink(event, details.href);
    }
}
