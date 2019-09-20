// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallDataGenerator } from '../install-data-generator';
import { title } from './../../content/strings/application';

export interface ApplicationTelemetryData {
    applicationVersion: string;
    applicationName: string;
    applicationBuild: string;
    installationId: string;
}

export class ApplicationTelemetryDataFactory {
    constructor(
        private readonly version: string,
        private readonly build: string,
        private readonly installDataGenerator: InstallDataGenerator,
    ) {}

    public getData(): ApplicationTelemetryData {
        return {
            applicationVersion: this.version,
            applicationName: title,
            applicationBuild: this.build,
            installationId: this.installDataGenerator.getInstallationId(),
        };
    }
}
