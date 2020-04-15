// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { DateProvider } from 'common/date-provider';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import {
    DetailsSection,
    DetailsSectionProps,
} from 'reports/components/report-sections/details-section';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('DetailsSection', () => {
    const scanDate = new Date(Date.UTC(2018, 2, 9, 9, 48));
    const appName = 'app-name';
    const url = 'https://page-url/';
    let toUtcStringMock: IMock<(date: Date) => string>;

    beforeEach(() => {
        toUtcStringMock = Mock.ofInstance(DateProvider.getUTCStringFromDate, MockBehavior.Strict);
        toUtcStringMock.setup(getter => getter(scanDate)).returns(() => '2018-03-12 11:24 PM UTC');
    });

    const descriptionValues = ['description-text', '', undefined, null];

    test.each(descriptionValues)('renders with description: %s', description => {
        const targetAppInfo = {
            name: appName,
            url: url,
        } as TargetAppData;
        const props = createProps(description, targetAppInfo);

        const wrapper = shallow(<DetailsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test.each(descriptionValues)('renders with description: %s', description => {
        const targetAppInfo = {
            name: appName,
        } as TargetAppData;
        const deviceName = 'connected device';
        const props = createProps(description, targetAppInfo, deviceName);

        const wrapper = shallow(<DetailsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    function createProps(
        description: string,
        targetAppInfo: TargetAppData,
        deviceName?: string,
    ): DetailsSectionProps {
        return {
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
    }
});
