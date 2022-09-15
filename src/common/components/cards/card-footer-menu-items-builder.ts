// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    IButton,
    IButtonProps,
    IContextualMenuItem,
    IContextualMenuRenderItem,
    IRefObject,
} from '@fluentui/react';
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { CardInteractionSupport } from 'common/components/cards/card-interaction-support';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { Toast } from 'common/components/toast';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { NavigatorUtils } from 'common/navigator-utils';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import React from 'react';

export type CardFooterMenuItem = IContextualMenuItem & IButtonProps;

export type CardFooterMenuItemsProps = {
    fileIssueButtonRef: IRefObject<IButton> & IRefObject<IContextualMenuRenderItem>;
    toastRef: React.RefObject<Toast>;
    issueDetailsData: CreateIssueDetailsTextData;
    userConfigurationStoreData: UserConfigurationStoreData;
    deps: CardFooterMenuItemsDeps;
};

export type CardFooterMenuItemsDeps = {
    cardInteractionSupport: CardInteractionSupport;
    issueFilingActionMessageCreator: IssueFilingActionMessageCreator;
    toolData: ToolData;
    issueFilingServiceProvider: IssueFilingServiceProvider;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    navigatorUtils: NavigatorUtils;
    cardsViewController: CardsViewController;
};

export class CardFooterMenuItemsBuilder {
    constructor() {}

    public getCardFooterMenuItems(props: CardFooterMenuItemsProps): CardFooterMenuItem[] {
        const cardInteractionSupport = props.deps.cardInteractionSupport;
        const items: CardFooterMenuItem[] = [];

        if (cardInteractionSupport.supportsIssueFiling) {
            items.push({
                key: 'fileissue',
                text: 'File issue',
                iconProps: {
                    iconName: 'ladybugSolid',
                },
                onClick: event => this.fileIssue(props, event),
                componentRef: props.fileIssueButtonRef,
            });
        }

        if (cardInteractionSupport.supportsCopyFailureDetails) {
            items.push({
                key: 'copyfailuredetails',
                text: `Copy failure details`,
                iconProps: {
                    iconName: 'copy',
                },
                onClick: event => void this.copyFailureDetails(props, event),
            });
        }

        return items;
    }

    private fileIssue = (props: CardFooterMenuItemsProps, event: React.MouseEvent<any>): void => {
        const { issueDetailsData, userConfigurationStoreData, deps } = props;
        const {
            issueFilingServiceProvider,
            issueFilingActionMessageCreator,
            toolData,
            cardsViewController,
        } = deps;

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
            cardsViewController.closeIssueFilingSettingsDialog();
        } else {
            cardsViewController.openIssueFilingSettingsDialog();
        }
    };

    private copyFailureDetails = async (
        props: CardFooterMenuItemsProps,
        event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ): Promise<void> => {
        const { issueDetailsData, toastRef, deps } = props;
        const {
            issueDetailsTextGenerator,
            toolData,
            detailsViewActionMessageCreator,
            navigatorUtils,
        } = deps;

        const text = issueDetailsTextGenerator.buildText(issueDetailsData, toolData);
        detailsViewActionMessageCreator.copyIssueDetailsClicked(event);

        try {
            await navigatorUtils.copyToClipboard(text);
        } catch (error) {
            toastRef.current?.show('Failed to copy failure details. Please try again.');
            return;
        }
        toastRef.current?.show('Failure details copied.');
    };
}
