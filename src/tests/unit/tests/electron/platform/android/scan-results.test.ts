// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScreenshotData } from 'common/types/store-data/unified-data-interface';
import { DeviceInfo } from 'electron/platform/android/scan-results';

import { buildRuleResultObject, buildScanResultsObject, buildViewElement } from './scan-results-helpers';

describe('ScanResults', () => {
    test('axeVersion is "no-version" if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.axeVersion).toEqual('no-version');
    });

    test('axeVersion is correct if specified in input', () => {
        const axeVersion = 'test-axe-version';
        const scanResults = buildScanResultsObject(null, null, null, null, axeVersion);
        expect(scanResults.axeVersion).toEqual(axeVersion);
    });

    test('deviceInfo is null if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.deviceInfo).toBeNull();
    });

    test('deviceInfo is correct if specified in input', () => {
        const expectedDeviceInfo: DeviceInfo = {
            dpi: 0.5,
            name: 'test-name',
            osVersion: 'test-os-version',
            screenHeight: 1,
            screenWidth: 2,
        };
        const scanResults = buildScanResultsObject(null, null, null, null, null, null, expectedDeviceInfo);
        expect(scanResults.deviceInfo).toEqual(expectedDeviceInfo);
    });

    test('deviceName is null if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.deviceName).toBeNull();
    });

    test('deviceName is correct if specified in input', () => {
        const expectedDeviceName = 'Super WhizBang Gadget';
        const scanResults = buildScanResultsObject(expectedDeviceName, null);
        expect(scanResults.deviceName).toEqual(expectedDeviceName);
    });

    test('appIdentifier is null if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.appIdentifier).toBeNull();
    });

    test('appIdentifier is correct if specified in input', () => {
        const expectedAppIdentifier = 'My Absolutely Amazing Application';
        const scanResults = buildScanResultsObject(null, expectedAppIdentifier);
        expect(scanResults.appIdentifier).toEqual(expectedAppIdentifier);
    });

    test('ruleResults is empty array if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.ruleResults).toHaveLength(0);
    });

    test('ruleResults is correct if specified in input', () => {
        const resultsArray = [buildRuleResultObject('Rule1', 'PASS'), buildRuleResultObject('Rule2', 'FAIL')];
        const scanResults = buildScanResultsObject(null, null, resultsArray);
        expect(scanResults.ruleResults).toHaveLength(2);
        expect(scanResults.ruleResults).toEqual(resultsArray);
    });

    test('viewElementTree is null if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.viewElementTree).toBeNull();
    });

    test('screenshotData is null if missing from input', () => {
        const scanResults = buildScanResultsObject();
        expect(scanResults.screenshot).toBeNull();
    });

    test('screenshotData is correct if specified in input', () => {
        const screenshotBase64 = 'expected-string';
        const expectedScreenshotData: ScreenshotData = { base64PngData: screenshotBase64 };
        const scanResults = buildScanResultsObject(null, null, null, null, null, screenshotBase64);
        expect(scanResults.screenshot).toEqual(expectedScreenshotData);
    });

    test('viewElementTree is correct if specifiecd in input', () => {
        const viewElementTree = buildViewElement(
            'id1',
            { top: 0, left: 10, bottom: 800, right: 600 },
            'myClass1',
            'myDescription1',
            'myText1',
            [buildViewElement('id2', null, null, null, null, null), buildViewElement('id3', null, null, null, null, null)],
        );
        expect(viewElementTree).toMatchSnapshot();
    });
});
