// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata } from 'common/types/store-data/scan-meta-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AutomatedChecksHeaderSection } from 'reports/components/report-sections/automated-checks-header-section';

describe('AutomatedChecksHeaderSection', () => {
    it('renders', () => {
        const targetAppInfo = {
            name: 'page-title',
            url: 'url://page',
        };
        const scanMetadata = {
            targetAppInfo,
        } as ScanMetadata;
        const wrapper = shallow(<AutomatedChecksHeaderSection scanMetadata={scanMetadata} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
