// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanResults } from 'electron/platform/android/scan-results';

export function buildScanResultsObject(deviceName: string = null, appIdentifier: string = null, resultsArray: any = null): ScanResults {
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

    if (resultsArray != null) {
        scanResults['axeRuleResults'] = resultsArray;
    }

    if (addContext) {
        scanResults['axeContext'] = axeContext;
    }

    return new ScanResults(scanResults);
}

export function buildRuleResultObject(ruleId: string, status: string, props: any = null): object {
    const result = {};
    result['ruleId'] = ruleId;
    result['status'] = status;
    if (props != null) {
        result['props'] = props;
    }

    return result;
}
