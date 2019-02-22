// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { HTMLElementUtils } from '../html-element-utils';
import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { FileIssueDetailsModal } from './file-issue-details-modal';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';

export type FileIssueDetailsButtonDeps = {
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type FileIssueDetailsButtonProps = {
    deps: FileIssueDetailsButtonDeps;
    onOpenSettings: (event: React.MouseEvent<HTMLElement>) => void;
    issueDetailsData: CreateIssueDetailsTextData;
    issueTrackerPath: string;
};

export type FileIssueDetailsButtonState = {
    showingFileIssueModal: boolean;
};

export class FileIssueDetailsButton extends React.Component<FileIssueDetailsButtonProps, FileIssueDetailsButtonState> {
    constructor(props: FileIssueDetailsButtonProps) {
        super(props);
        this.state = { showingFileIssueModal: false };
    }

    private getIssueDetailsUrl(result: DecoratedAxeNodeResult): string {
        const data: CreateIssueDetailsTextData = {
            pageTitle: this.props.issueDetailsData.pageTitle,
            pageUrl: this.props.issueDetailsData.pageUrl,
            ruleResult: result,
        };

        const title = this.props.deps.issueDetailsTextGenerator.buildTitle(data);
        const body = this.props.deps.issueDetailsTextGenerator.buildText(data);

        const encodedIssue = `/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        return `${this.props.issueTrackerPath}${encodedIssue}`;
    }

    @autobind
    private closeModal(): void {
        this.setState({ showingFileIssueModal: false });
    }

    @autobind
    private openModal(): void {
        this.setState({ showingFileIssueModal: true });
    }

    @autobind
    private openSettings(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.onOpenSettings(event);
        this.closeModal();
    }

    private renderOpenSettingsButton(): JSX.Element {
        return (
            <DefaultButton iconProps={{ iconName: 'ladybugSolid' }} className={'create-bug-button'} onClick={this.openModal}>
                File issue
            </DefaultButton>
        );
    }

    private renderFileIssueButton(): JSX.Element {
        return (
            <DefaultButton
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
                <FileIssueDetailsModal
                    onOpenSettings={this.openSettings}
                    onDismiss={this.closeModal}
                    isOpen={this.state.showingFileIssueModal}
                    fileIssueDetailsHandler={new FileIssueDetailsHandler(new HTMLElementUtils())}
                />
            </>
        );
    }
}
