// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { ApplicationBuildGenerator } from '../../../../../background/application-build-generator';
import { ChromeAdapter } from '../../../../../background/browser-adapters/browser-adapter';
import { InstallDataGenerator } from '../../../../../background/install-data-generator';
import {
    ApplicationTelemetryData,
    ApplicationTelemetryDataFactory,
} from '../../../../../background/telemetry/application-telemetry-data-factory';
import { title } from '../../../../../content/strings/application';

describe('ApplicationTelemetryDataFactoryTest', () => {
    const applicationBuildStub: string = 'application build id';
    const installationId: string = 'some id';
    let applicationBuildGeneratorMock: IMock<ApplicationBuildGenerator>;
    let installDataGeneratorMock: IMock<InstallDataGenerator>;
    let browserAdapterMock: IMock<ChromeAdapter>;
    let testSubject: ApplicationTelemetryDataFactory;

    beforeEach(() => {
        const manifestStub: chrome.runtime.Manifest = getManifestStub();

        browserAdapterMock = Mock.ofType<ChromeAdapter>();
        browserAdapterMock
            .setup(it => it.getManifest())
            .returns(() => {
                return manifestStub;
            })
            .verifiable();

        applicationBuildGeneratorMock = Mock.ofType<ApplicationBuildGenerator>();
        applicationBuildGeneratorMock
            .setup(abg => abg.getBuild())
            .returns(() => applicationBuildStub)
            .verifiable(Times.once());

        installDataGeneratorMock = Mock.ofType(InstallDataGenerator);
        installDataGeneratorMock
            .setup(idgm => idgm.getInstallationId())
            .returns(() => installationId)
            .verifiable();

        testSubject = new ApplicationTelemetryDataFactory(
            browserAdapterMock.object,
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

    function getManifestStub(): chrome.runtime.Manifest {
        return {
            version: '2',
            name: 'test',
        } as any;
    }
});
