// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportFooter } from 'reports/components/report-sections/report-footer';
import { ToolData } from 'common/types/store-data/unified-data-interface';

describe('ReportFooter', () => {
    it('renders', () => {
        const toolData: ToolData = {
            scanEngineProperties: {
                name: 'engine-name',
                version: 'engine-version',
            },
            applicationProperties: {
                name: 'app-name',
                version: 'app-version',
                environmentName: 'environmentName',
            },
        };

        const wrapper = shallow(<ReportFooter {...{ toolData }}>Footer Text</ReportFooter>);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
