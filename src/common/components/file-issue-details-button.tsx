// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { isString } from 'lodash';
import { DefaultButton, IButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { LadyBugSolidIcon } from '../../common/icons/lady-bug-solid-icon';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';
import { HTMLElementUtils } from '../html-element-utils';
import { BugActionMessageCreator } from '../message-creators/bug-action-message-creator';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { FileIssueDetailsDialog } from './file-issue-details-dialog';

export type FileIssueDetailsButtonDeps = {
    bugActionMessageCreator: BugActionMessageCreator;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type FileIssueDetailsButtonProps = {
    deps: FileIssueDetailsButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    issueTrackerPath: string;
    restoreFocus: boolean;
};

export type FileIssueDetailsButtonState = {
    showingFileIssueDialog: boolean;
    showingHelpText: boolean;
};

export class FileIssueDetailsButton extends React.Component<FileIssueDetailsButtonProps, FileIssueDetailsButtonState> {
    private button: React.RefObject<IButton> = React.createRef<IButton>();
    constructor(props: FileIssueDetailsButtonProps) {
        super(props);
        this.state = { showingFileIssueDialog: false, showingHelpText: false };
    }

    public componentDidUpdate(): void {
        if (this.state.showingHelpText && isString(this.props.issueTrackerPath) && this.props.issueTrackerPath.length > 0) {
            this.setState({ showingHelpText: false });
        }
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
        let baseUrl = this.props.issueTrackerPath;

        if (baseUrl.indexOf('/issues') == -1) {
            baseUrl += '/issues';
        }

        return `${baseUrl}${encodedIssue}`;
    }

    @autobind
    private closeDialog(): void {
        this.setState({ showingFileIssueDialog: false });
    }

    @autobind
    private openSettings(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.deps.bugActionMessageCreator.openSettingsPanel(event);
        this.closeDialog();
    }

    @autobind
    private onClickFileIssueButton(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.deps.bugActionMessageCreator.trackFileIssueClick(event, 'gitHub');
    }

    @autobind
    private onClickFileIssueButtonNeedsSettings(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.deps.bugActionMessageCreator.trackFileIssueClick(event, 'none');
        this.setState({ showingHelpText: !this.state.showingHelpText });
    }

    private getSettingsPanel(): HTMLElement | null {
        return document.querySelector('.ms-Panel-main');
    }

    private renderFileIssueButtonNeedsSettings(): JSX.Element {
        return (
            <>
                <DefaultButton
                    componentRef={this.button}
                    className={'create-bug-button'}
                    onClick={this.onClickFileIssueButtonNeedsSettings}
                >
                    <LadyBugSolidIcon />
                    <div className="ms-Button-label">File issue</div>
                </DefaultButton>
                {this.renderHelpText()}
            </>
        );
    }

    private renderHelpText(): JSX.Element {
        if (this.state.showingHelpText) {
            return (
                <div role="alert" aria-live="polite" className="create-bug-button-help">
                    Go to Settings to configure issue filing.
                </div>
            );
        }
    }

    private renderFileIssueButton(): JSX.Element {
        return (
            <DefaultButton
                componentRef={this.button}
                className={'create-bug-button'}
                target="_blank"
                onClick={this.onClickFileIssueButton}
                href={this.getIssueDetailsUrl(this.props.issueDetailsData.ruleResult)}
            >
                <LadyBugSolidIcon />
                <div className="ms-Button-label">File issue</div>
            </DefaultButton>
        );
    }

    public render(): JSX.Element {
        return (
            <>
                {!this.props.issueTrackerPath ? this.renderFileIssueButtonNeedsSettings() : null}
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
