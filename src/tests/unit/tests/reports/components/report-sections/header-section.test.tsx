// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import { HeaderSection } from 'reports/components/report-sections/header-section';

describe('HeaderSection', () => {
    it('renders', () => {
        const scanMetadata = {
            targetAppInfo: {
                name: 'page-title',
                url: 'url://page',
            },
        } as ScanMetaData;
        const wrapper = shallow(<HeaderSection scanMetadata={scanMetadata} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
