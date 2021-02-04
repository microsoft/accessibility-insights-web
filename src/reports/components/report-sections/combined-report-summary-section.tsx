// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import { UrlsSummarySection } from 'reports/components/report-sections/urls-summary-section';

export const CombinedReportSummarySection = NamedFC<CombinedReportSectionProps>(
    'CombinedReportSummarySection',
    props => {
        const { cardsViewData, urlResultCounts } = props;
        const cards = cardsViewData.cards;

        let failedInstances = 0;
        cards.fail.forEach(failedScanResult => {
            failedScanResult.nodes.forEach(failureNode => {
                failedInstances += failureNode.identifiers.urls.urls.length;
            });
        });

        const urlsSummarySectionProps = {
            passedUrlsCount: urlResultCounts.passedUrls,
            failedUrlsCount: urlResultCounts.failedUrls,
            notScannedUrlsCount: urlResultCounts.unscannableUrls,
            failureInstancesCount: failedInstances,
        };

        return <UrlsSummarySection {...urlsSummarySectionProps} />;
    },
);
