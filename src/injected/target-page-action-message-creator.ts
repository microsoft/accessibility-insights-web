// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionMessageCreator } from '../common/message-creators/base-action-message-creator';
import * as TelemetryEvents from '../common/telemetry-events';
import { TelemetryDataFactory } from './../common/telemetry-data-factory';
import { TelemetryEventSource } from './../common/telemetry-events';
import { Messages } from '../common/messages';
import { autobind } from '@uifabric/utilities';

export class TargetPageActionMessageCreator extends BaseActionMessageCreator {
    protected telemetryFactory: TelemetryDataFactory;

    constructor(postMessage: (message: IMessage) => void, tabId: number, telemetryFactory: TelemetryDataFactory) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
    }

    public scrollRequested(): void {
        this.dispatchMessage({
            type: Messages.Visualizations.Common.ScrollRequested,
        });
    }
    public openIssuesDialog(): void {
        this.sendTelemetry(TelemetryEvents.ISSUES_DIALOG_OPENED, {
            source: TelemetryEventSource.TargetPage,
            triggeredBy: 'N/A',
        });
    }

    @autobind
    public setHoveredOverSelector(selector: string[]): void {
        this.dispatchMessage({
            type: Messages.Inspect.SetHoveredOverSelector,
            tabId: this._tabId,
            payload: selector,
        });
    }

    @autobind
    public copyIssueDetailsClicked(event: React.MouseEvent<any>): void {
        const telemetryData = this.telemetryFactory.withTriggeredByAndSource(event, TelemetryEvents.TelemetryEventSource.TargetPage);
        this.sendTelemetry(TelemetryEvents.COPY_ISSUE_DETAILS, telemetryData);
    }
}
