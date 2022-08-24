// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, DirectionalHint, IButton } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling';
import {
    CardFooterMenuItem,
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { MoreActionsMenuIcon } from 'common/icons/more-actions-menu-icon';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import * as React from 'react';
import { CardsViewController } from 'tests/electron/common/view-controllers/cards-view-controller';

import { IssueFilingDialog } from '../../../DetailsView/components/issue-filing-dialog';
import { IssueFilingService } from '../../../issue-filing/types/issue-filing-service';
import { CreateIssueDetailsTextData } from '../../types/create-issue-details-text-data';
import { IssueFilingNeedsSettingsContentProps } from '../../types/issue-filing-needs-setting-content';
import {
    IssueFilingServiceProperties,
    UserConfigurationStoreData,
} from '../../types/store-data/user-configuration-store';
import { IssueFilingButtonDeps } from '../issue-filing-button';
import { Toast, ToastDeps } from '../toast';
import { CardInteractionSupport } from './card-interaction-support';
import styles from './card-kebab-menu-button.scss';

registerIcons({
    icons: {
        MoreActionsMenuIcon: <MoreActionsMenuIcon />,
    },
});

export type CardFooterInstanceActionButtonsDeps = {
    cardInteractionSupport: CardInteractionSupport;
    cardFooterMenuItemsBuilder: CardFooterMenuItemsBuilder;
    issueFilingServiceProvider: IssueFilingServiceProvider;
    cardsViewController: CardsViewController;
} & IssueFilingButtonDeps &
    ToastDeps &
    CardFooterMenuItemsDeps;

export interface CardFooterInstanceActionButtonsProps {
    deps: CardFooterInstanceActionButtonsDeps;
    userConfigurationStoreData: UserConfigurationStoreData;
    issueDetailsData: CreateIssueDetailsTextData;
    kebabMenuAriaLabel?: string;
    narrowModeStatus?: NarrowModeStatus;
    cardsViewStoreData: CardsViewStoreData;
}

export class CardFooterInstanceActionButtons extends React.Component<CardFooterInstanceActionButtonsProps> {
    private toastRef: React.RefObject<Toast>;
    private fileIssueButtonRef: IButton | null;
    private kebabButtonRef: IButton | null;
    constructor(props: CardFooterInstanceActionButtonsProps) {
        super(props);
        this.toastRef = React.createRef();
    }

    public render(): JSX.Element | null {
        const menuItems = this.getMenuItems();
        if (menuItems.length === 0) {
            return null;
        }

        return (
            // The wrapper has to be a real element, not a <>, because we want the placeholder elements
            // the dialog/toast involve to be considered as part of the button for the purposes of layout
            // calculation in this component's parent.
            <div onKeyDown={event => event.stopPropagation()}>
                {this.renderButtons()}
                {this.renderIssueFilingSettingContent()}
                {this.renderCopyFailureDetailsToast()}
            </div>
        );
    }

    public renderButtons(): JSX.Element {
        if (this.props.narrowModeStatus?.isCardFooterCollapsed) {
            return this.renderKebabButton();
        } else {
            return this.renderExpandedButtons();
        }
    }

    public renderKebabButton(): JSX.Element {
        return (
            <ActionButton
                componentRef={ref => (this.kebabButtonRef = ref)}
                className={styles.kebabMenuButton}
                ariaLabel={this.props.kebabMenuAriaLabel || 'More actions'}
                menuIconProps={{
                    iconName: 'MoreActionsMenuIcon',
                    className: styles.kebabMenuIcon,
                }}
                menuProps={{
                    className: styles.kebabMenu,
                    directionalHint: DirectionalHint.bottomRightEdge,
                    shouldFocusOnMount: true,
                    items: this.getMenuItems(),
                }}
            />
        );
    }

    public renderExpandedButtons(): JSX.Element {
        const menuItems = this.getMenuItems();

        return (
            <>
                {menuItems.map(props => (
                    <span key={props.key}>
                        <ActionButton
                            onClick={props.onClick}
                            text={props.text}
                            iconProps={props.iconProps}
                            className={props.key}
                            componentRef={props.componentRef}
                        />
                    </span>
                ))}
            </>
        );
    }

    public renderCopyFailureDetailsToast(): JSX.Element | null {
        const { cardInteractionSupport } = this.props.deps;

        if (!cardInteractionSupport.supportsCopyFailureDetails) {
            return null;
        }

        return <Toast ref={this.toastRef} deps={this.props.deps} />;
    }

    private getMenuItems(): CardFooterMenuItem[] {
        return this.props.deps.cardFooterMenuItemsBuilder.getCardFooterMenuItems({
            ...this.props,
            toastRef: this.toastRef,
            fileIssueButtonRef: ref => (this.fileIssueButtonRef = ref),
        });
    }

    public renderIssueFilingSettingContent(): JSX.Element | null {
        const { deps, userConfigurationStoreData, issueDetailsData, cardsViewStoreData } =
            this.props;
        const { issueFilingServiceProvider, cardInteractionSupport, cardsViewController } = deps;

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
            isOpen: cardsViewStoreData.isIssueFilingSettingsDialogOpen,
            selectedIssueFilingService,
            selectedIssueData: issueDetailsData,
            selectedIssueFilingServiceData,
            onClose: cardsViewController.closeIssueFilingSettingsDialog,
            issueFilingServicePropertiesMap: userConfigurationStoreData.bugServicePropertiesMap,
            afterClosed: this.focusButtonAfterDialogClosed,
        };

        return <IssueFilingDialog {...needsSettingsContentProps} />;
    }

    private focusButtonAfterDialogClosed = (): void => {
        if (this.props.narrowModeStatus?.isCardFooterCollapsed) {
            this.kebabButtonRef?.focus();
        } else {
            this.fileIssueButtonRef?.focus();
        }
    };
}
