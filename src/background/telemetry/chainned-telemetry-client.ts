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

export class ChainnedTelemetryClient implements TelemetryClient {
    private nextInTheChain: ChainnedTelemetryClient;

    constructor(private readonly wrappedTelemetryClient: TelemetryClient) {}

    public enableTelemetry(): void {
        this.wrappedTelemetryClient?.enableTelemetry();
        this.nextInTheChain?.enableTelemetry();
    }

    public disableTelemetry(): void {
        this.wrappedTelemetryClient?.disableTelemetry();
        this.nextInTheChain?.disableTelemetry();
    }

    public trackEvent(name: string, properties?: Object): void {
        this.wrappedTelemetryClient?.trackEvent(name, properties);
        this.nextInTheChain?.trackEvent(name, properties);
    }

    public static fromArray(...originalClients: TelemetryClient[]): ChainnedTelemetryClient {
        const clients = [...originalClients];

        let firstInTheChain: ChainnedTelemetryClient;

        while (clients.length > 0) {
            const current = clients.pop();

            const chainned = new ChainnedTelemetryClient(current);
            chainned.nextInTheChain = firstInTheChain;

            firstInTheChain = chainned;
        }

        return firstInTheChain;
    }
}
