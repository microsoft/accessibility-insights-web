// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ContentPageInfo } from 'electron/types/content-page-info';
import { TestView, TestViewDeps, TestViewProps } from 'electron/views/results/test-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TestView', () => {
    let props: TestViewProps;
    let scanMetadataStub: ScanMetadata;
    let cardsViewDataStub: CardsViewModel;
    let userConfigurationStoreDataStub: UserConfigurationStoreData;
    let contentPageInfo: ContentPageInfo;

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
        contentPageInfo = {
            title: 'some title',
            description: <p>some description</p>,
            instancesSectionComponent: StubInstancesSectionComponent,
        } as ContentPageInfo;
    });

    const scanStatuses = [
        undefined,
        ScanStatus[ScanStatus.Scanning],
        ScanStatus[ScanStatus.Failed],
        ScanStatus[ScanStatus.Completed],
    ];

    it.each(scanStatuses)('when status scan <%s>', scanStatusName => {
        props = {
            deps: {} as TestViewDeps,
            scanMetadata: scanMetadataStub,
            userConfigurationStoreData: userConfigurationStoreDataStub,
            cardsViewData: cardsViewDataStub,
            scanStatus: ScanStatus[scanStatusName],
            contentPageInfo: contentPageInfo,
            tabStopsEnabled: true,
        };

        const testSubject = shallow(<TestView {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    const StubInstancesSectionComponent = NamedFC<CommonInstancesSectionProps>(
        'stubInstancesSectionComponent',
        props => <p>stub instances section</p>,
    );
});
