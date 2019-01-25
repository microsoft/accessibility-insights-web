// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagsController } from '../feature-flags-controller';
import { TelemetryBaseData } from './app-insights-telemetry-client';

export class TelemetryLogger {
    private featureFlagsController: FeatureFlagsController;

    public initialize(featureFlagsController: FeatureFlagsController) {
        this.featureFlagsController = featureFlagsController;
    }

    public log(data: TelemetryBaseData): void {
        if (this.featureFlagsController.isEnabled(FeatureFlags.logTelemetryToConsole)) {
            console.log('eventName: ', data.name, '; customProperties: ', data.properties);
        }
    }
}
