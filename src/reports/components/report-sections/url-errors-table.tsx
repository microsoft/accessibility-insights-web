// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SummaryScanError } from '../../package/accessibilityInsightsReport';
import { NewTabLink } from 'common/components/new-tab-link';
import { SummaryResultsTable } from 'reports/components/report-sections/summary-results-table';

export type UrlErrorsTableProps = {
    errors: SummaryScanError[];
};

export const UrlErrorsTable = NamedFC<UrlErrorsTableProps>('UrlErrorsTable', props => {
    const errors = props.errors;

    const headers = ['Error type', 'URL', 'Error description'];

    const rows = errors.map(scanError => {
        const { errorDescription, errorType, url } = scanError;
        const urlLink = <NewTabLink href={url}>{url}</NewTabLink>;
        return [errorType, urlLink, errorDescription];
    });

    return <SummaryResultsTable columnHeaders={headers} rows={rows} />;
});
