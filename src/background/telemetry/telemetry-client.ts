// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface TelemetryClient {
    enableTelemetry(): void;
    disableTelemetry(): void;
    trackEvent(name: string, properties?: Object): Promise<void>;
}
