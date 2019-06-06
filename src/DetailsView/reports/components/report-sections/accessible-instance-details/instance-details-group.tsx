// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../../common/react/named-sfc';

export type InstanceDetailsGroupProps = {
    nodeResults: AxeNodeResult[];
};

export const InstanceDetailsGroup = NamedSFC<InstanceDetailsGroupProps>('InstanceDetailsGroup', props => {
    return (
        <div className="a11y-report-instance-table">
            <table>
                <thead>
                    <tr>
                        <th>Path</th>
                        <th>Snippet</th>
                        <th>How to fix</th>
                    </tr>
                </thead>
                <tbody>
                    {props.nodeResults.map((node, index) => {
                        return (
                            <tr>
                                <td>{node.target.join(', ')}</td>
                                <td>{node.html}</td>
                                <td>{node.failureSummary}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
});
