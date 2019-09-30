// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanResults } from 'electron/platform/android/scan-results';

function buildTestObject(deviceName: string = null, appIdentifier: string = null): ScanResults {
    const scanResults = {};
    const axeContext = {};
    let addContext = false;

    if (deviceName != null) {
        const axeDevice = {};
        axeDevice['name'] = deviceName;
        axeContext['axeDevice'] = axeDevice;
        addContext = true;
    }

    if (appIdentifier != null) {
        const axeMetaData = {};
        axeMetaData['appIdentifier'] = appIdentifier;
        axeContext['axeMetaData'] = axeMetaData;
        addContext = true;
    }

    if (addContext) {
        scanResults['axeContext'] = axeContext;
    }

    return new ScanResults(scanResults);
}

describe('ScanResultsTest', () => {
    test('deviceName is null if missing from input', () => {
        const scanResults = buildTestObject();
        expect(scanResults.deviceName).toBeNull();
    });

    test('deviceName is correct if specified in input', () => {
        const expectedDeviceName = 'Super WhizBang Gadget';
        const scanResults = buildTestObject(expectedDeviceName, null);
        expect(scanResults.deviceName).toEqual(expectedDeviceName);
    });

    test('appIdentifier is null if missing from input', () => {
        const scanResults = buildTestObject();
        expect(scanResults.appIdentifier).toBeNull();
    });

    test('appIdentifier is correct if specified in input', () => {
        const expectedAppIdentifier = 'My Absolutely Amazing Application';
        const scanResults = buildTestObject(null, expectedAppIdentifier);
        expect(scanResults.appIdentifier).toEqual(expectedAppIdentifier);
    });
});
