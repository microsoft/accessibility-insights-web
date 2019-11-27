// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { getReportFooterText } from 'reports/package/get-report-footer-text';

describe('getReportFooterText', () => {
    it('renders', () => {
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: '1.2.3',
            browserSpec: 'dummy browser version 1.0.1',
            axeCoreVersion: '4.5.6',
        };

        const Footer = getReportFooterText('THE SERVICE NAME');

        const wrapper = shallow(<Footer {...environmentInfo} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
