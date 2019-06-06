// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { DetailsSection, DetailsSectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/details-section';

describe('DetailsSection', () => {
    it('renders', () => {
        const props: DetailsSectionProps = {
            scanDate: new Date(Date.UTC(2018, 2, 9, 9, 48)),
            pageTitle: 'page-title',
            pageUrl: 'https://page-url/',
            description: 'description-text',
            environmentInfo: {
                browserSpec: 'environment-version',
                extensionVersion: 'extension-version',
                axeCoreVersion: 'axe-version',
            },
        };

        const wrapper = shallow(<DetailsSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
