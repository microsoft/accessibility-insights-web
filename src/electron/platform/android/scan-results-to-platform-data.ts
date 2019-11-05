// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PlatformData } from 'common/types/store-data/unified-data-interface';
import { ScanResults } from './scan-results';

export type ConvertScanResultsToPlatformDataDelegate = (scanResults: ScanResults) => PlatformData;

export function convertScanResultsToPlatformData(scanResults: ScanResults): PlatformData | null {
    if (!scanResults) {
        return null;
    }
    const axeDevice = scanResults.axeDevice;
    if (!axeDevice) {
        return null;
    }

    return {
        deviceName: axeDevice.name,
        osInfo: {
            name: 'Android',
            version: axeDevice.osVersion,
        },
        viewPortInfo: {
            width: axeDevice.screenWidth,
            height: axeDevice.screenHeight,
            dpi: axeDevice.dpi,
        },
    };
}

function createUnifiedRuleFromRuleResult(ruleInformation: RuleInformation, uuidGenerator: UUIDGeneratorType): UnifiedRule {
    return {
        uid: uuidGenerator(),
        id: ruleInformation.ruleId,
        description: ruleInformation.ruleDescription,
        url: null,
        guidance: [],
    };
}
