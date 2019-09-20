// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallDataGenerator } from 'background/install-data-generator';
import { ApplicationTelemetryData, ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { title } from 'content/strings/application';
import { IMock, Mock } from 'typemoq';

describe('ApplicationTelemetryDataFactoryTest', () => {
    const applicationBuildStub: string = 'application build id';
    const installationId: string = 'some id';

    let installDataGeneratorMock: IMock<InstallDataGenerator>;

    let testSubject: ApplicationTelemetryDataFactory;

    beforeEach(() => {
        installDataGeneratorMock = Mock.ofType(InstallDataGenerator);
        installDataGeneratorMock
            .setup(generator => generator.getInstallationId())
            .returns(() => installationId)
            .verifiable();

        testSubject = new ApplicationTelemetryDataFactory('2', applicationBuildStub, installDataGeneratorMock.object);
    });

    test('verifyCoreData', () => {
        const expectedData: ApplicationTelemetryData = {
            installationId: installationId,
            applicationBuild: applicationBuildStub,
            applicationName: title,
            applicationVersion: '2',
        };
        expect(testSubject.getData()).toEqual(expectedData);
    });

    test('getData should return new instance', () => {
        expect(testSubject.getData()).not.toBe(testSubject.getData());
    });
});
