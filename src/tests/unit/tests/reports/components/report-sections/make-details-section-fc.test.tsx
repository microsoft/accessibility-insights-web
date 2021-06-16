// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from 'common/date-provider';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';

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
    const targetAppInfo = {
        name: appName,
        url: url,
    };
    const deviceName = 'device-name';
    const scanMetadata = {
        targetAppInfo,
        deviceName,
        timespan: {
            scanComplete: scanDate,
        },
    } as ScanMetadata;
    const displayedScanTargetInfo: ScanDetailInfo = {
        label: 'item label',
        content: 'item content',
    };
    let toUtcStringMock: IMock<(date: Date) => string>;
    let getDisplayedScanTargetInfoMock: IMock<(scanMetadata: ScanMetadata) => ScanDetailInfo>;

    beforeEach(() => {
        toUtcStringMock = Mock.ofInstance(DateProvider.getUTCStringFromDate, MockBehavior.Strict);
        toUtcStringMock.setup(getter => getter(scanDate)).returns(() => '2018-03-12 11:24 PM UTC');
        getDisplayedScanTargetInfoMock =
            Mock.ofType<(scanMetadata: ScanMetadata) => ScanDetailInfo>();
        getDisplayedScanTargetInfoMock
            .setup(g => g(scanMetadata))
            .returns(() => displayedScanTargetInfo);
    });

    const descriptionValues = ['description-text', '', undefined, null];

    test.each(descriptionValues)('renders with description: %s', description => {
        const props: DetailsSectionProps = {
            targetAppInfo,
            description,
            environmentInfo: {
                browserSpec: 'environment-version',
                extensionVersion: 'extension-version',
                axeCoreVersion: 'axe-version',
            },
            toUtcString: toUtcStringMock.object,
            scanMetadata,
        };

        const TestDetailsSection = makeDetailsSectionFC(getDisplayedScanTargetInfoMock.object);

        const wrapper = shallow(<TestDetailsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
