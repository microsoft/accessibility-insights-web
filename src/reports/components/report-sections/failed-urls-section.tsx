// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import {
    CollapsibleUrlResultSection,
    CollapsibleUrlResultSectionDeps,
} from 'reports/components/report-sections/collapsible-url-result-section';
import { UrlScanResultsTable } from 'reports/components/report-sections/url-scan-results-table';

export type FailedUrlsSectionDeps = CollapsibleUrlResultSectionDeps;

export type FailedUrlsSectionProps = {
    deps: FailedUrlsSectionDeps;
    results: SummaryScanResults;
};

export const FailedUrlsSection = NamedFC<FailedUrlsSectionProps>(
    'FailedUrlsSection',
    ({ results, deps }) => {
        const table = <UrlScanResultsTable results={results.failed} />;

        return (
            <CollapsibleUrlResultSection
                deps={deps}
                title="Failed URLs"
                outcomeType="fail"
                badgeCount={results.failed.length}
                containerId="failed-urls-section"
                content={table}
            />
        );
    },
);
