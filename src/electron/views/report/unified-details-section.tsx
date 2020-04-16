// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import {
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';

export function createDeviceNameItemInfo(appInfo: TargetAppData, device: string): ScanDetailInfo {
    return {
        label: 'connected device name:',
        content: `${device} - ${appInfo.name}`,
    };
}

export const UnifiedDetailsSection = makeDetailsSectionFC(createDeviceNameItemInfo);
