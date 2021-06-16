// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MoreActionsMenuIcon } from 'common/icons/more-actions-menu-icon';
import { ActionButton } from 'office-ui-fabric-react';
import { DirectionalHint, IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../../background/issue-details-text-generator';
import { DetailsViewActionMessageCreator } from '../../../DetailsView/actions/details-view-action-message-creator';
import { IssueFilingDialog } from '../../../DetailsView/components/issue-filing-dialog';
import { IssueFilingService } from '../../../issue-filing/types/issue-filing-service';
import { NavigatorUtils } from '../../navigator-utils';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { IssueFilingNeedsSettingsContentProps } from '../../types/issue-filing-needs-setting-content';
import {
    IssueFilingServiceProperties,
    UserConfigurationStoreData,
} from '../../types/store-data/user-configuration-store';
import { IssueFilingButtonDeps } from '../issue-filing-button';
import { Toast, ToastDeps } from '../toast';
import { CardInteractionSupport } from './card-interaction-support';
import * as styles from './card-kebab-menu-button.scss';

export type CardKebabMenuButtonDeps = {
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    navigatorUtils: NavigatorUtils;
    cardInteractionSupport: CardInteractionSupport;
} & IssueFilingButtonDeps &
    ToastDeps;

export interface CardKebabMenuButtonState {
    showNeedsSettingsContent: boolean;
}

export interface CardKebabMenuButtonProps {
    deps: CardKebabMenuButtonDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    issueDetailsData: CreateIssueDetailsTextData;
    kebabMenuAriaLabel?: string;
}

export class CardKebabMenuButton extends React.Component<
    CardKebabMenuButtonProps,
    CardKebabMenuButtonState
> {
    private toastRef: React.RefObject<Toast>;
    constructor(props: CardKebabMenuButtonProps) {
        super(props);
        this.toastRef = React.createRef();
        this.state = {
            showNeedsSettingsContent: false,
        };
    }

    public render(): JSX.Element | null {
        const menuItems = this.getMenuItems();
        if (menuItems.length === 0) {
            return null;
        }

        const handleKeyDown = (event: React.KeyboardEvent<any>) => {
            event.stopPropagation();
        };

        return (
            // The wrapper has to be a real element, not a <>, because we want the placeholder elements
            // the dialog/toast involve to be considered as part of the button for the purposes of layout
            // calculation in this component's parent.
            <div onKeyDown={handleKeyDown}>
                <ActionButton
                    className={styles.kebabMenuButton}
                    ariaLabel={this.props.kebabMenuAriaLabel || 'More actions'}
                    onRenderMenuIcon={MoreActionsMenuIcon}
                    menuProps={{
                        className: styles.kebabMenu,
                        directionalHint: DirectionalHint.bottomRightEdge,
                        shouldFocusOnMount: true,
                        items: this.getMenuItems(),
                        calloutProps: {
                            className: styles.kebabMenuCallout,
                        },
                    }}
                />
                {this.renderIssueFilingSettingContent()}
                {this.renderCopyFailureDetailsToast()}
            </div>
        );
    }

    public renderCopyFailureDetailsToast(): JSX.Element | null {
        const { cardInteractionSupport } = this.props.deps;

        if (!cardInteractionSupport.supportsCopyFailureDetails) {
            return null;
        }

        return <Toast ref={this.toastRef} deps={this.props.deps} />;
    }

    private getMenuItems(): IContextualMenuItem[] {
        const { cardInteractionSupport } = this.props.deps;
        const items: IContextualMenuItem[] = [];

        if (cardInteractionSupport.supportsIssueFiling) {
            items.push({
                key: 'fileissue',
                name: 'File issue',
                iconProps: {
                    iconName: 'ladybugSolid',
                },
                onClick: this.fileIssue,
            });
        }

        if (cardInteractionSupport.supportsCopyFailureDetails) {
            items.push({
                key: 'copyfailuredetails',
                name: `Copy failure details`,
                iconProps: {
                    iconName: 'copy',
                },
                onClick: event => {
                    this.copyFailureDetails(event);
                },
            });
        }

        return items;
    }

    private fileIssue = (event: React.MouseEvent<any>): void => {
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

    private copyFailureDetails = async (
        event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ): Promise<void> => {
        const text = this.props.deps.issueDetailsTextGenerator.buildText(
            this.props.issueDetailsData,
            this.props.deps.toolData,
        );
        this.props.deps.detailsViewActionMessageCreator.copyIssueDetailsClicked(event);

        try {
            await this.props.deps.navigatorUtils.copyToClipboard(text);
        } catch (error) {
            this.toastRef.current?.show('Failed to copy failure details. Please try again.');
            return;
        }
        this.toastRef.current?.show('Failure details copied.');
    };

    public renderIssueFilingSettingContent(): JSX.Element | null {
        const { deps, userConfigurationStoreData, issueDetailsData } = this.props;
        const { issueFilingServiceProvider, cardInteractionSupport } = deps;

        if (!cardInteractionSupport.supportsIssueFiling) {
            return null;
        }

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

        return <IssueFilingDialog {...needsSettingsContentProps} />;
    }

    private closeNeedsSettingsContent = (): void => {
        this.setState({ showNeedsSettingsContent: false });
    };

    private openNeedsSettingsContent(): void {
        this.setState({ showNeedsSettingsContent: true });
    }
}
