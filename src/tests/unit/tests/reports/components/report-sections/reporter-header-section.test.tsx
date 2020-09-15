// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReporterHeaderSection } from 'reports/components/report-sections/reporter-header-section';

describe('ReporterHeaderSection', () => {
    it('renders', () => {
        const targetAppInfo = {
            name: 'page-title',
            url: 'url://page',
        };
        const scanMetadata = {
            targetAppInfo,
        } as ScanMetadata;
        const wrapper = shallow(<ReporterHeaderSection scanMetadata={scanMetadata} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
