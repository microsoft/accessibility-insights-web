// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';

export interface IBugButtonDeps {
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
}
export interface IBugButtonProps {
    deps: IBugButtonDeps;
    issueTrackerPath: string;
    pageTitle: string;
    pageUrl: string;
    nodeResult: DecoratedAxeNodeResult;
}

export class BugButton extends React.Component<IBugButtonProps> {
    private issueUrl(title, body) {
        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        return `${this.props.issueTrackerPath}${encodedIssue}`;
    }
    public render(): JSX.Element {
        const issueDetailsData = {
            pageTitle: this.props.pageTitle,
            pageUrl: this.props.pageUrl,
            ruleResult: this.props.nodeResult,
        };

        const title = this.props.deps.issueDetailsTextGenerator.buildTitle(issueDetailsData);
        const body = this.props.deps.issueDetailsTextGenerator.buildText(issueDetailsData);

        return (
            <Link className="bugs-details-view" target="_blank" href={this.issueUrl(title, body)}>
                <Icon className="create-bug-button" iconName="Add" />
                {'New bug'}
            </Link>
        );
    }
}
