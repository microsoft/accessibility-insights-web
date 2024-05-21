// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    BagOf,
    isScalarColumnValue,
    ScalarColumnValue,
} from 'common/types/property-bag/column-value-bag';
import { flatten, toPairs } from 'lodash';
import * as React from 'react';

import { InstanceReportModel } from '../assessment-report-model';

export interface ReportInstanceListProps {
    instances: InstanceReportModel[];
}

export const ReportInstanceList = NamedFC<ReportInstanceListProps>('ReportInstanceList', props => {
    type Index = number | string;
    type Row = React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTableRowElement>,
        HTMLTableRowElement
    >;

    return <div>{renderInstances()}</div>;

    function renderInstances(): JSX.Element[] {
        return props.instances.map((instance, index) => {
            return (
                <table className="instance-details" key={`instance-row-${index}`}>
                    <tbody>{renderInstanceRows(instance)}</tbody>
                </table>
            );
        });
    }

    function renderInstanceRows(instance: InstanceReportModel): JSX.Element[] {
        const rowSets = instance.props.map(({ key, value }, index) =>
            isScalarColumnValue(value)
                ? [renderScalarRow(key, value, index)]
                : renderPropertyBagRows(key, value, index),
        );

        return flatten(rowSets) as any[];
    }

    function renderPropertyBagRows(
        key: string,
        value: BagOf<ScalarColumnValue>,
        index: Index,
    ): Row[] {
        const headerRow = renderPropertyBagHeaderRow(key);
        const entryRows = renderProperyBagEntryRows(value, index);
        return [headerRow, ...entryRows];
    }

    function renderPropertyBagHeaderRow(key: string): JSX.Element {
        const rowValue = renderRow(
            [
                <th className={`instance-subsection-header`} colSpan={2} key={key}>
                    {key + ':'}
                </th>,
            ],
            key,
        );

        return rowValue as JSX.Element;
    }

    function renderProperyBagEntryRows(bag: BagOf<ScalarColumnValue>, outerIndex: Index): Row[] {
        return toPairs(bag).map(([key, value], index) =>
            renderScalarRow(key, value, `${outerIndex}-${index}`, 'instance-key-indented'),
        );
    }

    function renderScalarRow(
        key: string,
        value: ScalarColumnValue,
        index: Index,
        keyClassName: string = 'instance-key',
    ): Row {
        return renderRow(
            [
                <th className={keyClassName} key={key}>
                    {key}
                </th>,
                <td className={'instance-value'} key={`${key}-${index}`}>
                    {value ? value.toString() : '-'}
                </td>,
            ],
            index,
        );
    }

    function renderRow(cells: JSX.Element[], index: Index): Row {
        return (
            <tr className="instance-pair-details" key={`instance-pair-row-${index}`}>
                {cells}
            </tr>
        );
    }
});
