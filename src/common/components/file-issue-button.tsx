// Fileright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { WindowUtils } from '../window-utils';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import * as FileToClipboard from 'react-copy-to-clipboard';
import { ActionAndCancelButtonsComponent } from '../../DetailsView/components/action-and-cancel-buttons-component';

export type FileIssueDetailsButtonDeps = {
    windowUtils: WindowUtils;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
};

export type FileIssueDetailsButtonProps = {
    deps: FileIssueDetailsButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    issueTrackerPath: string;
    // onClick: (clickEvent: React.MouseEvent<any>) => void;
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
    private openSettings(id: string): void {
        // TODO
    }

    public render(): JSX.Element {
        return (
            <>
            <Modal
                titleAriaId="fileIssueDetailsModal"
                subtitleAriaId="subtitleId"
                isOpen={this.state.showingFileIssueModal}
                onDismiss={this.closeModal}
                isBlocking={false}
                containerClassName="ms-file-issue-details-modal-container"
            >
                    <p>
                        File Issue
                    </p>
                    <p>
                        Issue filing location must be configured before filing bugs.
                        Enter in the location information into settings in order to
                        file issues.
                    </p>
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonText="Go to settings"
                    primaryButtonDisabled={false}
                    primaryButtonOnClick={this.openSettings}
                    cancelButtonOnClick={this.closeModal}
                />
            </Modal>
            <DefaultButton
                iconProps={{ iconName: 'Copy' }}
                className={'copy-issue-details-button'}
                onClick={() => this.setState({ showingFileIssueModal: true })}
            >
            Open the modal!!!
            </DefaultButton>
            <Link className="bugs-details-view" target="_blank" href={this.getIssueDetailsUrl(this.props.issueDetailsData.ruleResult)}>
                <Icon className="create-bug-button" iconName="Add" />
                {'New bug'}
            </Link>
            </>
        );
        /*
        return (
            <>
                {this.state.showingFileIssueToast ? (
                    <Toast onTimeout={() => this.setState({ showingFileIssueToast: false })} deps={this.props.deps}>
                        Failure details copied.
                    </Toast>
                ) : null}
                <FileToClipboard text={this.getIssueDetailsText(this.props.issueDetailsData.ruleResult)}>
                    <DefaultButton
                        iconProps={{ iconName: 'File' }}
                        className={'copy-issue-details-button'}
                        onClick={this.copyButtonClicked}
                    >
                        File failure details
                    </DefaultButton>
                </FileToClipboard>
            </>
        );
         */
    }
}
