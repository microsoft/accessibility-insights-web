// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanMetadata } from 'common/types/store-data/scan-meta-data';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import {
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';

export function getUrlItemInfo(scanMetadata: ScanMetadata): ScanDetailInfo {
    return {
        label: 'target page url:',
        content: (
            <NewTabLinkWithConfirmationDialog
                href={scanMetadata.targetAppInfo.url}
                title={scanMetadata.targetAppInfo.name}
            >
                {scanMetadata.targetAppInfo.url}
            </NewTabLinkWithConfirmationDialog>
        ),
    };
}

export const DetailsSection = makeDetailsSectionFC(getUrlItemInfo);
