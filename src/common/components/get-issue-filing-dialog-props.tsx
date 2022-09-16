// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { IssueFilingNeedsSettingsContentProps } from 'common/types/issue-filing-needs-setting-content';
import {
    IssueFilingServiceProperties,
    UserConfigurationStoreData,
} from 'common/types/store-data/user-configuration-store';
import { IssueFilingDialogDeps } from 'DetailsView/components/issue-filing-dialog';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';

export type IssueFilingDialogPropsFactory = (
    userConfigurationStoreData: UserConfigurationStoreData,
    cardsViewStoreData: CardsViewStoreData,
    cardsViewController: CardsViewController,
    deps: IssueFilingDialogDeps,
) => IssueFilingNeedsSettingsContentProps;

export const getIssueFilingDialogProps: IssueFilingDialogPropsFactory = (
    userConfigurationStoreData: UserConfigurationStoreData,
    cardsViewStoreData: CardsViewStoreData,
    cardsViewController: CardsViewController,
    deps: IssueFilingDialogDeps,
) => {
    const selectedIssueFilingService: IssueFilingService = deps.issueFilingServiceProvider.forKey(
        userConfigurationStoreData.bugService,
    );
    const selectedIssueFilingServiceData: IssueFilingServiceProperties =
        selectedIssueFilingService.getSettingsFromStoreData(
            userConfigurationStoreData.bugServicePropertiesMap,
        );
    return {
        deps,
        isOpen: cardsViewStoreData.isIssueFilingSettingsDialogOpen,
        selectedIssueFilingService,
        selectedIssueData: cardsViewStoreData.selectedIssueData,
        selectedIssueFilingServiceData,
        onClose: cardsViewController.closeIssueFilingSettingsDialog,
        issueFilingServicePropertiesMap: userConfigurationStoreData.bugServicePropertiesMap,
        afterClosed: cardsViewStoreData.onIssueFilingSettingsClosedCallback,
    };
};
