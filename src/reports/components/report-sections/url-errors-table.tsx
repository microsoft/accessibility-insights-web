// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SummaryScanError } from '../../package/accessibilityInsightsReport';
import { NewTabLink } from 'common/components/new-tab-link';
import { SummaryResultsTable } from 'reports/components/report-sections/summary-results-table';

export type UrlErrorsTableProps = {
    errors: SummaryScanError[];
    id: string;
};

export const UrlErrorsTable = NamedFC<UrlErrorsTableProps>('UrlErrorsTable', props => {
    const errors = props.errors;

    const headers = ['Error type', 'URL', 'Error description'];

    const rows = errors.map(scanError => {
        const { errorDescription, errorType, url, errorLogLocation } = scanError;
        const urlLink = <NewTabLink href={url}>{url}</NewTabLink>;
        const errorLogLink = <NewTabLink href={errorLogLocation}>{errorDescription}</NewTabLink>;
        return [errorType, urlLink, errorLogLink];
    });

    return <SummaryResultsTable columnHeaders={headers} rows={rows} id={props.id} />;
});
