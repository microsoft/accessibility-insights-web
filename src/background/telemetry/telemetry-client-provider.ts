// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
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
import { TelemetryClient } from './telemetry-client';

export const getTelemetryClient = (
    applicationTelemetryDataFactory: ApplicationTelemetryDataFactory,
    baseClients: TelemetryClient[],
): TelemetryClient => {
    const clients = [...baseClients];

    const appInsightsInstrumentationKey = config.getOption('appInsightsInstrumentationKey');

    if (appInsightsInstrumentationKey != null) {
        const applicationInsights = new ApplicationInsights({
            config: {
                instrumentationKey: config.getOption('appInsightsInstrumentationKey'),
                disableTelemetry: true,
                disableAjaxTracking: true,
                disableFetchTracking: true,
            },
        });
        clients.push(
            new AppInsightsTelemetryClient(applicationTelemetryDataFactory, applicationInsights),
        );
    }

    return new MultiplexingTelemetryClient(clients);
};

export const getApplicationTelemetryDataFactory = (
    installationData: InstallationData,
    storageAdapter: StorageAdapter,
    appDataAdapter: AppDataAdapter,
    applicationName: string,
) => {
    const installDataGenerator = new InstallDataGenerator(
        installationData,
        generateUID,
        DateProvider.getCurrentDate,
        storageAdapter,
    );

    const applicationBuildGenerator = new ApplicationBuildGenerator();
    return new ApplicationTelemetryDataFactory(
        appDataAdapter.getVersion(),
        applicationName,
        applicationBuildGenerator.getBuild(),
        installDataGenerator,
    );
};
