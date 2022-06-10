// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter, OptionalMessageResponse } from 'common/browser-adapters/browser-adapter';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { StoreUpdateMessage } from 'common/types/store-update-message';
import { TelemetryListener } from 'debug-tools/controllers/telemetry-listener';

export class DebugToolsMessageDistributor {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly storeUpdateMessageHub: StoreUpdateMessageHub,
        private readonly telemetryListener: TelemetryListener,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnMessage(this.distributeMessage);
    }

    private distributeMessage = (message: any): OptionalMessageResponse => {
        this.telemetryListener.onTelemetryMessage(message);
        return this.storeUpdateMessageHub.handleMessage(message as StoreUpdateMessage<unknown>);
    };
}
