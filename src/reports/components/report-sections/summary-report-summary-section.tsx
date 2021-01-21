// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { UrlsSummarySection } from 'reports/components/report-sections/urls-summary-section';

export const SummaryReportSummarySection = NamedFC<SummaryReportSectionProps>(
    'SummaryReportSummarySection',
    props => {
        const { results } = props;

        let failedInstances = 0;
        results.failed.forEach(
            failedScanResult => (failedInstances += failedScanResult.numFailures),
        );

        const urlsSummarySectionProps = {
            passedUrlsCount: results.passed.length,
            failedUrlsCount: results.failed.length,
            notScannedUrlsCount: results.unscannable.length,
            failureInstancesCount: failedInstances,
        };

        return <UrlsSummarySection {...urlsSummarySectionProps} />;
    },
);
