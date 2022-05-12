// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallationData } from 'background/installation-data';
import { ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { MultiplexingTelemetryClient } from 'background/telemetry/multiplexing-telemetry-client';
import { TelemetryClient } from 'background/telemetry/telemetry-client';
import {
    getApplicationTelemetryDataFactory,
    getTelemetryClient,
} from 'background/telemetry/telemetry-client-provider';
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { configMutator } from 'common/configuration';
import { Mock } from 'typemoq';

describe('TelemetryClientProvider', () => {
    describe('getTelemetryClient', () => {
        const baseClients = [
            Mock.ofType<TelemetryClient>().object,
            Mock.ofType<TelemetryClient>().object,
        ];

        const baseClientsCount = baseClients.length;

        beforeEach(() => configMutator.reset());

        afterAll(() => configMutator.reset());

        it('builds a telemetry client using the instrumentation key', () => {
            configMutator.setOption('appInsightsInstrumentationKey', 'test-key');

            const appAdapterMock = Mock.ofType<AppDataAdapter>();

            appAdapterMock.setup(adapter => adapter.getVersion()).returns(() => 'test');

            const result = getTelemetryClient(
                Mock.ofType<ApplicationTelemetryDataFactory>().object,
                baseClients,
            );

            expect(result).toBeInstanceOf(MultiplexingTelemetryClient);
            expect(result).toHaveProperty('wrappedClients.length', baseClientsCount + 1);
        });

        it('builds a telemetry client when there is no instrumentation key', () => {
            configMutator.setOption('appInsightsInstrumentationKey', null);

            const result = getTelemetryClient(
                Mock.ofType<ApplicationTelemetryDataFactory>().object,
                baseClients,
            );

            expect(result).toBeInstanceOf(MultiplexingTelemetryClient);
            expect(result).toHaveProperty('wrappedClients.length', baseClientsCount);
        });
    });

    it('build an application telemetry data factory', () => {
        const installationData: InstallationData = {
            id: 'test-id',
            month: 9,
            year: 2019,
        };

        const applicationName = 'test application name';

        const result = getApplicationTelemetryDataFactory(
            installationData,
            Mock.ofType<StorageAdapter>().object,
            Mock.ofType<AppDataAdapter>().object,
            applicationName,
        );

        expect(result).toBeInstanceOf(ApplicationTelemetryDataFactory);
    });
});
