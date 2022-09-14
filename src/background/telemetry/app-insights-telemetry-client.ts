// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ApplicationInsights, ITelemetryItem } from '@microsoft/applicationinsights-web';
import { Initialization } from '@microsoft/applicationinsights-web/types/Initialization';
import { ApplicationTelemetryDataFactory } from './application-telemetry-data-factory';
import { TelemetryBaseData } from './telemetry-base-data';
import { TelemetryClient } from './telemetry-client';
export type ITelemetryContext = Initialization['context'];
export type ITelemetryTrace = ITelemetryContext['telemetryTrace'];
export interface TelemetryData {
    baseData: TelemetryBaseData;
}

export class AppInsightsTelemetryClient implements TelemetryClient {
    private initialized: boolean;
    private enabled: boolean;

    constructor(
        private readonly coreTelemetryDataFactory: ApplicationTelemetryDataFactory,
        private readonly applicationInsights: ApplicationInsights,
    ) {}

    public enableTelemetry(): void {
        if (!this.enabled) {
            this.initialize();

            this.enabled = true;
            this.updateTelemetryState();
        }
    }

    public disableTelemetry(): void {
        if (!this.enabled) return;

        this.enabled = false;
        this.updateTelemetryState();
    }

    public trackEvent(name: string, properties?: { [name: string]: string }): void {
        if (this.enabled) {
            this.applicationInsights.trackEvent({ name }, properties);
        }
    }

    private updateTelemetryState(): void {
        this.applicationInsights.config.disableTelemetry = !this.enabled;
    }

    private initialize(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.applicationInsights.loadAppInsights();
        if (this.applicationInsights.context.telemetryTrace) {
            this.applicationInsights.context.telemetryTrace.name = '';
        }
        this.applicationInsights.addTelemetryInitializer((telemetryItem: ITelemetryItem) => {
            const originalBaseData = telemetryItem?.baseData ?? {};
            telemetryItem.baseData = {
                ...originalBaseData,
                properties: {
                    ...originalBaseData.properties,
                    ...this.coreTelemetryDataFactory.getData(),
                },
            };
            // returning either true or void signals a successful initialization
            // so we are being explicit
            return true;
        });
    }
}
