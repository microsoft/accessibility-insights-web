// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { DateProvider } from '../../../../../../../common/date-provider';
import { DetailsSection, DetailsSectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/details-section';

describe('DetailsSection', () => {
    it('renders', () => {
        const scanDate = new Date(Date.UTC(2018, 2, 9, 9, 48));
        const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = anyDate => '2018-03-12 11:24 PM UTC';

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
            utcDateConverter: getUTCStringFromDateStub,
        };

        const wrapper = shallow(<DetailsSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
