// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PlatformData } from 'common/types/store-data/unified-data-interface';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { convertScanResultsToPlatformData } from 'electron/platform/android/scan-results-to-platform-data';
import { axeRuleResultExample } from 'tests/unit/tests/electron/flux/action-creator/scan-result-example';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('convertScanResultsToPlatformData with device name', () => {
    let friendlyNameProviderMock: IMock<AndroidFriendlyDeviceNameProvider>;

    beforeEach(() => {
        friendlyNameProviderMock = Mock.ofType<AndroidFriendlyDeviceNameProvider>(
            undefined,
            MockBehavior.Strict,
        );
        friendlyNameProviderMock
            .setup(m => m.getFriendlyName(It.isAnyString()))
            .returns(s => s)
            .verifiable(Times.once());
    });

    it('produces the pinned output for the pinned example input', () => {
        expect(
            convertScanResultsToPlatformData(
                new AndroidScanResults(axeRuleResultExample),
                friendlyNameProviderMock.object,
            ),
        ).toMatchSnapshot();
        friendlyNameProviderMock.verifyAll();
    });

    it('populates output from the ScanResults axeDevice properties', () => {
        const input = new AndroidScanResults({
            axeContext: {
                axeDevice: {
                    dpi: 1.2,
                    name: 'test-device-name',
                    osVersion: 'test-os-version',
                    screenHeight: 1,
                    screenWidth: 2,
                },
            },
        });
        const expectedOutput: PlatformData = {
            osInfo: {
                name: 'Android',
                version: 'test-os-version',
            },
            viewPortInfo: {
                width: 2,
                height: 1,
                dpi: 1.2,
            },
            deviceName: 'test-device-name',
        };
        expect(convertScanResultsToPlatformData(input, friendlyNameProviderMock.object)).toEqual(
            expectedOutput,
        );
        friendlyNameProviderMock.verifyAll();
    });
});

describe('convertScanResultsToPlatformData with undefined device name', () => {
    const friendlyNameProviderMock = Mock.ofType<AndroidFriendlyDeviceNameProvider>();

    it('omits individual axeDevice properties not present in scanResults', () => {
        const input = new AndroidScanResults({ axeContext: { axeDevice: {} } });
        const expectedOutput: PlatformData = {
            osInfo: {
                name: 'Android',
            },
            viewPortInfo: {},
        };
        expect(convertScanResultsToPlatformData(input, friendlyNameProviderMock.object)).toEqual(
            expectedOutput,
        );
    });

    it.each([null, undefined, {}])('outputs null if scanResults is %p', emptyObject => {
        expect(
            convertScanResultsToPlatformData(
                new AndroidScanResults(emptyObject),
                friendlyNameProviderMock.object,
            ),
        ).toBeNull();
    });

    it.each([null, undefined, {}])('outputs null if scanResults.axeContext is %p', emptyObject => {
        expect(
            convertScanResultsToPlatformData(
                new AndroidScanResults({ axeContext: emptyObject }),
                friendlyNameProviderMock.object,
            ),
        ).toBeNull();
    });

    it.each([null, undefined])(
        'outputs null if scanResults.axeContext.axeDevice is %p',
        emptyObject => {
            expect(
                convertScanResultsToPlatformData(
                    new AndroidScanResults({ axeContext: { axeDevice: emptyObject } }),
                    friendlyNameProviderMock.object,
                ),
            ).toBeNull();
        },
    );
});
