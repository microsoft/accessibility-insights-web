// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { AxeNodeResult, RuleResult } from '../../scanner/iruleresults';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { issueTrackerPathPrefix, issueTrackerPathSuffix } from '../../content/settings/issue-tracker';

export interface IBugFileDetails {
    issueTrackerPath: string;
    pageTitle: string;
    pageUrl: string;
    issueTextGenerator: IssueDetailsTextGenerator;
    selector: string;
}

export class BugButton extends React.Component<{ result: AxeNodeResult; ruleResult: DecoratedAxeNodeResult } & IBugFileDetails, {}> {
    public issueUrl(title, body) {
        const baseUrl = `${issueTrackerPathPrefix}${this.props.issueTrackerPath}${issueTrackerPathSuffix}`;
        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        return `${baseUrl}${encodedIssue}`;
    }
    public render(): JSX.Element {
        const issueDetsData = {
            pageTitle: this.props.pageTitle,
            pageUrl: this.props.pageUrl,
            ruleResult: this.props.ruleResult,
        };

        const title = this.props.issueTextGenerator.buildTitle(issueDetsData);
        const body = this.props.issueTextGenerator.buildText(issueDetsData);

        return (
            <Link className="bugs-details-view" taget="_blank" href={this.issueUrl(title, body)}>
                <Icon className="create-bug-button" iconName="Add" />
                {'New bug'}
            </Link>
        );
    }
}
