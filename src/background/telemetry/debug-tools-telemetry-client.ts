// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagChecker } from 'background/feature-flag-checker';
import { ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { TelemetryClient } from 'background/telemetry/telemetry-client';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { FeatureFlags } from 'common/feature-flags';
import { Messages } from 'common/messages';

export class DebugToolsTelemetryClient implements TelemetryClient {
    private featureFlagChecker: FeatureFlagChecker;

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly telemetryDataFactory: ApplicationTelemetryDataFactory,
    ) {}

    public initialize(featureFlagChecker: FeatureFlagChecker): void {
        this.featureFlagChecker = featureFlagChecker;
    }

    public enableTelemetry(): void {
        // no-op as we always want to send telemetry to the debug tools page (if feature flag is enabled)
    }

    public disableTelemetry(): void {
        // no-op as we always want to send telemetry to the debug tools page (if feature flag is enabled)
    }

    public trackEvent(name: string, properties?: Object): void {
        if (this.featureFlagChecker?.isEnabled(FeatureFlags.debugTools)) {
            const finalProperties = {
                ...properties,
                ...this.telemetryDataFactory.getData(),
            };

            // We intentionally don't wait for results and throw away rejections;
            // we would rather drop debug tools telemetry than deal with async
            // reentrancy issues with the exception listener that sends telemetry
            // error.
            void this.browserAdapter
                .sendRuntimeMessage({
                    messageType: Messages.DebugTools.Telemetry,
                    name,
                    properties: finalProperties,
                })
                .catch(() => {
                    /* intentional no-op */
                });
        }
    }
}
