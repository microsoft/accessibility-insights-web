// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InstallDataGenerator } from 'background/install-data-generator';
import { InstallationData } from 'background/installation-data';
import { LocalStorageDataKeys } from 'background/local-storage-data-keys';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { generateUID } from 'common/uid-generator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('InstallDataGeneratorTest', () => {
    let generateGuidMock: IMock<() => string>;
    let dateGetterMock: IMock<() => Date>;
    let storageAdapterMock: IMock<StorageAdapter>;
    let dateStubMock: IMock<Date>;

    beforeEach(() => {
        const dateStub = {
            getUTCFullYear: () => {
                return null;
            },
            getUTCMonth: () => {
                return null;
            },
        };

        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        dateGetterMock = Mock.ofInstance<() => Date>(() => {
            return null;
        }, MockBehavior.Strict);
        storageAdapterMock = Mock.ofType<StorageAdapter>(undefined, MockBehavior.Strict);
        dateStubMock = Mock.ofInstance(dateStub as Date);
    });

    test('getInstallationId: initialInstallationData is null', () => {
        const initialInstallationData = null;
        const guidStub = 'somestub';
        const monthStub = 5;
        const yearStub = 22;
        const installationDataStub: InstallationData = {
            id: guidStub,
            month: monthStub,
            year: yearStub,
        };

        const testSubject = createTestObject(initialInstallationData);

        dateStubMock
            .setup(ds => ds.getUTCMonth())
            .returns(() => monthStub)
            .verifiable();

        dateStubMock
            .setup(ds => ds.getUTCFullYear())
            .returns(() => yearStub)
            .verifiable();

        dateGetterMock
            .setup(dgm => dgm())
            .returns(() => dateStubMock.object)
            .verifiable();

        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable();

        storageAdapterMock
            .setup(bam =>
                bam.setUserData(
                    It.isValue({ [LocalStorageDataKeys.installationData]: installationDataStub }),
                ),
            )
            .returns(() => Promise.resolve());

        expect(testSubject.getInstallationId()).toEqual(guidStub);
        verifyMocks();
    });

    test('getInstallationId: initialInstallationData is from same month different year', () => {
        const guidStub = 'somestub';
        const monthStub = 5;
        const yearStub = 2000;

        const installationDataStub: InstallationData = {
            id: guidStub,
            month: monthStub,
            year: yearStub,
        };
        const initialInstallationData: InstallationData = {
            id: guidStub,
            month: monthStub,
            year: 1999,
        };

        const testSubject = createTestObject(initialInstallationData);

        dateStubMock
            .setup(ds => ds.getUTCMonth())
            .returns(() => monthStub)
            .verifiable(Times.exactly(2));

        dateStubMock
            .setup(ds => ds.getUTCFullYear())
            .returns(() => yearStub)
            .verifiable(Times.exactly(2));

        dateGetterMock
            .setup(dgm => dgm())
            .returns(() => dateStubMock.object)
            .verifiable();

        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable();

        storageAdapterMock
            .setup(bam =>
                bam.setUserData(
                    It.isValue({ [LocalStorageDataKeys.installationData]: installationDataStub }),
                ),
            )
            .returns(() => Promise.resolve());

        expect(testSubject.getInstallationId()).toEqual(guidStub);
        verifyMocks();
    });

    test('getInstallationId: initialInstallationData is from same year different month', () => {
        const guidStub = 'somestub';
        const monthStub = 5;
        const yearStub = 2000;

        const installationDataStub: InstallationData = {
            id: guidStub,
            month: monthStub,
            year: yearStub,
        };
        const initialInstallationData: InstallationData = {
            id: guidStub,
            month: 4,
            year: yearStub,
        };

        const testSubject = createTestObject(initialInstallationData);

        dateStubMock
            .setup(ds => ds.getUTCMonth())
            .returns(() => monthStub)
            .verifiable(Times.exactly(2));

        dateStubMock
            .setup(ds => ds.getUTCFullYear())
            .returns(() => yearStub)
            .verifiable(Times.exactly(2));

        dateGetterMock
            .setup(dgm => dgm())
            .returns(() => dateStubMock.object)
            .verifiable();

        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable();

        storageAdapterMock
            .setup(bam =>
                bam.setUserData(
                    It.isValue({ [LocalStorageDataKeys.installationData]: installationDataStub }),
                ),
            )
            .returns(() => Promise.resolve());

        expect(testSubject.getInstallationId()).toEqual(guidStub);
        verifyMocks();
    });

    test('getInstallationId: initialInstallationData is valid/same month and year', () => {
        const monthStub = 3;
        const yearStub = 2222;
        const guidStub = 'someId';
        const initialInstallationData = {
            id: guidStub,
            month: monthStub,
            year: yearStub,
        };

        const testSubject = createTestObject(initialInstallationData);

        dateStubMock
            .setup(ds => ds.getUTCMonth())
            .returns(() => monthStub)
            .verifiable();

        dateStubMock
            .setup(ds => ds.getUTCFullYear())
            .returns(() => yearStub)
            .verifiable();

        dateGetterMock
            .setup(dgm => dgm())
            .returns(() => dateStubMock.object as Date)
            .verifiable();

        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable(Times.never());

        expect(testSubject.getInstallationId()).toEqual(guidStub);
        verifyMocks();
    });

    function verifyMocks(): void {
        storageAdapterMock.verifyAll();
        dateGetterMock.verifyAll();
        generateGuidMock.verifyAll();
        dateStubMock.verifyAll();
    }

    function createTestObject(initialInstallationData: InstallationData): InstallDataGenerator {
        return new InstallDataGenerator(
            initialInstallationData,
            generateGuidMock.object,
            dateGetterMock.object,
            storageAdapterMock.object,
        );
    }
});
