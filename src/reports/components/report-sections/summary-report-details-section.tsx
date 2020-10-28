// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateIcon } from 'common/icons/date-icon';
import { UrlIcon } from 'common/icons/url-icon';
import { NamedFC } from 'common/react/named-fc';
import { css } from 'office-ui-fabric-react';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { BaseSummaryReportSectionProps } from 'reports/components/report-sections/base-summary-report-section-props';
import * as styles from './summary-report-details-section.scss';

export const SummaryReportDetailsSection = NamedFC<BaseSummaryReportSectionProps>(
    'SummaryReportDetailsSection',
    props => {
        const { scanMetadata, toUtcString, secondsToTimeString } = props;
        const scanTimespan = scanMetadata.timespan;

        const createListItem = (label: string, content: string | JSX.Element, icon?: JSX.Element) =>
            icon ? (
                <li>
                    <span className={styles.icon} aria-hidden="true">
                        {icon}
                    </span>
                    <span className={styles.label}>{`${label} `}</span>
                    <span className={styles.text}>{content}</span>
                </li>
            ) : (
                <li>
                    <span className={css(styles.noIcon, styles.label)}>{`${label} `}</span>
                    <span className={styles.text}>{content}</span>
                </li>
            );

        const scanStartUTC = toUtcString(scanTimespan.scanStart);
        const scanCompleteUTC = toUtcString(scanTimespan.scanComplete);
        const duration = secondsToTimeString(scanTimespan.durationSeconds);

        return (
            <div className={styles.crawlDetailsSection}>
                <h2>Scan details</h2>
                <ul className={styles.crawlDetailsSectionList}>
                    {createListItem(
                        'Target site',
                        <NewTabLinkWithConfirmationDialog
                            href={scanMetadata.targetAppInfo.url}
                            title={scanMetadata.targetAppInfo.name}
                        >
                            {scanMetadata.targetAppInfo.url}
                        </NewTabLinkWithConfirmationDialog>,
                        <UrlIcon />,
                    )}
                    {createListItem('Scans started', scanStartUTC, <DateIcon />)}
                    {createListItem('Scans completed', scanCompleteUTC)}
                    {createListItem('Duration', duration)}
                </ul>
            </div>
        );
    },
);
