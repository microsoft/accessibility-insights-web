// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import {
    SummaryResultsTable,
    TableColumn,
} from 'reports/components/report-sections/summary-results-table';
import { SummaryScanError } from '../../package/accessibilityInsightsReport';

export type UrlErrorsTableProps = {
    errors: SummaryScanError[];
    id: string;
};

export const UrlErrorsTable = NamedFC<UrlErrorsTableProps>('UrlErrorsTable', props => {
    const errors = props.errors;

    const columns: TableColumn[] = [
        { header: 'Error type', contentType: 'text' },
        { header: 'URL', contentType: 'url' },
        { header: 'Error description', contentType: 'text' },
    ];
    const rows = errors.map(scanError => {
        const { errorDescription, errorType, url, errorLogLocation } = scanError;
        const urlLink = <NewTabLink href={url}>{url}</NewTabLink>;
        const errorLogLink = <NewTabLink href={errorLogLocation}>{errorDescription}</NewTabLink>;
        return [errorType, urlLink, errorLogLink];
    });

    return <SummaryResultsTable columns={columns} rows={rows} id={props.id} />;
});
