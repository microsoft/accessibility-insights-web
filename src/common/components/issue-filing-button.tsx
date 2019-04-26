// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { IssueFilingDialogDeps } from '../../DetailsView/components/issue-filing-dialog';
import { IssueFilingServiceProvider } from '../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../issue-filing/types/issue-filing-service';
import { EnvironmentInfo, EnvironmentInfoProvider } from '../environment-info-provider';
import { LadyBugSolidIcon } from '../icons/lady-bug-solid-icon';
import { BugActionMessageCreator } from '../message-creators/bug-action-message-creator';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import { IssueFilingNeedsSettingsContentProps, IssueFilingNeedsSettingsContentRenderer } from '../types/issue-filing-needs-setting-content';
import { IssueFilingServiceProperties, UserConfigurationStoreData } from '../types/store-data/user-configuration-store';

export type IssueFilingButtonDeps = {
    bugActionMessageCreator: BugActionMessageCreator;
    environmentInfoProvider: EnvironmentInfoProvider;
    issueFilingServiceProvider: IssueFilingServiceProvider;
} & IssueFilingDialogDeps;

export type IssueFilingButtonProps = {
    deps: IssueFilingButtonDeps;
    issueDetailsData: CreateIssueDetailsTextData;
    userConfigurationStoreData: UserConfigurationStoreData;
    needsSettingsContentRenderer: IssueFilingNeedsSettingsContentRenderer;
};

export type IssueFilingButtonState = {
    showNeedsSettingsContent: boolean;
};

export class IssueFilingButton extends React.Component<IssueFilingButtonProps, IssueFilingButtonState> {
    constructor(props) {
        super(props);
        this.state = {
            showNeedsSettingsContent: false,
        };
    }

    public render(): JSX.Element {
        const { issueDetailsData, userConfigurationStoreData, deps } = this.props;
        const { environmentInfoProvider, issueFilingServiceProvider } = deps;
        const envInfo: EnvironmentInfo = environmentInfoProvider.getEnvironmentInfo();
        const selectedIssueFilingService: IssueFilingService = issueFilingServiceProvider.forKey(userConfigurationStoreData.bugService);
        const selectedIssueFilingServiceData: IssueFilingServiceProperties = selectedIssueFilingService.getSettingsFromStoreData(
            userConfigurationStoreData.bugServicePropertiesMap,
        );
        const isSettingValid = selectedIssueFilingService.isSettingsValid(selectedIssueFilingServiceData);
        const href = isSettingValid
            ? selectedIssueFilingService.issueFilingUrlProvider(selectedIssueFilingServiceData, issueDetailsData, envInfo)
            : null;
        const target: string = isSettingValid ? '_blank' : '_self';

        const needsSettingsContentProps: IssueFilingNeedsSettingsContentProps = {
            deps,
            isOpen: this.state.showNeedsSettingsContent,
            selectedIssueFilingService,
            selectedIssueData: issueDetailsData,
            selectedIssueFilingServiceData,
            onClose: this.closeNeedsSettingsContent,
            fileIssueTelemetryCallback: this.trackFileIssueClick,
            issueFilingServicePropertiesMap: userConfigurationStoreData.bugServicePropertiesMap,
        };
        const NeedsSettingsContent = this.props.needsSettingsContentRenderer;

        return (
            <>
                <DefaultButton
                    className={'file-issue-button'}
                    target={target}
                    onClick={event => this.onClickFileIssueButton(event, isSettingValid)}
                    href={href}
                >
                    <LadyBugSolidIcon />
                    <div className="ms-Button-label">File issue</div>
                </DefaultButton>
                <NeedsSettingsContent {...needsSettingsContentProps} />
            </>
        );
    }

    @autobind
    private trackFileIssueClick(event: React.MouseEvent<any>): void {
        const bugServiceKey = this.props.userConfigurationStoreData.bugService;
        this.props.deps.bugActionMessageCreator.trackFileIssueClick(event, bugServiceKey);
    }

    @autobind
    private closeNeedsSettingsContent(): void {
        this.setState({ showNeedsSettingsContent: false });
    }

    private openNeedsSettingsContent(): void {
        this.setState({ showNeedsSettingsContent: true });
    }

    @autobind
    private onClickFileIssueButton(event: React.MouseEvent<any>, isSettingValid: boolean): void {
        if (isSettingValid) {
            this.trackFileIssueClick(event);
            this.closeNeedsSettingsContent();
        } else {
            this.openNeedsSettingsContent();
        }
    }
}
