// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import {
    CardFooterMenuItem,
    CardFooterMenuItemsBuilder,
    CardFooterMenuItemsDeps,
    CardFooterMenuItemsProps,
} from 'common/components/cards/card-footer-menu-items-builder';
import { CardInteractionSupport } from 'common/components/cards/card-interaction-support';
import { Toast } from 'common/components/toast';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { NavigatorUtils } from 'common/navigator-utils';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import {
    IssueFilingServiceProperties,
    IssueFilingServicePropertiesMap,
    UserConfigurationStoreData,
} from 'common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import React from 'react';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { IMock, It, Mock, Times } from 'typemoq';

describe(CardFooterMenuItemsBuilder, () => {
    let props: CardFooterMenuItemsProps;
    let deps: CardFooterMenuItemsDeps;
    const fileIssueButtonRef = () => null;
    const issueDetailsData = { snippet: 'test snipper' } as CreateIssueDetailsTextData;
    const userConfigurationStoreData = {
        bugService: 'test-bug-service',
        bugServicePropertiesMap: { 'test-bug-service': {} } as IssueFilingServicePropertiesMap,
    } as UserConfigurationStoreData;
    const cardInteractionSupport = {
        supportsCopyFailureDetails: true,
        supportsIssueFiling: true,
    } as CardInteractionSupport;
    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'scan engine name',
            version: 'test version',
        },
        applicationProperties: {
            name: 'test application',
        },
    };
    const clickEvent = {} as React.MouseEvent<any>;

    let toastMock: IMock<Toast>;
    let issueFilingActionMessageCreatorMock: IMock<IssueFilingActionMessageCreator>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let issueDetailsTextGeneratorMock: IMock<IssueDetailsTextGenerator>;
    let navigatorUtilsMock: IMock<NavigatorUtils>;

    let openNeedsSettingsContentMock: IMock<() => void>;
    let closeNeedsSettingsContentMock: IMock<() => void>;

    let testSubject: CardFooterMenuItemsBuilder;

    beforeEach(() => {
        issueFilingActionMessageCreatorMock = Mock.ofType<IssueFilingActionMessageCreator>();
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        issueFilingServiceProviderMock = Mock.ofType<IssueFilingServiceProvider>();
        issueDetailsTextGeneratorMock = Mock.ofType<IssueDetailsTextGenerator>();
        navigatorUtilsMock = Mock.ofType<NavigatorUtils>();
        toastMock = Mock.ofType<Toast>();

        openNeedsSettingsContentMock = Mock.ofInstance(() => null);
        closeNeedsSettingsContentMock = Mock.ofInstance(() => null);

        const toastRef = {
            current: toastMock.object,
        } as React.RefObject<Toast>;

        deps = {
            cardInteractionSupport,
            toolData,
            issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            issueDetailsTextGenerator: issueDetailsTextGeneratorMock.object,
            navigatorUtils: navigatorUtilsMock.object,
        };

        props = {
            toastRef,
            fileIssueButtonRef,
            issueDetailsData,
            userConfigurationStoreData,
            deps,
            openNeedsSettingsContent: openNeedsSettingsContentMock.object,
            closeNeedsSettingsContent: closeNeedsSettingsContentMock.object,
        };

        testSubject = new CardFooterMenuItemsBuilder();
    });

    afterEach(() => {
        issueFilingActionMessageCreatorMock.verifyAll();
        openNeedsSettingsContentMock.verifyAll();
        closeNeedsSettingsContentMock.verifyAll();
        issueDetailsTextGeneratorMock.verifyAll();
        detailsViewActionMessageCreatorMock.verifyAll();
        navigatorUtilsMock.verifyAll();
        toastMock.verifyAll();
    });

    it.each([
        [true, true],
        [true, false],
        [false, true],
        [false, false],
    ])(
        'Returns expected menu items: supportsIssueFiling=%s supportsCopyFailureDetails=%s',
        (supportsIssueFiling: boolean, supportsCopyFailureDetails: boolean) => {
            deps.cardInteractionSupport = {
                supportsIssueFiling,
                supportsCopyFailureDetails,
            } as CardInteractionSupport;

            const menuItems = testSubject.getCardFooterMenuItems(props);

            expect(menuItems).toMatchSnapshot();
        },
    );

    describe('File issue onClick', () => {
        const issueFilingServiceProperties: IssueFilingServiceProperties = {};
        let bugFilingServiceMock: IMock<IssueFilingService>;

        beforeEach(() => {
            bugFilingServiceMock = Mock.ofType<IssueFilingService>();

            issueFilingServiceProviderMock
                .setup(provider => provider.forKey(userConfigurationStoreData.bugService))
                .returns(() => bugFilingServiceMock.object)
                .verifiable(Times.once());
            bugFilingServiceMock
                .setup(b =>
                    b.getSettingsFromStoreData(userConfigurationStoreData.bugServicePropertiesMap),
                )
                .returns(() => issueFilingServiceProperties)
                .verifiable(Times.once());
        });

        afterEach(() => {
            bugFilingServiceMock.verifyAll();
        });

        it('with invalid settings', () => {
            bugFilingServiceMock
                .setup(b => b.isSettingsValid(issueFilingServiceProperties))
                .returns(() => false)
                .verifiable(Times.once());

            issueFilingActionMessageCreatorMock
                .setup(i => i.fileIssue(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
                .verifiable(Times.never());

            openNeedsSettingsContentMock.setup(o => o()).verifiable(Times.once());
            closeNeedsSettingsContentMock.setup(c => c()).verifiable(Times.never());

            const fileIssueMenuItem = getFileIssueMenuItem();
            fileIssueMenuItem.onClick();
        });

        it('with valid settings', () => {
            bugFilingServiceMock
                .setup(b => b.isSettingsValid(issueFilingServiceProperties))
                .returns(() => true)
                .verifiable(Times.once());

            issueFilingActionMessageCreatorMock
                .setup(i =>
                    i.fileIssue(
                        clickEvent,
                        userConfigurationStoreData.bugService,
                        issueDetailsData,
                        toolData,
                    ),
                )
                .verifiable(Times.once());

            openNeedsSettingsContentMock.setup(o => o()).verifiable(Times.never());
            closeNeedsSettingsContentMock.setup(c => c()).verifiable(Times.once());

            const fileIssueMenuItem = getFileIssueMenuItem();
            fileIssueMenuItem.onClick(clickEvent);
        });
    });

    describe('Copy failure details onClick', () => {
        const issueDetailsText = 'issue details text';

        beforeEach(() => {
            issueDetailsTextGeneratorMock
                .setup(i => i.buildText(issueDetailsData, toolData))
                .returns(() => issueDetailsText);

            detailsViewActionMessageCreatorMock
                .setup(d => d.copyIssueDetailsClicked(clickEvent))
                .verifiable(Times.once());
        });

        it("Shows toast with 'Failure details copied'", async () => {
            navigatorUtilsMock
                .setup(n => n.copyToClipboard(issueDetailsText))
                .verifiable(Times.once());
            toastMock.setup(t => t.show('Failure details copied.')).verifiable(Times.once());

            const copyFailureDetailsMenuItem = getCopyFailureDetailsMenuItem();
            copyFailureDetailsMenuItem.onClick(clickEvent);

            await flushSettledPromises();
        });

        it('handles null ref', async () => {
            props.toastRef = {} as React.RefObject<Toast>;

            navigatorUtilsMock
                .setup(n => n.copyToClipboard(issueDetailsText))
                .verifiable(Times.once());
            toastMock.setup(t => t.show(It.isAny())).verifiable(Times.never());

            const copyFailureDetailsMenuItem = getCopyFailureDetailsMenuItem();
            copyFailureDetailsMenuItem.onClick(clickEvent);

            await flushSettledPromises();
        });

        it('handles copy error', async () => {
            const error = new Error('Test error');

            navigatorUtilsMock
                .setup(n => n.copyToClipboard(issueDetailsText))
                .returns(async () => {
                    throw error;
                });
            toastMock
                .setup(t => t.show('Failed to copy failure details. Please try again.'))
                .verifiable(Times.once());

            const copyFailureDetailsMenuItem = getCopyFailureDetailsMenuItem();
            copyFailureDetailsMenuItem.onClick(clickEvent);

            await flushSettledPromises();
        });

        it('handles copy error with null ref', async () => {
            const error = new Error('Test error');
            props.toastRef = {} as React.RefObject<Toast>;

            navigatorUtilsMock
                .setup(n => n.copyToClipboard(issueDetailsText))
                .returns(async () => {
                    throw error;
                });
            toastMock.setup(t => t.show(It.isAny())).verifiable(Times.never());

            const copyFailureDetailsMenuItem = getCopyFailureDetailsMenuItem();
            copyFailureDetailsMenuItem.onClick(clickEvent);

            await flushSettledPromises();
        });
    });

    function getFileIssueMenuItem(): CardFooterMenuItem {
        const menuItems = testSubject.getCardFooterMenuItems(props);
        return menuItems.find(item => item.key === 'fileissue');
    }

    function getCopyFailureDetailsMenuItem(): CardFooterMenuItem {
        const menuItems = testSubject.getCardFooterMenuItems(props);
        return menuItems.find(item => item.key === 'copyfailuredetails');
    }
});
