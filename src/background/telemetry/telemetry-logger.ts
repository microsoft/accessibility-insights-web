// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from '../../common/feature-flags';
import { Logger } from '../../common/logging/logger';
import { FeatureFlagChecker } from '../feature-flag-checker';
import { TelemetryBaseData } from './telemetry-base-data';

export class TelemetryLogger {
    private featureFlagChecker: FeatureFlagChecker;

    constructor(private logger: Logger) {}

    public initialize(featureFlagChecker: FeatureFlagChecker): void {
        this.featureFlagChecker = featureFlagChecker;
    }

    public log(data: TelemetryBaseData): void {
        if (this.featureFlagChecker.isEnabled(FeatureFlags.logTelemetryToConsole)) {
            this.logger.log('eventName: ', data.name, '; customProperties: ', data.properties);
        }
    }
}
