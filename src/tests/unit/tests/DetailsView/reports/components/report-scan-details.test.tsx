// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportScanDetails, ReportScanDetailsProps } from '../../../../../../DetailsView/reports/components/report-scan-details';

describe('ReportScanDetailsTest', () => {
    it('renders', () => {
        const props: ReportScanDetailsProps = {
            scanDate: new Date(Date.UTC(2018, 2, 9, 9, 48)),
            pageTitle: 'page-title',
            pageUrl: 'https://page-url/',
            description: 'description-text',
            browserSpec: 'environment-version',
            extensionVersion: 'extension-version',
            axeVersion: 'axe-version',
        };

        const wrapper = shallow(<ReportScanDetails {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
