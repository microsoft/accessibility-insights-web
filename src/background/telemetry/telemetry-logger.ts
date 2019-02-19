// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from '../../common/feature-flags';
import { createDefaultLogger } from '../../common/logging/default-logger';
import { Logger } from '../../common/logging/logger';
import { FeatureFlagsController } from '../feature-flags-controller';
import { TelemetryBaseData } from './telemetry-base-data';

export class TelemetryLogger {
    private featureFlagsController: FeatureFlagsController;

    constructor(private logger: Logger = createDefaultLogger()) {}

    public initialize(featureFlagsController: FeatureFlagsController): void {
        this.featureFlagsController = featureFlagsController;
    }

    public log(data: TelemetryBaseData): void {
        if (this.featureFlagsController.isEnabled(FeatureFlags.logTelemetryToConsole)) {
            this.logger.log('eventName: ', data.name, '; customProperties: ', data.properties);
        }
    }
}
