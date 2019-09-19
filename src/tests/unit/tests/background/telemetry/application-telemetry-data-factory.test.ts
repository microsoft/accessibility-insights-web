// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ApplicationBuildGenerator } from 'background/application-build-generator';
import { InstallDataGenerator } from 'background/install-data-generator';
import { ApplicationTelemetryData, ApplicationTelemetryDataFactory } from 'background/telemetry/application-telemetry-data-factory';
import { title } from 'content/strings/application';
import { IMock, Mock, Times } from 'typemoq';
import { AppDataAdapter } from '../../../../../common/browser-adapters/app-data-adapter';

describe('ApplicationTelemetryDataFactoryTest', () => {
    const applicationBuildStub: string = 'application build id';
    const installationId: string = 'some id';
    let applicationBuildGeneratorMock: IMock<ApplicationBuildGenerator>;
    let installDataGeneratorMock: IMock<InstallDataGenerator>;
    let appAdapterMock: IMock<AppDataAdapter>;
    let testSubject: ApplicationTelemetryDataFactory;

    beforeEach(() => {
        appAdapterMock = Mock.ofType<AppDataAdapter>();
        appAdapterMock
            .setup(adapter => adapter.getVersion())
            .returns(() => '2')
            .verifiable();

        applicationBuildGeneratorMock = Mock.ofType<ApplicationBuildGenerator>();
        applicationBuildGeneratorMock
            .setup(abg => abg.getBuild())
            .returns(() => applicationBuildStub)
            .verifiable(Times.once());

        installDataGeneratorMock = Mock.ofType(InstallDataGenerator);
        installDataGeneratorMock
            .setup(generator => generator.getInstallationId())
            .returns(() => installationId)
            .verifiable();

        testSubject = new ApplicationTelemetryDataFactory(
            appAdapterMock.object,
            applicationBuildGeneratorMock.object,
            installDataGeneratorMock.object,
        );
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
