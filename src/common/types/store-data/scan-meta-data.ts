// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';

import { TargetAppData } from 'common/types/store-data/unified-data-interface';

export type ScanMetaData = {
    timestamp: string;
    toolData: ToolData;
    targetAppInfo: TargetAppData;
    deviceName?: string;
};
