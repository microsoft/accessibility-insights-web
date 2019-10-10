// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { CopyIcon } from '../../common/icons/copy-icon';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { WindowUtils } from '../window-utils';
import { Toast } from './toast';

export type CopyIssueDetailsButtonDeps = {
    windowUtils: WindowUtils;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type CopyIssueDetailsButtonProps = {
    deps: CopyIssueDetailsButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    onClick: (clickEvent: React.MouseEvent<any>) => void;
};

export class CopyIssueDetailsButton extends React.Component<CopyIssueDetailsButtonProps> {
    constructor(props: CopyIssueDetailsButtonProps) {
        super(props);
    }

    private getIssueDetailsText(issueData: CreateIssueDetailsTextData): string {
        return this.props.deps.issueDetailsTextGenerator.buildText(issueData);
    }

    private copyButtonClicked = (event: React.MouseEvent<any>): void => {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    };

    public render(): JSX.Element {
        return (
            <>
                <Toast ref="toast" deps={this.props.deps}>
                    Failure details copied.
                </Toast>
                <CopyToClipboard text={this.getIssueDetailsText(this.props.issueDetailsData)}>
                    <DefaultButton className={'copy-issue-details-button'} onClick={this.copyButtonClicked}>
                        <CopyIcon />
                        <div className="ms-Button-label">Copy failure details</div>
                    </DefaultButton>
                </CopyToClipboard>
            </>
        );
    }
}
