// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { IssueFilingDialog } from '../../../DetailsView/components/issue-filing-dialog';
import { IssueFilingService } from '../../../issue-filing/types/issue-filing-service';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { IssueFilingNeedsSettingsContentProps } from '../../types/issue-filing-needs-setting-content';
import { IssueFilingServiceProperties, UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { IssueFilingButtonDeps } from '../issue-filing-button';
import { kebabMenuButton } from './card-footer.scss';

export type CardKebabMenuButtonDeps = {} & IssueFilingButtonDeps;

export interface CardKebabMenuButtonState {
    isContextMenuVisible: boolean;
    showNeedsSettingsContent: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface CardKebabMenuButtonProps {
    deps: CardKebabMenuButtonDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    issueDetailsData: CreateIssueDetailsTextData;
}

export class CardKebabMenuButton extends React.Component<CardKebabMenuButtonProps, CardKebabMenuButtonState> {
    constructor(props: CardKebabMenuButtonProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
            showNeedsSettingsContent: false,
        };
    }

    public render(): JSX.Element {
        return (
            <div className={kebabMenuButton}>
                <ActionButton
                    iconProps={{
                        iconName: 'moreVertical',
                    }}
                    onClick={this.openDropdown}
                />
                {this.renderContextMenu()}
                {this.renderIssueFilingSettingContent()}
            </div>
        );
    }

    private renderContextMenu(): JSX.Element {
        if (!this.state.isContextMenuVisible) {
            return null;
        }

        return <ContextualMenu onDismiss={() => this.dismissDropdown()} target={this.state.target} items={this.getMenuItems()} />;
    }

    private getMenuItems(): IContextualMenuItem[] {
        const items: IContextualMenuItem[] = [
            {
                key: 'fileissue',
                name: 'File issue',
                iconProps: {
                    iconName: 'ladybugSolid',
                },
                onClick: this.fileIssue,
            },
            {
                key: 'copyfailuredetails',
                name: `Copy failure details`,
                iconProps: {
                    iconName: 'copy',
                },
                onClick: this.copyFailureDetails,
            },
        ];

        return items;
    }

    private fileIssue = (event: React.MouseEvent<any>): void => {
        const { issueDetailsData, userConfigurationStoreData, deps } = this.props;
        const { issueFilingServiceProvider, issueFilingActionMessageCreator } = deps;

        const selectedBugFilingService = issueFilingServiceProvider.forKey(userConfigurationStoreData.bugService);
        const selectedBugFilingServiceData = selectedBugFilingService.getSettingsFromStoreData(
            userConfigurationStoreData.bugServicePropertiesMap,
        );
        const isSettingValid = selectedBugFilingService.isSettingsValid(selectedBugFilingServiceData);

        if (isSettingValid) {
            issueFilingActionMessageCreator.fileIssue(event, userConfigurationStoreData.bugService, issueDetailsData);
            this.closeNeedsSettingsContent();
        } else {
            this.openNeedsSettingsContent();
        }
    };

    private copyFailureDetails = (): void => {
        // todo
    };

    public renderIssueFilingSettingContent(): JSX.Element {
        const { deps, userConfigurationStoreData, issueDetailsData } = this.props;
        const { issueFilingServiceProvider } = deps;
        const selectedIssueFilingService: IssueFilingService = issueFilingServiceProvider.forKey(userConfigurationStoreData.bugService);
        const selectedIssueFilingServiceData: IssueFilingServiceProperties = selectedIssueFilingService.getSettingsFromStoreData(
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

        return <IssueFilingDialog {...needsSettingsContentProps} />;
    }

    private closeNeedsSettingsContent = (): void => {
        this.setState({ showNeedsSettingsContent: false });
    };

    private openNeedsSettingsContent(): void {
        this.setState({ showNeedsSettingsContent: true });
    }

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
