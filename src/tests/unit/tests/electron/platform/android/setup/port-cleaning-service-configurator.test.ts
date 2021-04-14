// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidPortCleaner } from 'electron/platform/android/setup/android-port-cleaner';
import { ServiceConfigurator } from 'electron/platform/android/setup/android-service-configurator';
import { PortCleaningServiceConfigurator } from 'electron/platform/android/setup/port-cleaning-service-configurator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('PortCleaningServiceConfigurator', () => {
    let innerObjectMock: IMock<ServiceConfigurator>;
    let portCleanerMock: IMock<AndroidPortCleaner>;
    let testSubject: PortCleaningServiceConfigurator;

    beforeEach(() => {
        innerObjectMock = Mock.ofType<ServiceConfigurator>(undefined, MockBehavior.Strict);
        portCleanerMock = Mock.ofType<AndroidPortCleaner>(undefined, MockBehavior.Strict);
        testSubject = new PortCleaningServiceConfigurator(
            innerObjectMock.object,
            portCleanerMock.object,
        );
    });

    function verifyAllMocks(): void {
        innerObjectMock.verifyAll();
        portCleanerMock.verifyAll();
    }

    it('getConnectedDevice returns expected data', async () => {
        const expectedDevices: DeviceInfo[] = [
            {
                id: 'emulator5',
                isEmulator: true,
                friendlyName: 'a new emulator',
            },
            {
                id: 'cell12345',
                isEmulator: false,
                friendlyName: 'my tablet',
            },
        ];
        innerObjectMock
            .setup(m => m.getConnectedDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());

        const actualDevices = await testSubject.getConnectedDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('setSelectedDevice chains through', () => {
        const expectedDevice: string = 'My device';
        innerObjectMock.setup(m => m.setSelectedDevice(expectedDevice)).verifiable(Times.once());

        testSubject.setSelectedDevice(expectedDevice);

        verifyAllMocks();
    });

    it.each([true, false])('hasRequiredServiceVersion with result = %s', async expectedResult => {
        innerObjectMock
            .setup(m => m.hasRequiredServiceVersion())
            .returns(() => Promise.resolve(expectedResult))
            .verifiable(Times.once());

        const result = await testSubject.hasRequiredServiceVersion();

        expect(result).toBe(expectedResult);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion chains through', async () => {
        innerObjectMock.setup(m => m.installRequiredServiceVersion()).verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        verifyAllMocks();
    });

    it.each([true, false])('hasRequiredPermissions with result = %s', async expectedResult => {
        innerObjectMock
            .setup(m => m.hasRequiredPermissions())
            .returns(() => Promise.resolve(expectedResult))
            .verifiable(Times.once());

        const result = await testSubject.hasRequiredPermissions();

        expect(result).toBe(expectedResult);

        verifyAllMocks();
    });

    it('grantOverlayPermission chains through', async () => {
        innerObjectMock.setup(m => m.grantOverlayPermission()).verifiable(Times.once());

        await testSubject.grantOverlayPermission();

        verifyAllMocks();
    });

    it('setupTcpForwarding chains through', async () => {
        const expectedPort: number = 123;
        innerObjectMock
            .setup(m => m.setupTcpForwarding())
            .returns(() => Promise.resolve(expectedPort))
            .verifiable(Times.once());
        portCleanerMock.setup(m => m.addPort(expectedPort)).verifiable(Times.once());

        const actualPort = await testSubject.setupTcpForwarding();

        expect(actualPort).toBe(expectedPort);

        verifyAllMocks();
    });

    it('removeTcpForwarding chains through', async () => {
        const expectedPort: number = 4567;
        innerObjectMock.setup(m => m.removeTcpForwarding(expectedPort)).verifiable(Times.once());
        portCleanerMock.setup(m => m.removePort(expectedPort)).verifiable(Times.once());

        await testSubject.removeTcpForwarding(expectedPort);

        verifyAllMocks();
    });
});
