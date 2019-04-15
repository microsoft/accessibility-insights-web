// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { BugFilingService } from '../../bug-filing/types/bug-filing-service';
import { IssueFilingDialog, IssueFilingDialogDeps } from '../../DetailsView/components/issue-filing-dialog';
import { EnvironmentInfo } from '../environment-info-provider';
import { LadyBugSolidIcon } from '../icons/lady-bug-solid-icon';
import { BugActionMessageCreator } from '../message-creators/bug-action-message-creator';
import { FileIssueClickService } from '../telemetry-events';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { BugServiceProperties, UserConfigurationStoreData } from '../types/store-data/user-configuration-store';

export type IssueFilingButtonDeps = {
    bugActionMessageCreator: BugActionMessageCreator;
} & IssueFilingDialogDeps;

export type IssueFilingButtonProps = {
    deps: IssueFilingButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    userConfigurationStoreData: UserConfigurationStoreData;
};

export type IssueFilingButtonState = {
    isSettingsDialogOpen: boolean;
};

export class IssueFilingButton extends React.Component<IssueFilingButtonProps, IssueFilingButtonState> {
    constructor(props) {
        super(props);
        this.state = {
            isSettingsDialogOpen: false,
        };
    }

    public render(): JSX.Element {
        const { issueDetailsData, userConfigurationStoreData, deps } = this.props;
        const { environmentInfoProvider, bugFilingServiceProvider } = deps;
        const envInfo: EnvironmentInfo = environmentInfoProvider.getEnvironmentInfo();
        const selectedBugFilingService: BugFilingService = bugFilingServiceProvider.forKey(userConfigurationStoreData.bugService);
        const selectedBugFilingServiceData: BugServiceProperties = selectedBugFilingService.getSettingsFromStoreData(
            userConfigurationStoreData.bugServicePropertiesMap,
        );
        const isSettingValid = selectedBugFilingService.isSettingsValid(selectedBugFilingServiceData);
        const href = isSettingValid
            ? selectedBugFilingService.createBugFilingUrl(selectedBugFilingServiceData, issueDetailsData, envInfo)
            : '#';
        const target: string = isSettingValid ? '_blank' : '_self';

        return (
            <>
                <DefaultButton
                    className={'create-bug-button'}
                    target={target}
                    onClick={event => this.onClickFileIssueButton(event, isSettingValid)}
                    href={href}
                >
                    <LadyBugSolidIcon />
                    <div className="ms-Button-label">File issue</div>
                </DefaultButton>
                <IssueFilingDialog
                    deps={deps}
                    isOpen={this.state.isSettingsDialogOpen}
                    selectedBugFilingService={selectedBugFilingService}
                    selectedBugData={issueDetailsData}
                    selectedBugFilingServiceData={selectedBugFilingServiceData}
                    onClose={this.closeDialog}
                    bugFileTelemetryCallback={this.trackFileIssueClick}
                />
            </>
        );
    }

    @autobind
    private trackFileIssueClick(event: React.MouseEvent<any>): void {
        const bugServiceKey = this.props.userConfigurationStoreData.bugService;
        this.props.deps.bugActionMessageCreator.trackFileIssueClick(event, bugServiceKey as FileIssueClickService);
    }

    @autobind
    private closeDialog(): void {
        this.setState({ isSettingsDialogOpen: false });
    }

    private openDialog(): void {
        this.setState({ isSettingsDialogOpen: true });
    }

    @autobind
    private onClickFileIssueButton(event: React.MouseEvent<any>, isSettingValid: boolean): void {
        if (isSettingValid) {
            this.trackFileIssueClick(event);
        } else {
            this.openDialog();
        }
    }
}
