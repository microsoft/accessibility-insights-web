// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MultiplexingTelemetryClient } from 'background/telemetry/multiplexing-telemetry-client';
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
import { ConsoleTelemetryClient } from './console-telemetry-client';
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

    const clients: TelemetryClient[] = [
        new ConsoleTelemetryClient(coreTelemetryDataFactory, logger),
    ];

    const appInsightsInstrumentationKey = config.getOption('appInsightsInstrumentationKey');

    if (appInsightsInstrumentationKey != null) {
        clients.push(new AppInsightsTelemetryClient(appInsights, coreTelemetryDataFactory));
    }

    return new MultiplexingTelemetryClient(clients);
};
