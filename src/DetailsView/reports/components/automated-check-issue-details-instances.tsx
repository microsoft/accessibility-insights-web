// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { DecoratedAxeNodeResult } from '../../../injected/scanner-utils';

export interface AutomatedChecksIssueDetailsInstancesProps {
    nodeResults: DecoratedAxeNodeResult[];
}

export const AutomatedChecksIssueDetailsInstances = NamedSFC<AutomatedChecksIssueDetailsInstancesProps>(
    'AutomatedChecksIssueDetailsInstances',
    ({ nodeResults }) => {
        const rows: JSX.Element[] = [];
        nodeResults.forEach((nodeResult, index) => {
            rows.push(
                <tr className="row" key={`path-row-${index}`}>
                    <td className="label">Path</td>
                    <td className="content">{nodeResult.selector}</td>
                </tr>,
            );
            rows.push(
                <tr className="row" key={`snippet-row-${index}`}>
                    <td className="label">Snippet</td>
                    <td className="content">{nodeResult.snippet}</td>
                </tr>,
            );
            rows.push(
                <tr className="row" key={`how-to-fix-row-${index}`}>
                    <td className="label">How to fix</td>
                    <td className="content">{nodeResult.failureSummary}</td>
                </tr>,
            );
        });
        return <>{rows}</>;
    },
);
