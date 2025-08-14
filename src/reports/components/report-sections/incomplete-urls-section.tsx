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

export type IncompleteUrlsSectionDeps = CollapsibleUrlResultSectionDeps;

export type IncompleteUrlsSectionProps = {
    deps: IncompleteUrlsSectionDeps;
    results: SummaryScanResults;
};

export const IncompleteUrlsSection = NamedFC<IncompleteUrlsSectionProps>(
    'IncompleteUrlsSection',
    ({ results, deps }) => {
        const table = <UrlScanResultsTable results={results.incomplete} id="incomplete-urls-table" />;

        return (
            <CollapsibleUrlResultSection
                deps={deps}
                title="Incomplete URLs"
                outcomeType="incomplete"
                badgeCount={results.incomplete.length}
                containerId="incomplete-urls-section"
                content={table}
            />
        );
    },
);
