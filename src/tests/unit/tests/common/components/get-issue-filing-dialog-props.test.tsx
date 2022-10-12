// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { getIssueFilingDialogProps } from 'common/components/get-issue-filing-dialog-props';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import {
    IssueFilingServicePropertiesMap,
    UserConfigurationStoreData,
} from 'common/types/store-data/user-configuration-store';
import { IssueFilingDialogDeps } from 'DetailsView/components/issue-filing-dialog';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import { IMock, Mock } from 'typemoq';

describe(getIssueFilingDialogProps, () => {
    const issueFilingKey = 'test-key';
    let deps: IssueFilingDialogDeps;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let testIssueFilingServiceStub: IssueFilingService;
    const cardsViewControllerStub = {
        closeIssueFilingSettingsDialog: () => null,
    } as CardsViewController;

    const userConfigurationStoreData = {
        bugService: issueFilingKey,
        bugServicePropertiesMap: {
            [issueFilingKey]: {},
        } as IssueFilingServicePropertiesMap,
    } as UserConfigurationStoreData;

    beforeEach(() => {
        testIssueFilingServiceStub = {
            getSettingsFromStoreData: data => data[issueFilingKey],
        } as IssueFilingService;
        issueFilingServiceProviderMock = Mock.ofType<IssueFilingServiceProvider>();
        issueFilingServiceProviderMock
            .setup(bp => bp.forKey(issueFilingKey))
            .returns(() => testIssueFilingServiceStub);
        deps = {
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
        } as IssueFilingDialogDeps;
    });

    it.each([true, false])('renders with isOpen=%s', isOpen => {
        const cardsViewStoreData: CardsViewStoreData = {
            isIssueFilingSettingsDialogOpen: isOpen,
            onIssueFilingSettingsClosedCallback: isOpen ? () => null : undefined,
            selectedIssueData: isOpen
                ? ({ snippet: 'test snippet' } as CreateIssueDetailsTextData)
                : undefined,
        };
        const expectedProps = {
            deps,
            isOpen: isOpen,
            selectedIssueFilingService: testIssueFilingServiceStub,
            selectedIssueData: cardsViewStoreData.selectedIssueData,
            selectedIssueFilingServiceData: {},
            onClose: cardsViewControllerStub.closeIssueFilingSettingsDialog,
            issueFilingServicePropertiesMap: userConfigurationStoreData.bugServicePropertiesMap,
            afterClosed: cardsViewStoreData.onIssueFilingSettingsClosedCallback,
        };

        const props = getIssueFilingDialogProps(
            userConfigurationStoreData,
            cardsViewStoreData,
            cardsViewControllerStub,
            deps,
        );

        expect(props).toEqual(expectedProps);
    });
});
