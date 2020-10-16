// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { NamedFC } from 'common/react/named-fc';

export const SummaryReportDetailsSection = NamedFC<SummaryReportSectionProps>(
    'SummaryReportDetailsSection',
    props => {
        const { scanMetadata, scanTimespan, toUtcString, secondsToTimeString } = props;

        const createListItem = (label: string, content: string | JSX.Element) => (
            <li>
                <span className="label">{`${label} `}</span>
                <span className="text">{content}</span>
            </li>
        );

        const scanStartUTC = toUtcString(scanTimespan.scanStart);
        const scanCompleteUTC = toUtcString(scanTimespan.scanComplete);
        const duration = secondsToTimeString(scanTimespan.durationSeconds);

        return (
            <div className="crawl-details-section">
                <h2>Scan details</h2>
                <ul className="crawl-details-section-list">
                    {createListItem(
                        'Target site',
                        <NewTabLinkWithConfirmationDialog
                            href={scanMetadata.targetAppInfo.url}
                            title={scanMetadata.targetAppInfo.name}
                        >
                            {scanMetadata.targetAppInfo.url}
                        </NewTabLinkWithConfirmationDialog>,
                    )}
                    {createListItem('Scan start', scanStartUTC)}
                    {createListItem('Scan complete', scanCompleteUTC)}
                    {createListItem('Duration', duration)}
                </ul>
            </div>
        );
    },
);
