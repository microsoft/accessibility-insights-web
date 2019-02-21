// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { FileIssueDetailsHandler } from '../file-issue-details-handler';
import { ActionAndCancelButtonsComponent } from '../../DetailsView/components/action-and-cancel-buttons-component';

export type FileIssueDetailsButtonDeps = {
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type FileIssueDetailsButtonProps = {
    deps: FileIssueDetailsButtonDeps;
    onOpenSettings: (event: React.MouseEvent<HTMLElement>) => void;
    issueDetailsData: CreateIssueDetailsTextData;
    issueTrackerPath: string;
    fileIssueDetailsHandler: FileIssueDetailsHandler;
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
    private openSettings(event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>): void {
        this.props.onOpenSettings(event);
        this.closeModal();
    }

    public render(): JSX.Element {
        return (
            <>
                {!this.props.issueTrackerPath ? (
                    <DefaultButton
                        iconProps={{ iconName: 'ladybugSolid' }}
                        className={'create-bug-button'}
                        onClick={() => this.setState({ showingFileIssueModal: true })}
                    >
                        File issue
                    </DefaultButton>
                ) : null}
                {!!this.props.issueTrackerPath ? (
                    <DefaultButton
                        iconProps={{ iconName: 'ladybugSolid' }}
                        className={'create-bug-button'}
                        target="_blank"
                        href={this.getIssueDetailsUrl(this.props.issueDetailsData.ruleResult)}
                    >
                        File issue
                    </DefaultButton>
                ) : null}
                <Modal
                    titleAriaId="fileIssueDetailsModal"
                    isOpen={this.state.showingFileIssueModal}
                    onDismiss={this.closeModal}
                    isBlocking={false}
                    containerClassName="ms-file-issue-details-modal-container"
                    layerProps={{
                        className: 'ms-file-issue-details-modal-override',
                        onLayerDidMount: this.props.fileIssueDetailsHandler.onLayoutDidMount,
                    }}
                >
                    <h2>File Issue</h2>
                    <p>
                        Issue filing location must be configured before filing bugs. Enter in the location information into settings in
                        order to file issues.
                    </p>
                    <ActionAndCancelButtonsComponent
                        isHidden={false}
                        primaryButtonText="Go to settings"
                        primaryButtonDisabled={false}
                        primaryButtonOnClick={this.openSettings}
                        cancelButtonOnClick={this.closeModal}
                    />
                </Modal>
            </>
        );
    }
}
