// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeSummaryBar } from '../outcome-summary-bar';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { OutcomeChip } from 'reports/components/outcome-chip';

export const SummaryReportSummarySection = NamedFC<SummaryReportSectionProps>(
    'BaseSummarySection',
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
            const countSummary: { [type in InstanceOutcomeType]: number } = {
                fail: numFailed,
                pass: numPassed,
                inapplicable: numUnscannable,
                review: 0, // never used
            };

            return (
                <OutcomeSummaryBar
                    outcomeStats={countSummary}
                    iconStyleInverted={true}
                    allOutcomeTypes={['fail', 'inapplicable', 'pass']}
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
