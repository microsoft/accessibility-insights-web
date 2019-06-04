// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { DecoratedAxeNodeResult } from '../../../injected/scanner-utils';
import { AutomatedChecksIssueDetailsInstances } from './automated-check-issue-details-instances';
import { BaseCardLayer } from './base-card-layer';

export interface AutomatedChecksIssueDetailsListProps {
    nodeResults: DecoratedAxeNodeResult[];
}

export const AutomatedChecksIssueDetailsList = NamedSFC<AutomatedChecksIssueDetailsListProps>('AutomatedChecksIssueDetailsList', props => {
    return (
        <BaseCardLayer>
            <div className="report-instances">
                <table className="report-instance-table">
                    <tbody>
                        <AutomatedChecksIssueDetailsInstances {...props} />
                    </tbody>
                </table>
            </div>
        </BaseCardLayer>
    );
});
