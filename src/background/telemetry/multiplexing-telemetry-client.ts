// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryClient } from 'background/telemetry/telemetry-client';

export class MultiplexingTelemetryClient implements TelemetryClient {
    constructor(private readonly wrappedClients: TelemetryClient[]) {}

    public enableTelemetry(): void {
        this.wrappedClients.forEach(c => c.enableTelemetry());
    }

    public disableTelemetry(): void {
        this.wrappedClients.forEach(c => c.disableTelemetry());
    }

    public trackEvent(name: string, properties?: Object): void {
        this.wrappedClients.forEach(c => c.trackEvent(name, properties));
    }
}
