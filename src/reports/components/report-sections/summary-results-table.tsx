import { TableHeaders } from 'assessments/semantics/test-steps/table-headers';
import { NullComponent } from 'common/components/null-component';
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type TableRow = (string | JSX.Element)[];

export type SummaryResultsTableProps = {
    columnHeaders: string[];
    rows: TableRow[];
};

export const SummaryResultsTable = NamedFC<SummaryResultsTableProps>(
    'SummaryResultsTable',
    props => {
        const getTableHeaders = () => {
            return (
                <tr>
                    {props.columnHeaders.map((header, index) => {
                        return <th key={index}>{header}</th>;
                    })}
                </tr>
            );
        };

        const getRow = (row: TableRow, index: number) => {
            return (
                <tr key={index}>
                    {row.map((item, index) => {
                        return <td key={index}>{item}</td>;
                    })}
                </tr>
            );
        };

        const getTableRows = () => {
            return props.rows.map(getRow);
        };

        return (
            <table className="summary-results-table">
                <thead>{getTableHeaders()}</thead>
                <tbody>{getTableRows()}</tbody>
            </table>
        );
    },
);
