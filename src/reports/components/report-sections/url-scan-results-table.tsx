// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SummaryScanResult } from '../../package/accessibilityInsightsReport';
import { NewTabLink } from 'common/components/new-tab-link';
import { SummaryResultsTable } from 'reports/components/report-sections/summary-results-table';

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

        const headers = [`# failure instances (${failureInstances})`, 'URL', 'Link to report'];

        const rows = results.map(result => {
            const { url, reportLocation, numFailures } = result;
            const urlLink = <NewTabLink href={url}>{url}</NewTabLink>;
            const reportLink = (
                <NewTabLink href={reportLocation} aria-label={`Report for ${url}`}>
                    Report
                </NewTabLink>
            );
            return [`${result.numFailures}`, urlLink, reportLink];
        });

        const columnIsUrl = [false, true, false];

        return (
            <SummaryResultsTable
                columnHeaders={headers}
                rows={rows}
                id={props.id}
                columnIsUrl={columnIsUrl}
            />
        );
    },
);
