// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import {
    CollapsibleUrlResultSection,
    CollapsibleUrlResultSectionDeps,
} from 'reports/components/report-sections/collapsible-url-result-section';
import { UrlScanResultsTable } from 'reports/components/report-sections/url-scan-results-table';
import { SummaryScanResults } from 'reports/package/accessibilityInsightsReport';

export type PassedUrlsSectionDeps = CollapsibleUrlResultSectionDeps;

export type PassedUrlsSectionProps = {
    deps: PassedUrlsSectionDeps;
    results: SummaryScanResults;
};

export const PassedUrlsSection = NamedFC<PassedUrlsSectionProps>(
    'PassedUrlsSection',
    ({ results, deps }) => {
        const table = <UrlScanResultsTable results={results.passed} id="passed-urls-table" />;
        return (
            <CollapsibleUrlResultSection
                deps={deps}
                title="Passed URLs"
                outcomeType="pass"
                badgeCount={results.passed.length}
                containerId="passed-urls-section"
                content={table}
            />
        );
    },
);
