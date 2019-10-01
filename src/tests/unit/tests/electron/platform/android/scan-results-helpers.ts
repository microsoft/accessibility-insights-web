// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleResultsData, ScanResults } from 'electron/platform/android/scan-results';

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

export function buildRuleResultObject(ruleId: string, status: string, props: any = null): RuleResultsData {
    const result = {};
    result['ruleId'] = ruleId;
    result['status'] = status;
    if (props != null) {
        result['props'] = props;
    }

    return result as RuleResultsData;
}

export function buildTouchSizeWcagRuleResultObject(status: string, dpi: number, height: number, width: number): RuleResultsData {
    const props = {};
    // This is based on the output of the Android service
    props['Screen Dots Per Inch'] = dpi;
    props['height'] = height;
    props['width'] = width;

    return buildRuleResultObject('TouchSizeWcag', status, props);
}

export function buildColorContastRuleResultObject(status: string, ratio: number, foreground: string, background: string): RuleResultsData {
    const props = {};
    // This is based on the output of the Android service
    props['Color Contrast Ratio'] = ratio;
    props['Foreground Color'] = foreground;
    props['Background Color'] = background;

    return buildRuleResultObject('ColorContrast', status, props);
}
