// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleResultsData, ScanResults, ViewElementData } from 'electron/platform/android/scan-results';

export function buildScanResultsObject(
    deviceName: string = null,
    appIdentifier: string = null,
    resultsArray: RuleResultsData[] = null,
    axeView: ViewElementData = null,
    axeVersion: string = null,
): ScanResults {
    const scanResults = {};
    const axeContext = {};
    let addContext = false;

    if (deviceName) {
        const axeDevice = {};
        axeDevice['name'] = deviceName;
        axeContext['axeDevice'] = axeDevice;
        addContext = true;
    }

    if (appIdentifier) {
        const axeMetaData = {};
        axeMetaData['appIdentifier'] = appIdentifier;
        axeContext['axeMetaData'] = axeMetaData;
        addContext = true;
    }

    if (axeView) {
        axeContext['axeView'] = axeView;
        addContext = true;
    }

    if (axeVersion) {
        if (axeContext['axeMetaData'] == null) {
            axeContext['axeMetaData'] = {};
        }

        axeContext['axeMetaData']['axeVersion'] = axeVersion;
        addContext = true;
    }

    if (resultsArray) {
        scanResults['axeRuleResults'] = resultsArray;
    }

    if (addContext) {
        scanResults['axeContext'] = axeContext;
    }

    return new ScanResults(scanResults);
}

export function buildRuleResultObject(ruleId: string, status: string, axeViewId: string = null, props: any = null): RuleResultsData {
    const result = {};
    result['ruleId'] = ruleId;
    result['status'] = status;
    if (axeViewId) {
        result['axeViewId'] = axeViewId;
    }
    if (props) {
        result['props'] = props;
    }

    return result as RuleResultsData;
}

export function buildTouchSizeWcagRuleResultObject(
    status: string,
    dpi: number,
    height: number,
    width: number,
    axeViewId: string = null,
): RuleResultsData {
    const props = {};
    // This is based on the output of the Android service
    props['Screen Dots Per Inch'] = dpi;
    props['height'] = height;
    props['width'] = width;

    return buildRuleResultObject('TouchSizeWcag', status, axeViewId, props);
}

export function buildColorContrastRuleResultObject(
    status: string,
    ratio: number,
    foreground: string,
    background: string,
    axeViewId: string = null,
): RuleResultsData {
    const props = {};
    // This is based on the output of the Android service
    props['Color Contrast Ratio'] = ratio;
    props['Foreground Color'] = foreground;
    props['Background Color'] = background;

    return buildRuleResultObject('ColorContrast', status, axeViewId, props);
}

export function buildViewElement(
    axeViewId: string,
    boundsInScreen: any,
    className: string,
    contentDescription: string,
    text: string,
    children: ViewElementData[],
): ViewElementData {
    const viewElement = {
        axeViewId: axeViewId,
        boundsInScreen: boundsInScreen,
        className: className,
        contentDescription: contentDescription,
        text: text,
        children: children,
    };

    return viewElement as ViewElementData;
}
