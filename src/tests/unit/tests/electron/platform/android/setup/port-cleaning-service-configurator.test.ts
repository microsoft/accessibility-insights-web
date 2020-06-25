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

    // it('hasRequiredServiceVersion chains through', async () => {
    //     const expectedDevices: DeviceInfo[] = [
    //         {
    //             id: 'emulator5',
    //             isEmulator: true,
    //             friendlyName: 'a new emulator',
    //         },
    //         {
    //             id: 'cell12345',
    //             isEmulator: false,
    //             friendlyName: 'my tablet',
    //         },
    //     ];
    //     innerObjectMock
    //         .setup(m => m.getConnectedDevices())
    //         .returns(() => Promise.resolve(expectedDevices))
    //         .verifiable(Times.once());

    //     const actualDevices = await testSubject.getConnectedDevices();

    //     expect(actualDevices).toBe(expectedDevices);

    //     verifyAllMocks();
    // });

    // it('does nothing if setTcpForwarding and removeTcpForwarding calls are balanced', async () => {
    //     const portFinderOutput = 12345;
    //     portFinderMock
    //         .setup(m =>
    //             m({
    //                 port: expectedHostPortRangeStart,
    //                 stopPort: expectedHostPortRangeStop,
    //             }),
    //         )
    //         .returns(() => Promise.resolve(portFinderOutput))
    //         .verifiable(Times.once());
    //     adbWrapperMock
    //         .setup(m =>
    //             m.setTcpForwarding(testDeviceId, portFinderOutput, expectedServicePortNumber),
    //         )
    //         .returns(() => Promise.resolve(portFinderOutput))
    //         .verifiable(Times.once());
    //     adbWrapperMock
    //         .setup(m => m.removeTcpForwarding(testDeviceId, portFinderOutput))
    //         .returns(() => Promise.resolve())
    //         .verifiable(Times.once());
    //     await testSubject.setupTcpForwarding();
    //     await testSubject.removeTcpForwarding(portFinderOutput);

    //     verifyAllMocks(); // Should already be satisfied

    //     await testSubject.removeAllTcpForwarding();

    //     verifyAllMocks(); // No more calls should have come through
    // });

    // it('does nothing if setTcpForwarding was never called', async () => {
    //     await testSubject.removeAllTcpForwarding();
    // });

    // it('removes forwarding for any ports set via setTcpForwarding and not removed via removeTcpForwarding calls are balanced', async () => {
    //     const portFinderOutputs = [12345, 23456, 34567];
    //     const removedPorts: number[] = [];
    //     let index: number = 0;
    //     portFinderMock
    //         .setup(m =>
    //             m({
    //                 port: expectedHostPortRangeStart,
    //                 stopPort: expectedHostPortRangeStop,
    //             }),
    //         )
    //         .returns(() => Promise.resolve(portFinderOutputs[index++]))
    //         .verifiable(Times.exactly(3));
    //     adbWrapperMock
    //         .setup(m =>
    //             m.setTcpForwarding(testDeviceId, It.isAnyNumber(), expectedServicePortNumber),
    //         )
    //         .returns((_, localPort, __) => Promise.resolve(localPort))
    //         .verifiable(Times.exactly(3));
    //     adbWrapperMock
    //         .setup(m => m.removeTcpForwarding(testDeviceId, It.isAnyNumber()))
    //         .callback((_, localPort) => removedPorts.push(localPort))
    //         .returns(() => Promise.resolve())
    //         .verifiable(Times.exactly(3));
    //     await testSubject.setupTcpForwarding();
    //     await testSubject.setupTcpForwarding();
    //     await testSubject.setupTcpForwarding();
    //     await testSubject.removeTcpForwarding(portFinderOutputs[1]);

    //     // At this point we've added 3 ports and only removed 1
    //     expect(removedPorts.length).toBe(1);
    //     expect(removedPorts[0]).toBe(portFinderOutputs[1]);

    //     await testSubject.removeAllTcpForwarding();

    //     expect(removedPorts.length).toBe(3);
    //     expect(removedPorts).toContain(portFinderOutputs[0]);
    //     expect(removedPorts).toContain(portFinderOutputs[2]);

    //     verifyAllMocks();
    // });

    // it('eats and reports errors from removePortForwarding', async () => {
    //     const expectedMessage: string = 'Thrown during removeAllTcpForwarding';
    //     let actualError: Error;

    //     const portFinderOutput = 12345;
    //     portFinderMock
    //         .setup(m =>
    //             m({
    //                 port: expectedHostPortRangeStart,
    //                 stopPort: expectedHostPortRangeStop,
    //             }),
    //         )
    //         .returns(() => Promise.resolve(portFinderOutput))
    //         .verifiable(Times.once());
    //     adbWrapperMock
    //         .setup(m =>
    //             m.setTcpForwarding(testDeviceId, portFinderOutput, expectedServicePortNumber),
    //         )
    //         .returns(() => Promise.resolve(portFinderOutput))
    //         .verifiable(Times.once());
    //     adbWrapperMock
    //         .setup(m => m.removeTcpForwarding(testDeviceId, portFinderOutput))
    //         .returns(() => Promise.reject(new Error(expectedMessage)))
    //         .verifiable(Times.once());
    //     loggerMock
    //         .setup(m => m.log(It.isAny()))
    //         .callback(_ => (actualError = _))
    //         .verifiable(Times.once());
    //     await testSubject.setupTcpForwarding(); // Put data in the list

    //     await testSubject.removeAllTcpForwarding();

    //     expect(actualError.message).toBe(expectedMessage);

    //     verifyAllMocks();
    // });
});
