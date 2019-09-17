// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from '../../common/browser-adapters/app-data-adapter';
import { ApplicationBuildGenerator } from '../application-build-generator';
import { InstallDataGenerator } from '../install-data-generator';
import { title } from './../../content/strings/application';

export interface ApplicationTelemetryData {
    applicationVersion: string;
    applicationName: string;
    applicationBuild: string;
    installationId: string;
}

export class ApplicationTelemetryDataFactory {
    private readonly version: string;
    private readonly build: string;

    constructor(
        appDataAdapter: AppDataAdapter,
        buildGenerator: ApplicationBuildGenerator,
        private readonly installDataGenerator: InstallDataGenerator,
    ) {
        this.version = appDataAdapter.getVersion();
        this.build = buildGenerator.getBuild();
    }

    public getData(): ApplicationTelemetryData {
        return {
            applicationVersion: this.version,
            applicationName: title,
            applicationBuild: this.build,
            installationId: this.installDataGenerator.getInstallationId(),
        };
    }
}
