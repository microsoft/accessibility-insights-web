// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type TableRow = (string | JSX.Element)[];

export type SummaryResultsTableProps = {
    columnHeaders: string[];
    rows: TableRow[];
    id: string;
    columnIsUrl: boolean[];
};

export const SummaryResultsTable = NamedFC<SummaryResultsTableProps>(
    'SummaryResultsTable',
    props => {
        const getHeaderId = (colIndex: number) => {
            return `${props.id}-header${colIndex}`;
        };

        const getTableHeaders = () => {
            return (
                <tr>
                    {props.columnHeaders.map((header, index) => {
                        return (
                            <th key={index} id={getHeaderId(index)}>
                                {header}
                            </th>
                        );
                    })}
                </tr>
            );
        };

        const getRow = (row: TableRow, rowIndex: number) => {
            return (
                <tr key={rowIndex}>
                    {row.map((item, colIndex) => {
                        const className = props.columnIsUrl[colIndex] ? 'url-cell' : 'text-cell';
                        return (
                            <td
                                key={colIndex}
                                headers={getHeaderId(colIndex)}
                                className={className}
                            >
                                {item}
                            </td>
                        );
                    })}
                </tr>
            );
        };

        const getTableRows = () => {
            return props.rows.map(getRow);
        };

        return (
            <table className="summary-results-table" id={props.id}>
                <thead>{getTableHeaders()}</thead>
                <tbody>{getTableRows()}</tbody>
            </table>
        );
    },
);
