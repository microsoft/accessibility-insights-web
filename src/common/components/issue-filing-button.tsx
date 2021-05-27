// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';

import { IssueFilingDialogDeps } from '../../DetailsView/components/issue-filing-dialog';
import { IssueFilingServiceProvider } from '../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../issue-filing/types/issue-filing-service';
import { LadyBugSolidIcon } from '../icons/lady-bug-solid-icon';
import { IssueFilingActionMessageCreator } from '../message-creators/issue-filing-action-message-creator';
import { CreateIssueDetailsTextData } from '../types/create-issue-details-text-data';
import {
    IssueFilingNeedsSettingsContentProps,
    IssueFilingNeedsSettingsContentRenderer,
} from '../types/issue-filing-needs-setting-content';
import {
    IssueFilingServiceProperties,
    UserConfigurationStoreData,
} from '../types/store-data/user-configuration-store';

export type IssueFilingButtonDeps = {
    issueFilingActionMessageCreator: IssueFilingActionMessageCreator;
    toolData: ToolData;
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

export class IssueFilingButton extends React.Component<
    IssueFilingButtonProps,
    IssueFilingButtonState
> {
    constructor(props) {
        super(props);
        this.state = {
            showNeedsSettingsContent: false,
        };
    }

    public render(): JSX.Element {
        const { issueDetailsData, userConfigurationStoreData, deps } = this.props;
        const { issueFilingServiceProvider } = deps;
        const selectedIssueFilingService: IssueFilingService = issueFilingServiceProvider.forKey(
            userConfigurationStoreData.bugService,
        );
        const selectedIssueFilingServiceData: IssueFilingServiceProperties =
            selectedIssueFilingService.getSettingsFromStoreData(
                userConfigurationStoreData.bugServicePropertiesMap,
            );

        const needsSettingsContentProps: IssueFilingNeedsSettingsContentProps = {
            deps,
            isOpen: this.state.showNeedsSettingsContent,
            selectedIssueFilingService,
            selectedIssueData: issueDetailsData,
            selectedIssueFilingServiceData,
            onClose: this.closeNeedsSettingsContent,
            issueFilingServicePropertiesMap: userConfigurationStoreData.bugServicePropertiesMap,
        };
        const NeedsSettingsContent = this.props.needsSettingsContentRenderer;

        return (
            <>
                <DefaultButton
                    className={'file-issue-button'}
                    onClick={event => this.onClickFileIssueButton(event)}
                >
                    <LadyBugSolidIcon />
                    <div className="ms-Button-label">File issue</div>
                </DefaultButton>
                <NeedsSettingsContent {...needsSettingsContentProps} />
            </>
        );
    }

    private closeNeedsSettingsContent = (): void => {
        this.setState({ showNeedsSettingsContent: false });
    };

    private openNeedsSettingsContent(): void {
        this.setState({ showNeedsSettingsContent: true });
    }

    private onClickFileIssueButton = (event: React.MouseEvent<any>): void => {
        const { issueDetailsData, userConfigurationStoreData, deps } = this.props;
        const { issueFilingServiceProvider, issueFilingActionMessageCreator, toolData } = deps;

        const selectedBugFilingService = issueFilingServiceProvider.forKey(
            userConfigurationStoreData.bugService,
        );
        const selectedBugFilingServiceData = selectedBugFilingService.getSettingsFromStoreData(
            userConfigurationStoreData.bugServicePropertiesMap,
        );
        const isSettingValid = selectedBugFilingService.isSettingsValid(
            selectedBugFilingServiceData,
        );

        if (isSettingValid) {
            issueFilingActionMessageCreator.fileIssue(
                event,
                userConfigurationStoreData.bugService,
                issueDetailsData,
                toolData,
            );
            this.closeNeedsSettingsContent();
        } else {
            this.openNeedsSettingsContent();
        }
    };
}
