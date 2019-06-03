// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { SectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/report-section-factory';
import { SummarySection } from '../../../../../../../DetailsView/reports/components/report-sections/summary-section';

describe('SummarySection', () => {
    const pageTitle = 'page-title';
    const pageUrl = 'url:target-page';

    const props: SectionProps = {
        pageTitle,
        pageUrl,
        description: 'test description',
        scanDate: new Date('2019-05-29T19:12:16.804Z'),
        environmentInfo: {
            axeCoreVersion: 'axe-core-version',
            browserSpec: 'browser-spec',
            extensionVersion: 'extension-version',
        },
        scanResult: {
            passes: [],
            violations: [],
            inapplicable: [],
            incomplete: [],
            timestamp: 'today',
            targetPageTitle: pageTitle,
            targetPageUrl: pageUrl,
        },
    };

    it('renders', () => {
        const wrapper = shallow(<SummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
