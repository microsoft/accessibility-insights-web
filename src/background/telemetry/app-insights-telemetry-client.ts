// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config } from '../../common/configuration';
import { ApplicationTelemetryDataFactory } from './application-telemetry-data-factory';
import { TelemetryBaseData } from './telemetry-base-data';
import { TelemetryClient } from './telemetry-client';

export interface TelemetryData {
    baseData: TelemetryBaseData;
}

export interface ExtendedEnvelope extends Microsoft.ApplicationInsights.IEnvelope {
    data: TelemetryData;
}

export class AppInsightsTelemetryClient implements TelemetryClient {
    private initialized: boolean;
    private enabled: boolean;

    constructor(
        private readonly appInsights: Microsoft.ApplicationInsights.IAppInsights,
        private readonly coreTelemetryDataFactory: ApplicationTelemetryDataFactory,
    ) {}

    public enableTelemetry(): void {
        if (!this.enabled) {
            this.initialize();

            this.enabled = true;
            this.updateTelemetryState();
        }
    }

    public disableTelemetry(): void {
        if (this.enabled) {
            this.enabled = false;
            this.updateTelemetryState();
        }
    }

    public trackEvent(name: string, properties?: { [name: string]: string }): void {
        if (this.enabled) {
            this.appInsights.trackEvent(name, properties);
        }
    }

    private initialize(): void {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.appInsights.downloadAndSetup!({
            instrumentationKey: config.getOption('appInsightsInstrumentationKey'),
            disableAjaxTracking: true,
            // start with telemetry disabled, to avoid sending past queued telemetry data
            disableTelemetry: true,
        });

        this.appInsights.queue.push(() => {
            this.initializeInternal();
        });
    }

    private updateTelemetryState(): void {
        const disableTelemetry = () => {
            this.appInsights.config.disableTelemetry = !this.enabled;
        };

        if (this.appInsights.queue) {
            this.appInsights.queue.push(disableTelemetry);
        } else {
            disableTelemetry();
        }
    }

    private initializeInternal(): void {
        this.appInsights.context.operation.name = '';
        this.appInsights.context.addTelemetryInitializer((envelope: ExtendedEnvelope) => {
            const baseData = envelope.data.baseData;
            baseData.properties = {
                ...baseData.properties,
                ...this.coreTelemetryDataFactory.getData(),
            };

            return true;
        });
    }
}
