// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { DateProvider } from '../../../../../../../common/date-provider';
import { SectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/report-section-factory';
import { SummarySection } from '../../../../../../../DetailsView/reports/components/report-sections/summary-section';

describe('SummarySection', () => {
    const pageTitle = 'page-title';
    const pageUrl = 'url:target-page';
    const scanDate = new Date('2019-05-29T19:12:16.804Z');
    const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = anyDate => '2018-03-12 11:24 PM UTC';

    const props: SectionProps = {
        pageTitle,
        pageUrl,
        description: 'test description',
        scanDate,
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
        utcDateConverter: getUTCStringFromDateStub,
    };

    it('renders', () => {
        const wrapper = shallow(<SummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
