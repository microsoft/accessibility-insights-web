// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { NewTabLink } from '../../common/components/new-tab-link';
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
    private issueUrl(title: string, body: string): void {
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
            <NewTabLink className="bugs-details-view" href={this.issueUrl(title, body)}>
                <Icon className="create-bug-button" iconName="Add" />
                {'New bug'}
            </NewTabLink>
        );
    }
}
