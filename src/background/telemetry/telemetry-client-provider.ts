// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from '../../common/browser-adapters/app-data-adapter';
import { StorageAdapter } from '../../common/browser-adapters/storage-adapter';
import { config } from '../../common/configuration';
import { DateProvider } from '../../common/date-provider';
import { generateUID } from '../../common/uid-generator';
import { ApplicationBuildGenerator } from '../application-build-generator';
import { InstallDataGenerator } from '../install-data-generator';
import { InstallationData } from '../installation-data';
import { AppInsightsTelemetryClient } from './app-insights-telemetry-client';
import { ApplicationTelemetryDataFactory } from './application-telemetry-data-factory';
import { NullTelemetryClient } from './null-telemetry-client';
import { TelemetryClient } from './telemetry-client';
import { TelemetryLogger } from './telemetry-logger';

export const getTelemetryClient = (
    applicationName: string,
    installationData: InstallationData,
    appDataAdapter: AppDataAdapter,
    logger: TelemetryLogger,
    appInsights: Microsoft.ApplicationInsights.IAppInsights,
    storageAdapter: StorageAdapter,
): TelemetryClient => {
    const installDataGenerator = new InstallDataGenerator(
        installationData,
        generateUID,
        DateProvider.getCurrentDate,
        storageAdapter,
    );
    const applicationBuildGenerator = new ApplicationBuildGenerator();
    const coreTelemetryDataFactory = new ApplicationTelemetryDataFactory(
        appDataAdapter.getVersion(),
        applicationName,
        applicationBuildGenerator.getBuild(),
        installDataGenerator,
    );

    const appInsightsInstrumentationKey = config.getOption(
        'appInsightsInstrumentationKey',
    );

    if (appInsightsInstrumentationKey == null) {
        return new NullTelemetryClient(coreTelemetryDataFactory, logger);
    }

    return new AppInsightsTelemetryClient(
        appInsights,
        coreTelemetryDataFactory,
        logger,
    );
};
