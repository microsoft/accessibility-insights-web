// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config } from '../common/configuration';

export class ApplicationBuildGenerator {
    public getBuild(): string {
        return config.getOption('telemetryBuildName');
    }
}
