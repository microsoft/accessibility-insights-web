// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { AxeNodeResult, RuleResult } from '../../scanner/iruleresults';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { issueTrackerPathPrefix, issueTrackerPathSuffix } from '../../content/settings/issue-tracker';

export interface IBugButtonDeps {
    issueTrackerPath: string;
    pageTitle: string;
    pageUrl: string;
    issueTextGenerator: IssueDetailsTextGenerator;
}
export interface IBugButtonProps {
    deps: IBugButtonDeps;
    ruleResult: DecoratedAxeNodeResult;
}

export class BugButton extends React.Component<IBugButtonProps> {
    public issueUrl(title, body) {
        const baseUrl = `${issueTrackerPathPrefix}${this.props.deps.issueTrackerPath}${issueTrackerPathSuffix}`;
        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        return `${baseUrl}${encodedIssue}`;
    }
    public render(): JSX.Element {
        const issueDetsData = {
            pageTitle: this.props.deps.pageTitle,
            pageUrl: this.props.deps.pageUrl,
            ruleResult: this.props.ruleResult,
        };

        const title = this.props.deps.issueTextGenerator.buildTitle(issueDetsData);
        const body = this.props.deps.issueTextGenerator.buildText(issueDetsData);

        return (
            <Link className="bugs-details-view" taget="_blank" href={this.issueUrl(title, body)}>
                <Icon className="create-bug-button" iconName="Add" />
                {'New bug'}
            </Link>
        );
    }
}
