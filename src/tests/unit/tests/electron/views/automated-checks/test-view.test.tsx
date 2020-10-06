// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { HeaderSectionProps } from 'electron/views/automated-checks/components/header-section';
import { TestView, TestViewDeps, TestViewProps } from 'electron/views/automated-checks/test-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TestView', () => {
    let props: TestViewProps;
    let scanMetadataStub: ScanMetadata;
    let cardsViewDataStub: CardsViewModel;
    let userConfigurationStoreDataStub: UserConfigurationStoreData;
    let headerSectionProps: HeaderSectionProps;

    beforeEach(() => {
        scanMetadataStub = {
            timestamp: 'some time',
        } as ScanMetadata;
        cardsViewDataStub = {
            visualHelperEnabled: true,
        } as CardsViewModel;
        userConfigurationStoreDataStub = {
            isFirstTime: false,
        } as UserConfigurationStoreData;
        headerSectionProps = {
            title: 'some title',
        } as HeaderSectionProps;
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
            ...headerSectionProps,
        };

        const testSubject = shallow(<TestView {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
