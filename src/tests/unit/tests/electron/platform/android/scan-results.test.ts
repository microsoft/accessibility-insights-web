// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanResults } from 'electron/platform/android/scan-results';
import { buildRuleResultObject, buildScanResultsObject } from './scan-results-helpers';

describe('ScanResultsTest', () => {
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
});
