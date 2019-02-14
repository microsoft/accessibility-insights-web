// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryBaseData } from './telemetry-base-data';
import { TelemetryClient } from './telemetry-client';
import { TelemetryLogger } from './telemetry-logger';

export class NullTelemetryClient implements TelemetryClient {
    constructor(private readonly logger: TelemetryLogger) {}

    public enableTelemetry(): void {
        // no op
    }
    public disableTelemetry(): void {
        // no op
    }
    public trackEvent(name: string, properties?: { [name: string]: string }): void {
        const data: TelemetryBaseData = {
            name,
            properties,
        };

        this.logger.log(data);
    }
}
