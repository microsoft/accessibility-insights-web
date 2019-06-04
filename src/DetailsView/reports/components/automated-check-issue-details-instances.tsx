// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { DecoratedAxeNodeResult } from '../../../injected/scanner-utils';

export interface AutomatedChecksIssueDetailsInstancesProps {
    nodeResults: DecoratedAxeNodeResult[];
}

const createTableRow = (label, content, rowKey) => (
    <tr className="row" key={rowKey}>
        <th className="label">{label}</th>
        <td className="content">{content}</td>
    </tr>
);

export const AutomatedChecksIssueDetailsInstances = NamedSFC<AutomatedChecksIssueDetailsInstancesProps>(
    'AutomatedChecksIssueDetailsInstances',
    ({ nodeResults }) => {
        const rows: JSX.Element[] = [];
        nodeResults.forEach((nodeResult, index) => {
            rows.push(createTableRow('Path', nodeResult.selector, `path-row-${index}`));
            rows.push(createTableRow('Snippet', nodeResult.snippet, `snippet-row-${index}`));
            rows.push(createTableRow('How to fix', nodeResult.failureSummary, `how-to-fix-row-${index}`));
        });
        return <>{rows}</>;
    },
);
