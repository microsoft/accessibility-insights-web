// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { OutcomeSummaryBar } from 'reports/components/outcome-summary-bar';
import { allUrlOutcomeTypes, UrlOutcomeType } from 'reports/components/url-outcome-type';
import styles from './urls-summary-section.scss';

export type UrlsSummarySectionProps = {
    passedUrlsCount: number;
    failedUrlsCount: number;
    notScannedUrlsCount: number;
    failureInstancesCount: number;
};

export const UrlsSummarySection = NamedFC<UrlsSummarySectionProps>('UrlsSummarySection', props => {
    const {
        passedUrlsCount: urlsPassedCount,
        failedUrlsCount: urlsFailedCount,
        notScannedUrlsCount: urlsNotScannedCount,
        failureInstancesCount,
    } = props;

    const getTotalUrls = () => {
        const totalUrls = urlsPassedCount + urlsFailedCount + urlsNotScannedCount;

        return (
            <>
                <h2>URLs</h2>
                <span className={styles.totalUrls}>{totalUrls}</span> total URLs scanned
            </>
        );
    };

    const getSummaryBar = () => {
        const countSummary: { [type in UrlOutcomeType]: number } = {
            fail: urlsFailedCount,
            unscannable: urlsNotScannedCount,
            pass: urlsPassedCount,
        };

        return (
            <OutcomeSummaryBar
                outcomeStats={countSummary}
                iconStyleInverted={true}
                allOutcomeTypes={allUrlOutcomeTypes}
                textLabel={true}
            />
        );
    };

    const getFailedInstances = () => {
        return (
            <div className={styles.failureInstances}>
                <h2>Failure Instances</h2>
                <span className={styles.failureOutcomeChip}>
                    <OutcomeChip count={failureInstancesCount} outcomeType={'fail'} />
                    <span>Failure instances were detected</span>
                </span>
            </div>
        );
    };

    return (
        <div className={styles.urlsSummarySection}>
            {getTotalUrls()}
            {getSummaryBar()}
            {getFailedInstances()}
        </div>
    );
});
