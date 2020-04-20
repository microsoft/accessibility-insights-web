// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
import {
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';

export function createDeviceNameItemInfo(scanMetaData: ScanMetaData): ScanDetailInfo {
    return {
        label: 'connected device name:',
        content: `${scanMetaData.deviceName} - ${scanMetaData.targetAppInfo.name}`,
    };
}

export const UnifiedDetailsSection = makeDetailsSectionFC(createDeviceNameItemInfo);
