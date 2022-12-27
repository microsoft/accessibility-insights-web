// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { IssueFilingDialogPropsFactory } from 'common/components/get-issue-filing-dialog-props';
import { NamedFC } from 'common/react/named-fc';
import { IssueFilingNeedsSettingsContentProps } from 'common/types/issue-filing-needs-setting-content';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ContentPageInfo } from 'electron/types/content-page-info';
import { TestView, TestViewDeps, TestViewProps } from 'electron/views/results/test-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock } from 'typemoq';

describe('TestView', () => {
    let props: TestViewProps;
    let scanMetadataStub: ScanMetadata;
    let cardsViewDataStub: CardsViewModel;
    let cardsViewStoreDataStub: CardsViewStoreData;
    let userConfigurationStoreDataStub: UserConfigurationStoreData;
    let contentPageInfo: ContentPageInfo;
    let issueFilingPropsFactoryMock: IMock<IssueFilingDialogPropsFactory>;
    let cardsViewControllerMock: IMock<CardsViewController>;
    let deps: TestViewDeps;

    beforeEach(() => {
        scanMetadataStub = {
            timespan: {
                scanComplete: new Date(Date.UTC(0, 1, 2, 3, 4)),
            },
        } as ScanMetadata;
        cardsViewDataStub = {
            visualHelperEnabled: true,
        } as CardsViewModel;
        userConfigurationStoreDataStub = {
            isFirstTime: false,
        } as UserConfigurationStoreData;
        cardsViewStoreDataStub = {
            isIssueFilingSettingsDialogOpen: false,
        };
        contentPageInfo = {
            title: 'some title',
            description: <p>some description</p>,
            instancesSectionComponent: StubInstancesSectionComponent,
        } as ContentPageInfo;
        cardsViewControllerMock = Mock.ofType(CardsViewController);
        issueFilingPropsFactoryMock = Mock.ofInstance(() => null);
        deps = {
            cardsViewController: cardsViewControllerMock.object,
            issueFilingDialogPropsFactory: issueFilingPropsFactoryMock.object,
            cardInteractionSupport: {
                supportsIssueFiling: false,
            },
        } as TestViewDeps;

        issueFilingPropsFactoryMock
            .setup(i =>
                i(
                    userConfigurationStoreDataStub,
                    cardsViewStoreDataStub,
                    cardsViewControllerMock.object,
                    It.isAny(),
                ),
            )
            .returns(() => ({ isOpen: false } as IssueFilingNeedsSettingsContentProps));
    });

    const scanStatuses = [
        undefined,
        ScanStatus[ScanStatus.Scanning],
        ScanStatus[ScanStatus.Failed],
    ];

    it.each(scanStatuses)('when status scan <%s>', scanStatusName => {
        props = {
            deps: deps,
            scanMetadata: scanMetadataStub,
            userConfigurationStoreData: userConfigurationStoreDataStub,
            cardsViewData: cardsViewDataStub,
            scanStatus: ScanStatus[scanStatusName],
            contentPageInfo: contentPageInfo,
            tabStopsEnabled: true,
            narrowModeStatus: {} as NarrowModeStatus,
            cardsViewStoreData: cardsViewStoreDataStub,
        };

        const testSubject = shallow(<TestView {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it.each([true, false])(
        'when status scan <Completed> and supportsIssueFiling=%s',
        supportsIssueFiling => {
            deps.cardInteractionSupport.supportsIssueFiling = supportsIssueFiling;

            props = {
                deps: deps,
                scanMetadata: scanMetadataStub,
                userConfigurationStoreData: userConfigurationStoreDataStub,
                cardsViewData: cardsViewDataStub,
                scanStatus: ScanStatus.Completed,
                contentPageInfo: contentPageInfo,
                tabStopsEnabled: true,
                narrowModeStatus: {} as NarrowModeStatus,
                cardsViewStoreData: cardsViewStoreDataStub,
            };

            const testSubject = shallow(<TestView {...props} />);

            expect(testSubject.getElement()).toMatchSnapshot();
        },
    );

    const StubInstancesSectionComponent = NamedFC<CommonInstancesSectionProps>(
        'stubInstancesSectionComponent',
        props => <p>stub instances section</p>,
    );
});
