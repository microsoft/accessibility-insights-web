// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { NavigatorUtils } from 'common/navigator-utils';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { CopyIcon } from '../../common/icons/copy-icon';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { WindowUtils } from '../window-utils';
import { Toast } from './toast';

export type CopyIssueDetailsButtonDeps = {
    windowUtils: WindowUtils;
    navigatorUtils: NavigatorUtils;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type CopyIssueDetailsButtonProps = {
    deps: CopyIssueDetailsButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    onClick: (clickEvent: React.MouseEvent<any>) => void;
};

export class CopyIssueDetailsButton extends React.Component<CopyIssueDetailsButtonProps> {
    private toastRef: React.RefObject<Toast>;
    constructor(props: CopyIssueDetailsButtonProps) {
        super(props);
        this.toastRef = React.createRef();
    }

    private getIssueDetailsText(issueData: CreateIssueDetailsTextData): string {
        return this.props.deps.issueDetailsTextGenerator.buildText(issueData);
    }

    private copyButtonClicked = async (event: React.MouseEvent<any>): Promise<void> => {
        this.toastRef.current.show('Failure details copied.');
        if (this.props.onClick) {
            this.props.onClick(event);
        }
        try {
            await this.props.deps.navigatorUtils.copyToClipboard(this.getIssueDetailsText(this.props.issueDetailsData));
        } catch (error) {
            this.toastRef.current.show('Failed to copy failure details. Please try again.');
            return;
        }
        this.toastRef.current.show('Failure details copied.');
    };

    public render(): JSX.Element {
        return (
            <>
                <Toast ref={this.toastRef} deps={this.props.deps} />
                <DefaultButton className={'copy-issue-details-button'} onClick={this.copyButtonClicked}>
                    <CopyIcon />
                    <div className="ms-Button-label">Copy failure details</div>
                </DefaultButton>
            </>
        );
    }
}
