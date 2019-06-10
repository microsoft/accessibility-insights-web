// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { DateProvider } from '../../../../../../../common/date-provider';
import { DetailsSection, DetailsSectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/details-section';

describe('DetailsSection', () => {
    it('renders', () => {
        const scanDate = new Date(Date.UTC(2018, 2, 9, 9, 48));

        const getUTCStringFromDateMock: IMock<(date: Date) => string> = Mock.ofInstance(
            DateProvider.getUTCStringFromDate,
            MockBehavior.Strict,
        );

        getUTCStringFromDateMock
            .setup(x => x(scanDate))
            .returns(() => '2018-03-12 11:24 PM UTC')
            .verifiable();

        const props: DetailsSectionProps = {
            scanDate,
            pageTitle: 'page-title',
            pageUrl: 'https://page-url/',
            description: 'description-text',
            environmentInfo: {
                browserSpec: 'environment-version',
                extensionVersion: 'extension-version',
                axeCoreVersion: 'axe-version',
            },
            toUtcString: getUTCStringFromDateMock.object,
        };

        const wrapper = shallow(<DetailsSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
