// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportFooter } from 'reports/components/report-sections/report-footer';

describe('ReportFooter', () => {
    it('renders', () => {
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: '1.2.3',
            browserSpec: 'dummy browser version 1.0.1',
            axeCoreVersion: '4.5.6',
        };
        const wrapper = shallow(<ReportFooter {...{ environmentInfo }}>Footer Text</ReportFooter>);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
