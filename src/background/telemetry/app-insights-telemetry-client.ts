// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config } from '../../common/configuration';
import { ApplicationTelemetryDataFactory } from './application-telemetry-data-factory';
import { TelemetryClient } from './telemetry-client';
import { TelemetryLogger } from './telemetry-logger';

export interface TelemetryBaseData {
    name: string;
    properties: IDictionaryStringTo<string>;
}

export interface TelemetryData {
    baseData: TelemetryBaseData;
}

export interface ExtendedEnvelop extends Microsoft.ApplicationInsights.IEnvelope {
    data: TelemetryData;
}

export class AppInsightsTelemetryClient implements TelemetryClient {
    private initialized: boolean;
    private enabled: boolean;

    constructor(
        private readonly appInsights: Microsoft.ApplicationInsights.IAppInsights,
        private readonly coreTelemetryDataFactory: ApplicationTelemetryDataFactory,
        private readonly logger: TelemetryLogger,
    ) {
    }

    private initialize() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.appInsights.downloadAndSetup({
            instrumentationKey: config.getOption('appInsightsInstrumentationKey'),
            // start with telemetry disabled, to avoid sending past queued telemetry data
            disableTelemetry: true,
        });

        this.appInsights.queue.push(() => {
            this.initializeInternal();
        });
    }

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

    private updateTelemetryState() {
        if (this.appInsights.queue) {
            this.appInsights.queue.push(() => {
                this.appInsights.config.disableTelemetry = !this.enabled;
            });
        }
        else {
            this.appInsights.config.disableTelemetry = !this.enabled;
        }
    }

    private initializeInternal() {
        this.appInsights.context.addTelemetryInitializer((envelope: ExtendedEnvelop) => {
            const baseData = envelope.data.baseData;
            baseData.properties = {
                ...baseData.properties,
                ...this.coreTelemetryDataFactory.getData(),
            };

            this.logger.log(baseData);
            return true;
        });
    }
}
