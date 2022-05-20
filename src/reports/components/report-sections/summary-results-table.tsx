// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import styles from './summary-results-table.scss';

const cellClassNames = {
    text: styles.textCell,
    url: styles.urlCell,
};

type CellContentType = keyof typeof cellClassNames;

export type TableColumn = {
    header: string;
    contentType: CellContentType;
};

export type TableRow = (string | JSX.Element)[];

export type SummaryResultsTableProps = {
    rows: TableRow[];
    columns: TableColumn[];
    id: string;
};

export const SummaryResultsTable = NamedFC<SummaryResultsTableProps>(
    'SummaryResultsTable',
    props => {
        const { id, columns, rows } = props;

        const getHeaderId = (colIndex: number) => {
            return `${id}-header${colIndex}`;
        };

        const getTableHeaders = () => {
            return (
                <tr>
                    {columns.map((column, index) => {
                        return (
                            <th key={index} id={getHeaderId(index)}>
                                {column.header}
                            </th>
                        );
                    })}
                </tr>
            );
        };

        const getCellClassName = (colIndex: number) => {
            const contentType = columns[colIndex].contentType;
            return cellClassNames[contentType];
        };

        const getRow = (row: TableRow, rowIndex: number) => {
            return (
                <tr key={rowIndex}>
                    {row.map((item, colIndex) => {
                        return (
                            <td
                                key={colIndex}
                                headers={getHeaderId(colIndex)}
                                className={getCellClassName(colIndex)}
                            >
                                {item}
                            </td>
                        );
                    })}
                </tr>
            );
        };

        const getTableRows = () => {
            return rows.map(getRow);
        };

        return (
            <table className={styles.summaryResultsTable} id={id}>
                <thead>{getTableHeaders()}</thead>
                <tbody>{getTableRows()}</tbody>
            </table>
        );
    },
);
