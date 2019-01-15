// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { WindowUtils } from '../window-utils';
import { Toast } from './toast';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import * as CopyToClipboard from 'react-copy-to-clipboard';

export type CopyIssueDetailsButtonDeps = {
    windowUtils: WindowUtils;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type CopyIssueDetailsButtonProps = {
    deps: CopyIssueDetailsButtonDeps,
    issueDetailsData: CreateIssueDetailsTextData;
    onClick: (clickEvent: React.MouseEvent<any>) => void;
};

export type CopyIssueDetailsButtonState = {
    showingCopyToast: boolean;
};

export class CopyIssueDetailsButton extends React.Component<CopyIssueDetailsButtonProps, CopyIssueDetailsButtonState> {
    constructor(props: CopyIssueDetailsButtonProps) {
        super(props);
        this.state = { showingCopyToast: false };
    }

    private getIssueDetailsText(result: DecoratedAxeNodeResult): string {
        const data: CreateIssueDetailsTextData = {
            pageTitle: this.props.issueDetailsData.pageTitle,
            pageUrl: this.props.issueDetailsData.pageUrl,
            ruleResult: result,
        };
        return this.props.deps.issueDetailsTextGenerator.buildText(data);
    }

    @autobind
    private copyButtonClicked(event: React.MouseEvent<any>): void {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
        this.setState({ showingCopyToast: true });
    }

    public render(): JSX.Element {
        return (
            <>
                { this.state.showingCopyToast
                    ? <Toast onTimeout={() => this.setState({ showingCopyToast: false })}
                            deps={this.props.deps}>
                        Failure details copied.
                    </Toast>
                    : null
                }
                <CopyToClipboard text={this.getIssueDetailsText(this.props.issueDetailsData.ruleResult)}>
                    <DefaultButton
                        iconProps={{ iconName: 'Copy' }}
                        className={'copy-issue-details-button'}
                        onClick={this.copyButtonClicked}
                    >
                    Copy failure details
                    </DefaultButton>
                </CopyToClipboard>
            </>
        );
    }
}
