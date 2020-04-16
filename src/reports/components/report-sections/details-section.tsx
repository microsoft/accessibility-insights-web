// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import {
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';

export function getUrlItemInfo(appInfo: TargetAppData, device: string): ScanDetailInfo {
    return {
        label: 'target page url:',
        content: (
            <NewTabLinkWithConfirmationDialog href={appInfo.url} title={appInfo.name}>
                {appInfo.url}
            </NewTabLinkWithConfirmationDialog>
        ),
    };
}

export const DetailsSection = makeDetailsSectionFC(getUrlItemInfo);
