// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import {
    SummaryResultsTable,
    TableColumn,
} from 'reports/components/report-sections/summary-results-table';
import { SummaryScanResult } from '../../package/accessibilityInsightsReport';

export type UrlScanResultsTableProps = {
    results: SummaryScanResult[];
    id: string;
};

export const UrlScanResultsTable = NamedFC<UrlScanResultsTableProps>(
    'UrlScanResultsTable',
    props => {
        const results = props.results;
        let failureInstances = 0;
        results.forEach(result => (failureInstances += result.numFailures));

        const columns: TableColumn[] = [
            { header: `# failure instances (${failureInstances})`, contentType: 'text' },
            { header: 'URL', contentType: 'url' },
            { header: 'Link to report', contentType: 'text' },
        ];

        const rows = results.map(result => {
            const { url, reportLocation } = result;
            const urlLink = <NewTabLink href={url}>{url}</NewTabLink>;
            const reportLink = (
                <NewTabLink href={reportLocation} aria-label={`Report for ${url}`}>
                    Report
                </NewTabLink>
            );
            return [`${result.numFailures}`, urlLink, reportLink];
        });

        return <SummaryResultsTable columns={columns} rows={rows} id={props.id} />;
    },
);
