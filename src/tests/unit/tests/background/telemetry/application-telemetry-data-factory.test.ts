// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallDataGenerator } from 'background/install-data-generator';
import {
    ApplicationTelemetryData,
    ApplicationTelemetryDataFactory,
} from 'background/telemetry/application-telemetry-data-factory';
import { IMock, Mock } from 'typemoq';

describe('ApplicationTelemetryDataFactoryTest', () => {
    const applicationBuild: string = 'application build id';
    const applicationVersion: string = 'application version';
    const applicationName: string = 'application name';
    const installationId: string = 'installation id';

    let installDataGeneratorMock: IMock<InstallDataGenerator>;

    let testSubject: ApplicationTelemetryDataFactory;

    beforeEach(() => {
        installDataGeneratorMock = Mock.ofType(InstallDataGenerator);
        installDataGeneratorMock
            .setup(generator => generator.getInstallationId())
            .returns(() => installationId)
            .verifiable();

        testSubject = new ApplicationTelemetryDataFactory(
            applicationVersion,
            applicationName,
            applicationBuild,
            installDataGeneratorMock.object,
        );
    });

    test('verifyCoreData', () => {
        const expectedData: ApplicationTelemetryData = {
            installationId,
            applicationBuild,
            applicationName,
            applicationVersion,
        };
        expect(testSubject.getData()).toEqual(expectedData);
    });

    test('getData should return new instance', () => {
        expect(testSubject.getData()).not.toBe(testSubject.getData());
    });
});
