// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { TelemetryClient } from 'background/telemetry/telemetry-client';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ConnectionNames } from 'common/constants/connection-names';

export class DebugToolsTelemetryClient implements TelemetryClient {
    private connections: chrome.runtime.Port[] = [];

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly telemetryDataFactory: ApplicationTelemetryDataFactory,
    ) {}

    public initialize(): void {
        this.browserAdapter.addListenerOnConnect((connection: chrome.runtime.Port) => {
            if (connection.name !== ConnectionNames.debugToolsTelemetry) {
                return;
            }

            connection.onDisconnect.addListener(() => {
                this.connections = this.connections.filter(current => current !== connection);
            });

            this.connections.push(connection);
        });
    }

    public enableTelemetry(): void {
        // no-op as we always want to send telemetry to the debug tools page (if there is a connection)
    }

    public disableTelemetry(): void {
        // no-op as we always want to send telemetry to the debug tools page (if there is a connection)
    }

    public trackEvent(name: string, properties?: Object): void {
        if (this.connections.length === 0) {
            return;
        }

        const finalProperties = {
            ...properties,
            ...this.telemetryDataFactory.getData(),
        };

        this.connections.forEach(connection =>
            connection.postMessage({
                name,
                properties: finalProperties,
            }),
        );
    }
}
