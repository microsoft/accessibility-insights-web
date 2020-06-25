// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Logger } from 'common/logging/logger';
import { AdbWrapper, DeviceInfo, PackageInfo } from 'electron/platform/android/adb-wrapper';
import {
    AndroidServiceApkInfo,
    AndroidServiceApkLocator,
} from 'electron/platform/android/android-service-apk-locator';
import {
    AndroidServiceConfigurator,
    PortFinder,
} from 'electron/platform/android/setup/android-service-configurator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidServiceConfigurator', () => {
    const testDeviceId: string = 'emulator-12345';
    const servicePackageName: string = 'com.microsoft.accessibilityinsightsforandroidservice';
    const testApkPackage: string = './Some/Path/SomePackage.apk';
    const testApkInfo: AndroidServiceApkInfo = {
        path: testApkPackage,
        versionName: '1.2.3',
    };
    const accessibilityServiceName: string = 'accessibility';
    const mediaProjectionServiceName: string = 'media_projection';
    const serviceIsRunningResponseSnippet: string = 'label=Accessibility Insights';
    const expectedServicePortNumber: number = 62442;
    const expectedHostPortRangeStart: number = 62442;
    const expectedHostPortRangeStop: number = 62542;

    let adbWrapperMock: IMock<AdbWrapper>;
    let apkLocatorMock: IMock<AndroidServiceApkLocator>;
    let portFinderMock: IMock<PortFinder>;
    let loggerMock: IMock<Logger>;
    let testSubject: AndroidServiceConfigurator;

    beforeEach(() => {
        adbWrapperMock = Mock.ofType<AdbWrapper>(undefined, MockBehavior.Strict);
        apkLocatorMock = Mock.ofType<AndroidServiceApkLocator>(undefined, MockBehavior.Strict);
        portFinderMock = Mock.ofType<PortFinder>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        testSubject = new AndroidServiceConfigurator(
            adbWrapperMock.object,
            apkLocatorMock.object,
            portFinderMock.object,
            loggerMock.object,
        );
        testSubject.setSelectedDevice(testDeviceId);
    });

    function verifyAllMocks(): void {
        adbWrapperMock.verifyAll();
        apkLocatorMock.verifyAll();
        portFinderMock.verifyAll();
    }

    it('getConnectedDevices propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during getDevices';
        adbWrapperMock
            .setup(m => m.getConnectedDevices())
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.getConnectedDevices()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('getConnectedDevices returns info from AndroidServiceConfigurator', async () => {
        const expectedDevices: DeviceInfo[] = [
            {
                id: 'emulator1',
                isEmulator: true,
                friendlyName: 'an emulator',
            },
            {
                id: 'phone123',
                isEmulator: false,
                friendlyName: 'a device',
            },
        ];
        adbWrapperMock
            .setup(m => m.getConnectedDevices())
            .returns(() => Promise.resolve(expectedDevices))
            .verifiable(Times.once());

        const actualDevices = await testSubject.getConnectedDevices();

        expect(actualDevices).toBe(expectedDevices);

        verifyAllMocks();
    });

    it('setSelectedDevice changes value', async () => {
        // Note that we test this indirectly since can't read it
        const expectedDevice = 'another device';
        const expectedMessage = 'Error thrown during hasRequiredServiceVersion';
        adbWrapperMock
            .setup(m => m.getPackageInfo(expectedDevice, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        testSubject.setSelectedDevice(expectedDevice);

        await expect(testSubject.hasRequiredServiceVersion()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during hasRequiredServiceVersion';
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredServiceVersion()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns false if installed package has no versionName', async () => {
        const packageInfo: PackageInfo = {};
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns false if versionNames are different', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredServiceVersion returns true if versionNames are same', async () => {
        const packageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(packageInfo))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredServiceVersion();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    it('installRequiredServiceVersion propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during installRequiredServiceVersion';
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.installRequiredServiceVersion()).rejects.toThrowError(
            expectedMessage,
        );

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version does not exist', async () => {
        const installedPackageInfo: PackageInfo = {};
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is older than Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.2',
        };
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        verifyAllMocks();
    });

    it('installRequiredServiceVersion installs (no uninstall) if installed version is same as Apk version', async () => {
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.3',
        };
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        verifyAllMocks();
    });

    it('installRequiredServiceVersion uninstalls then installs if installed version is newer than Apk version', async () => {
        let callbackCount: number = 0;
        let uninstallOrder: number = undefined;
        let installOrder: number = undefined;
        const installedPackageInfo: PackageInfo = {
            versionName: '1.2.4',
        };
        adbWrapperMock
            .setup(m => m.getPackageInfo(testDeviceId, servicePackageName))
            .returns(() => Promise.resolve(installedPackageInfo))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.uninstallService(testDeviceId, servicePackageName))
            .callback(() => {
                uninstallOrder = callbackCount++;
            })
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.installService(testDeviceId, testApkPackage))
            .callback(() => {
                installOrder = callbackCount++;
            })
            .verifiable(Times.once());
        apkLocatorMock
            .setup(m => m.locateBundledApk())
            .returns(() => Promise.resolve(testApkInfo))
            .verifiable(Times.once());

        await testSubject.installRequiredServiceVersion();

        expect(uninstallOrder).toBe(0);
        expect(installOrder).toBe(1);
        expect(callbackCount).toBe(2);

        verifyAllMocks();
    });

    it('hasRequiredPermissions propagates thrown errors', async () => {
        const expectedMessage = 'Error thrown during hasRequiredPermissions';
        adbWrapperMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());

        await expect(testSubject.hasRequiredPermissions()).rejects.toThrowError(expectedMessage);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false if service is not running', async () => {
        adbWrapperMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .returns(() => Promise.resolve('No service here!'))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns false if service is running without screenshot permission', async () => {
        adbWrapperMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .returns(() => Promise.resolve(serviceIsRunningResponseSnippet))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.getDumpsysOutput(testDeviceId, mediaProjectionServiceName))
            .returns(() => Promise.resolve('Nope!'))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions();

        expect(success).toBe(false);

        verifyAllMocks();
    });

    it('hasRequiredPermissions returns true if service is running with screenshot permission', async () => {
        const screenshotGranted = 'some stuff ' + servicePackageName + ' some more stuff';
        adbWrapperMock
            .setup(m => m.getDumpsysOutput(testDeviceId, accessibilityServiceName))
            .returns(() => Promise.resolve(serviceIsRunningResponseSnippet))
            .verifiable(Times.once());
        adbWrapperMock
            .setup(m => m.getDumpsysOutput(testDeviceId, mediaProjectionServiceName))
            .returns(() => Promise.resolve(screenshotGranted))
            .verifiable(Times.once());

        const success = await testSubject.hasRequiredPermissions();

        expect(success).toBe(true);

        verifyAllMocks();
    });

    describe('setupTcpForwarding', () => {
        it('propagates error from portFinder', async () => {
            const expectedMessage: string = 'Thrown from portFinder';
            portFinderMock
                .setup(m => m(It.isAny()))
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());

            await expect(testSubject.setupTcpForwarding()).rejects.toThrowError(expectedMessage);

            verifyAllMocks();
        });

        it('propagates error from ADB.forwardPort', async () => {
            const portFinderOutput = 63000;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());

            const expectedMessage: string = 'Thrown during forwardPort';
            adbWrapperMock
                .setup(m =>
                    m.setTcpForwarding(testDeviceId, portFinderOutput, expectedServicePortNumber),
                )
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());

            await expect(testSubject.setupTcpForwarding()).rejects.toThrowError(expectedMessage);

            verifyAllMocks();
        });

        it('invokes ADB.forwardPort using the port from portFinder', async () => {
            const portFinderOutput = 63000;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());

            adbWrapperMock
                .setup(m =>
                    m.setTcpForwarding(testDeviceId, portFinderOutput, expectedServicePortNumber),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());

            const output = await testSubject.setupTcpForwarding();
            expect(output).toBe(portFinderOutput);

            verifyAllMocks();
        });
    });

    describe('removeTcpForwarding', () => {
        it('calls ADB.removePortForward using hostPort', async () => {
            const expectedHostPort = 123;

            adbWrapperMock
                .setup(m => m.removeTcpForwarding(testDeviceId, expectedHostPort))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await testSubject.removeTcpForwarding(expectedHostPort);

            verifyAllMocks();
        });

        it('propagates error from removePortForward', async () => {
            const irrelevantHostPort = 123;
            const expectedMessage: string = 'Thrown during removeTcpForwarding';

            adbWrapperMock
                .setup(m => m.removeTcpForwarding(testDeviceId, It.isAny()))
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());

            await expect(testSubject.removeTcpForwarding(irrelevantHostPort)).rejects.toThrowError(
                expectedMessage,
            );

            verifyAllMocks();
        });
    });

    describe('removeAllTcpForwarding', () => {
        it('does nothing if setTcpForwarding was never called', async () => {
            await testSubject.removeAllTcpForwarding();
        });

        it('does nothing if setTcpForwarding and removeTcpForwarding calls are balanced', async () => {
            const portFinderOutput = 12345;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());
            adbWrapperMock
                .setup(m =>
                    m.setTcpForwarding(testDeviceId, portFinderOutput, expectedServicePortNumber),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());
            adbWrapperMock
                .setup(m => m.removeTcpForwarding(testDeviceId, portFinderOutput))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());
            await testSubject.setupTcpForwarding();
            await testSubject.removeTcpForwarding(portFinderOutput);

            verifyAllMocks(); // Should already be satisfied

            await testSubject.removeAllTcpForwarding();

            verifyAllMocks(); // No more calls should have come through
        });

        it('does nothing if setTcpForwarding was never called', async () => {
            await testSubject.removeAllTcpForwarding();
        });

        it('removes forwarding for any ports set via setTcpForwarding and not removed via removeTcpForwarding calls are balanced', async () => {
            const portFinderOutputs = [12345, 23456, 34567];
            const removedPorts: number[] = [];
            let index: number = 0;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutputs[index++]))
                .verifiable(Times.exactly(3));
            adbWrapperMock
                .setup(m =>
                    m.setTcpForwarding(testDeviceId, It.isAnyNumber(), expectedServicePortNumber),
                )
                .returns((_, localPort, __) => Promise.resolve(localPort))
                .verifiable(Times.exactly(3));
            adbWrapperMock
                .setup(m => m.removeTcpForwarding(testDeviceId, It.isAnyNumber()))
                .callback((_, localPort) => removedPorts.push(localPort))
                .returns(() => Promise.resolve())
                .verifiable(Times.exactly(3));
            await testSubject.setupTcpForwarding();
            await testSubject.setupTcpForwarding();
            await testSubject.setupTcpForwarding();
            await testSubject.removeTcpForwarding(portFinderOutputs[1]);

            // At this point we've added 3 ports and only removed 1
            expect(removedPorts.length).toBe(1);
            expect(removedPorts[0]).toBe(portFinderOutputs[1]);

            await testSubject.removeAllTcpForwarding();

            expect(removedPorts.length).toBe(3);
            expect(removedPorts).toContain(portFinderOutputs[0]);
            expect(removedPorts).toContain(portFinderOutputs[2]);

            verifyAllMocks();
        });

        it('eats and reports errors from removePortForwarding', async () => {
            const expectedMessage: string = 'Thrown during removeAllTcpForwarding';
            let actualError: Error;

            const portFinderOutput = 12345;
            portFinderMock
                .setup(m =>
                    m({
                        port: expectedHostPortRangeStart,
                        stopPort: expectedHostPortRangeStop,
                    }),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());
            adbWrapperMock
                .setup(m =>
                    m.setTcpForwarding(testDeviceId, portFinderOutput, expectedServicePortNumber),
                )
                .returns(() => Promise.resolve(portFinderOutput))
                .verifiable(Times.once());
            adbWrapperMock
                .setup(m => m.removeTcpForwarding(testDeviceId, portFinderOutput))
                .returns(() => Promise.reject(new Error(expectedMessage)))
                .verifiable(Times.once());
            loggerMock
                .setup(m => m.log(It.isAny()))
                .callback(_ => (actualError = _))
                .verifiable(Times.once());
            await testSubject.setupTcpForwarding(); // Put data in the list

            await testSubject.removeAllTcpForwarding();

            expect(actualError.message).toBe(expectedMessage);

            verifyAllMocks();
        });
    });
});
