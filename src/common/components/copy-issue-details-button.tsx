// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { NavigatorUtils } from 'common/navigator-utils';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';

import { CopyIcon } from '../../common/icons/copy-icon';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { Toast, ToastDeps } from './toast';

export type CopyIssueDetailsButtonDeps = ToastDeps & {
    navigatorUtils: NavigatorUtils;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
    toolData: ToolData;
};

export type CopyIssueDetailsButtonProps = {
    deps: CopyIssueDetailsButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    onClick: (clickEvent: React.MouseEvent<any>) => void;
    hasSecureTargetPage: boolean;
};

export class CopyIssueDetailsButton extends React.Component<CopyIssueDetailsButtonProps> {
    private toastRef: React.RefObject<Toast>;
    constructor(props: CopyIssueDetailsButtonProps) {
        super(props);
        this.toastRef = React.createRef();
    }

    private getIssueDetailsText(issueData: CreateIssueDetailsTextData): string {
        return this.props.deps.issueDetailsTextGenerator.buildText(
            issueData,
            this.props.deps.toolData,
        );
    }

    private copyButtonClicked = async (event: React.MouseEvent<any>): Promise<void> => {
        const toast = this.toastRef.current;
        if (toast == null) {
            // This is very rare (only if the button is clicked mid-initial-render of the Toast)
            return;
        }

        if (this.props.onClick) {
            this.props.onClick(event);
        }
        try {
            await this.props.deps.navigatorUtils.copyToClipboard(
                this.getIssueDetailsText(this.props.issueDetailsData),
            );
        } catch (error) {
            if (this.props.hasSecureTargetPage) {
                toast.show('Failed to copy failure details. Please try again.');
            }
            return;
        }
        toast.show('Failure details copied.');
    };

    public render(): JSX.Element {
        return (
            <>
                <Toast ref={this.toastRef} deps={this.props.deps} />
                <DefaultButton
                    className={'copy-issue-details-button'}
                    onClick={this.copyButtonClicked}
                >
                    <CopyIcon />
                    <div className="ms-Button-label">Copy failure details</div>
                </DefaultButton>
            </>
        );
    }
}
