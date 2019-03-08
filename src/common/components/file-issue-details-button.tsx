// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Callout, TooltipHost } from 'office-ui-fabric-react';
import { DefaultButton, IButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
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
    isCalloutVisible: boolean;
};

export class FileIssueDetailsButton extends React.Component<FileIssueDetailsButtonProps, FileIssueDetailsButtonState> {
    private button: React.RefObject<IButton> = React.createRef<IButton>();
    constructor(props: FileIssueDetailsButtonProps) {
        super(props);
        this.state = { showingFileIssueDialog: false, isCalloutVisible: false };
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

    private openDialog(): void {
        this.setState({ showingFileIssueDialog: true });
    }

    @autobind
    private openSettings(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.deps.bugActionMessageCreator.openSettingsPanel(event);
        this.closeDialog();
    }

    @autobind
    private onClickOpenSettingsButton(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.deps.bugActionMessageCreator.trackFileIssueClick(event, 'none');
        this.openDialog();
    }

    @autobind
    private onClickFileIssueButton(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.deps.bugActionMessageCreator.trackFileIssueClick(event, 'gitHub');
    }

    private getSettingsPanel(): HTMLElement | null {
        return document.querySelector('.ms-Panel-main');
    }

    private renderFileIssueButtonNeedsSettings(): JSX.Element {
        return (
            <>
                <DefaultButton
                    componentRef={this.button}
                    iconProps={{ iconName: 'ladybugSolid' }}
                    className={'create-bug-button'}
                    disabled={true}
                >
                    File issue
                </DefaultButton>
                <DefaultButton
                    componentRef={this.button}
                    iconProps={{ iconName: 'ladybugSolid' }}
                    className={'create-bug-button'}
                    disabled={true}
                    ariaLabel="Test zero content of aria label"
                >
                    Test zero
                </DefaultButton>
                <div tabIndex={0} title="Configure issue filing - test one" style={{ display: 'inline-block' }}>
                    <DefaultButton
                        componentRef={this.button}
                        iconProps={{ iconName: 'ladybugSolid' }}
                        className={'create-bug-button'}
                        disabled={true}
                        ariaLabel="Test one content of aria-label"
                    >
                        Test one
                    </DefaultButton>
                </div>
                <div style={{ display: 'inline-block' }} ref={this.calloutWrapperElement}>
                    <DefaultButton
                        componentRef={this.button}
                        iconProps={{ iconName: 'ladybugSolid' }}
                        className={'create-bug-button'}
                        onClick={this.testShowCallout}
                    >
                        Test callout
                    </DefaultButton>
                </div>
                <Callout
                    // ariaLabelledBy="calloutLabel"
                    // ariaDescribedBy="calloutDescription"
                    // style={{ zIndex: 2147483649 }}
                    role="alert"
                    aria-live="polite"
                    gapSpace={0}
                    target={this.calloutWrapperElement.current}
                    onDismiss={this.testDismissCallout}
                    setInitialFocus={true}
                    hidden={!this.state.isCalloutVisible}
                >
                    Hey, you need to configure settings for this button to work.
                </Callout>
                <TooltipHost
                    content="Set up issue filing in Settings to enable this button - test tooltip"
                    id="create-bug-button-tooltip"
                    calloutProps={{ gapSpace: 0 }}
                >
                    <DefaultButton
                        componentRef={this.button}
                        iconProps={{ iconName: 'ladybugSolid' }}
                        className={'create-bug-button'}
                        disabled={true}
                        aria-labelledby="create-bug-button-tooltip"
                    >
                        Test tooltip
                    </DefaultButton>
                </TooltipHost>
            </>
        );
    }

    private calloutWrapperElement = React.createRef<HTMLDivElement>();

    @autobind
    private testShowCallout(): void {
        this.setState({ isCalloutVisible: !this.state.isCalloutVisible });
    }

    @autobind
    private testDismissCallout(): void {
        this.setState({ isCalloutVisible: false });
    }

    private renderFileIssueButton(): JSX.Element {
        return (
            <DefaultButton
                componentRef={this.button}
                iconProps={{ iconName: 'ladybugSolid' }}
                className={'create-bug-button'}
                target="_blank"
                onClick={this.onClickFileIssueButton}
                href={this.getIssueDetailsUrl(this.props.issueDetailsData.ruleResult)}
            >
                File issue
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
