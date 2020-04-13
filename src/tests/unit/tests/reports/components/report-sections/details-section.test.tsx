// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { DateProvider } from 'common/date-provider';
import {
    DetailsSection,
    DetailsSectionProps,
} from 'reports/components/report-sections/details-section';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('DetailsSection', () => {
    const descriptionValues = ['description-text', '', undefined, null];

    test.each(descriptionValues)('renders with description: %s', description => {
        const scanDate = new Date(Date.UTC(2018, 2, 9, 9, 48));

        const toUtcStringMock: IMock<(date: Date) => string> = Mock.ofInstance(
            DateProvider.getUTCStringFromDate,
            MockBehavior.Strict,
        );

        toUtcStringMock.setup(getter => getter(scanDate)).returns(() => '2018-03-12 11:24 PM UTC');

        const props: DetailsSectionProps = {
            scanDate,
            targetAppInfo: {
                name: 'page-title',
                url: 'https://page-url/',
            },
            description,
            environmentInfo: {
                browserSpec: 'environment-version',
                extensionVersion: 'extension-version',
                axeCoreVersion: 'axe-version',
            },
            toUtcString: toUtcStringMock.object,
        };

        const wrapper = shallow(<DetailsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
