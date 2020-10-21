// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { OutcomeSummaryBar } from '../outcome-summary-bar';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { allUrlOutcomeTypes, UrlOutcomeType } from 'reports/components/url-outcome-type';

export const SummaryReportSummarySection = NamedFC<SummaryReportSectionProps>(
    'SummaryReportSummarySection',
    props => {
        const { results } = props;

        const numFailed = results.failed.length;
        const numPassed = results.passed.length;
        const numUnscannable = results.unscannable.length;

        const getTotalUrls = () => {
            const totalUrls = numFailed + numPassed + numUnscannable;

            return (
                <>
                    <h2>URLs</h2>
                    {totalUrls} total URLs discovered
                </>
            );
        };

        const getSummaryBar = () => {
            const countSummary: { [type in UrlOutcomeType]: number } = {
                fail: numFailed,
                unscannable: numUnscannable,
                pass: numPassed,
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
            let failedInstances = 0;
            results.failed.forEach(
                failedScanResult => (failedInstances += failedScanResult.numFailures),
            );

            return (
                <div className="failure-instances">
                    <h2>Failure Instances</h2>
                    <OutcomeChip count={failedInstances} outcomeType={'fail'} /> Failure instances
                    were detected
                </div>
            );
        };

        return (
            <div className="summary-report-summary-section">
                {getTotalUrls()}
                {getSummaryBar()}
                {getFailedInstances()}
            </div>
        );
    },
);
