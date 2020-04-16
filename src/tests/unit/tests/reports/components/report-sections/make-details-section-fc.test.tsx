// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { DateProvider } from 'common/date-provider';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import {
    DetailsSectionProps,
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('makeDetailsSection', () => {
    const scanDate = new Date(Date.UTC(2018, 2, 9, 9, 48));
    const appName = 'app-name';
    const url = 'https://page-url/';
    const targetAppData = {
        name: appName,
        url: url,
    };
    const deviceName = 'device-name';
    const urlOrDeviceInfo: ScanDetailInfo = {
        label: 'item label',
        content: 'item content',
    };
    let toUtcStringMock: IMock<(date: Date) => string>;
    let getUrlOrDeviceItemInfoMock: IMock<(
        appInfo: TargetAppData,
        device: string,
    ) => ScanDetailInfo>;

    beforeEach(() => {
        toUtcStringMock = Mock.ofInstance(DateProvider.getUTCStringFromDate, MockBehavior.Strict);
        toUtcStringMock.setup(getter => getter(scanDate)).returns(() => '2018-03-12 11:24 PM UTC');
        getUrlOrDeviceItemInfoMock = Mock.ofType<
            (appInfo: TargetAppData, device: string) => ScanDetailInfo
        >();
        getUrlOrDeviceItemInfoMock
            .setup(g => g(targetAppData, deviceName))
            .returns(() => urlOrDeviceInfo);
    });

    const descriptionValues = ['description-text', '', undefined, null];

    test.each(descriptionValues)('renders with description: %s', description => {
        const targetAppInfo = {
            name: appName,
            url: url,
        } as TargetAppData;
        const props: DetailsSectionProps = {
            scanDate,
            targetAppInfo,
            description,
            environmentInfo: {
                browserSpec: 'environment-version',
                extensionVersion: 'extension-version',
                axeCoreVersion: 'axe-version',
            },
            toUtcString: toUtcStringMock.object,
            deviceName,
        };

        const TestDetailsSection = makeDetailsSectionFC(getUrlOrDeviceItemInfoMock.object);

        const wrapper = shallow(<TestDetailsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
