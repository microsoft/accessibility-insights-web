// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { CopyIssueDetailsButton } from '../../common/components/copy-issue-details-button';
import { NewTabLink } from '../../common/components/new-tab-link';
import { ToastDeps } from '../../common/components/toast';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { CheckType } from '../../injected/components/details-dialog';
import { FixInstructionPanel } from '../../injected/components/fix-instruction-panel';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GuidanceLinks } from './guidance-links';

export type IssuesDetailsPaneDeps = ToastDeps & {
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface IssuesDetailsPaneProps {
    deps: IssuesDetailsPaneDeps;
    selectedIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
    pageTitle: string;
    pageUrl: string;
}

interface IssueDetailsState {
    showingCopyToast: boolean;
}

export class IssuesDetailsPane extends React.Component<IssuesDetailsPaneProps, IssueDetailsState> {
    constructor(props: IssuesDetailsPaneProps) {
        super(props);
        this.state = { showingCopyToast: false };
    }

    public render(): JSX.Element {
        return <div>{this.renderContent()}</div>;
    }
    private renderContent(): JSX.Element {
        const ids = Object.keys(this.props.selectedIdToRuleResultMap);
        if (ids.length !== 1) {
            return this.renderSelectMessage();
        }

        const result: DecoratedAxeNodeResult = this.props.selectedIdToRuleResultMap[ids[0]];
        return this.renderSingleIssue(result);
    }

    private renderSelectMessage(): JSX.Element {
        return (
            <div>
                <h2>Failure details</h2>
                <div className="issue-detail-select-message">Select a single failure to see its details here.</div>
            </div>
        );
    }

    private renderSingleIssue(result: DecoratedAxeNodeResult): JSX.Element {
        const issueData: CreateIssueDetailsTextData = {
            pageTitle: this.props.pageTitle,
            pageUrl: this.props.pageUrl,
            ruleResult: result,
        };
        return (
            <div>
                <h2>Failure details</h2>
                <CopyIssueDetailsButton
                    deps={this.props.deps}
                    issueDetailsData={issueData}
                    onClick={this.props.deps.detailsViewActionMessageCreator.copyIssueDetailsClicked}
                />
                <table className="issue-detail-table">
                    <tbody>
                        <tr>
                            <td>Rule</td>
                            <td>
                                <NewTabLink href={result.helpUrl}>{result.ruleId}</NewTabLink>
                                {`: ${result.help}`}
                                &nbsp;&nbsp;
                                <GuidanceLinks links={result.guidanceLinks} />
                            </td>
                        </tr>
                        <tr>
                            <td>How to fix</td>
                            <td className="fix-content">
                                <FixInstructionPanel checkType={CheckType.All} checks={result.all.concat(result.none)} />
                                <FixInstructionPanel checkType={CheckType.Any} checks={result.any} />
                            </td>
                        </tr>
                        <tr>
                            <td>Snippet</td>
                            <td className="snippet-content">{result.html}</td>
                        </tr>
                        <tr>
                            <td>Path</td>
                            <td className="path-content">{result.selector}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
