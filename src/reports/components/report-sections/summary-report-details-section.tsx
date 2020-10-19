// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateIcon } from 'common/icons/date-icon';
import { UrlIcon } from 'common/icons/url-icon';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';


export const SummaryReportDetailsSection = NamedFC<SummaryReportSectionProps>(
    'SummaryReportDetailsSection',
    props => {
        const { scanMetadata, scanTimespan, toUtcString, secondsToTimeString } = props;

        const createListItem = (label: string, content: string | JSX.Element, icon?: JSX.Element) => (
            <li>
                <span className="icon" aria-hidden="true">
                    {icon}
                </span>
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
                        <UrlIcon />
                    )}
                    {createListItem('Scans started', scanStartUTC, <DateIcon />)}
                    {createListItem('Scans completed', scanCompleteUTC)}
                    {createListItem('Duration', duration)}
                </ul>
            </div>
        );
    },
);
