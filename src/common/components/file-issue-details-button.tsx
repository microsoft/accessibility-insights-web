// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { HTMLElementUtils } from '../html-element-utils';
import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { FileIssueDetailsDialog } from './file-issue-details-dialog';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';
import { BugClickHandler } from '../bug-click-handler';

export type FileIssueDetailsButtonDeps = {
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type FileIssueDetailsButtonProps = {
    deps: FileIssueDetailsButtonDeps;
    onOpenSettings: (event: React.MouseEvent<HTMLElement>) => void;
    issueDetailsData: CreateIssueDetailsTextData;
    issueTrackerPath: string;
    restoreFocus: boolean;
};

export type FileIssueDetailsButtonState = {
    showingFileIssueDialog: boolean;
};

export class FileIssueDetailsButton extends React.Component<FileIssueDetailsButtonProps, FileIssueDetailsButtonState> {
    private button: React.RefObject<IButton> = React.createRef<IButton>();
    constructor(props: FileIssueDetailsButtonProps) {
        super(props);
        this.state = { showingFileIssueDialog: false };
    }

    private getIssueDetailsUrl(result: DecoratedAxeNodeResult): string {
        const data: CreateIssueDetailsTextData = {
            pageTitle: this.props.issueDetailsData.pageTitle,
            pageUrl: this.props.issueDetailsData.pageUrl,
            ruleResult: result,
        };

        const title = this.props.deps.issueDetailsTextGenerator.buildTitle(data);
        const body = this.props.deps.issueDetailsTextGenerator.buildGithubText(data);

        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        return `${this.props.issueTrackerPath}${encodedIssue}`;
    }

    @autobind
    private closeDialog(): void {
        this.setState({ showingFileIssueDialog: false });
    }

    @autobind
    private openDialog(): void {
        this.setState({ showingFileIssueDialog: true });
    }

    @autobind
    private openSettings(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.onOpenSettings(event);
        this.closeDialog();
    }

    private getSettingsPanel(): HTMLElement | null {
        return document.querySelector('.ms-Panel-main');
    }

    private renderOpenSettingsButton(): JSX.Element {
        return (
            <DefaultButton
                componentRef={this.button}
                iconProps={{ iconName: 'ladybugSolid' }}
                className={'create-bug-button'}
                onClick={this.openDialog}
            >
                File issue
            </DefaultButton>
        );
    }

    private renderFileIssueButton(): JSX.Element {
        return (
            <DefaultButton
                componentRef={this.button}
                iconProps={{ iconName: 'ladybugSolid' }}
                className={'create-bug-button'}
                target="_blank"
                href={this.getIssueDetailsUrl(this.props.issueDetailsData.ruleResult)}
            >
                File issue
            </DefaultButton>
        );
    }

    public render(): JSX.Element {
        return (
            <>
                {!this.props.issueTrackerPath ? this.renderOpenSettingsButton() : null}
                {!!this.props.issueTrackerPath ? this.renderFileIssueButton() : null}
                <FileIssueDetailsDialog
                    onOpenSettings={this.openSettings}
                    onDismiss={this.closeDialog}
                    buttonRef={this.button}
                    isOpen={this.state.showingFileIssueDialog}
                    restoreFocus={this.props.restoreFocus}
                    getSettingsPanel={this.getSettingsPanel}
                    fileIssueDetailsHandler={new FileIssueDetailsHandler(new HTMLElementUtils())}
                />
            </>
        );
    }
}
