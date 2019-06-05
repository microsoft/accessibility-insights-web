// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { DecoratedAxeNodeResult } from '../../../../injected/scanner-utils';

export type InstanceDetailsProps = Pick<DecoratedAxeNodeResult, 'selector' | 'snippet' | 'failureSummary'> & { index: number };

export const InstanceDetails = NamedSFC<InstanceDetailsProps>('InstanceDetail', props => {
    const { selector, snippet, failureSummary, index } = props;

    const createTableRow = (label: string, content: string, rowKey: string, needsExtraClassname?: boolean) => {
        const contentStyling = classNames({
            'instance-list-row-content': true,
            'content-snipppet': !!needsExtraClassname,
        });
        return (
            <tr className="row" key={rowKey}>
                <th className="label">{label}</th>
                <td className={contentStyling}>{content}</td>
            </tr>
        );
    };
    return (
        <table className="report-instance-table">
            <tbody>
                {createTableRow('Path', selector, `path-row-${index}`)}
                {createTableRow('Snippet', snippet, `snippet-row-${index}`, true)}
                {createTableRow('How to fix', failureSummary, `how-to-fix-row-${index}`)}
            </tbody>
        </table>
    );
});
