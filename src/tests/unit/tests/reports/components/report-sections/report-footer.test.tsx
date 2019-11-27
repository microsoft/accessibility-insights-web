// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportFooter, ReportFooterProps } from 'reports/components/report-sections/report-footer';
import { ReportFooterText } from 'reports/components/report-sections/report-footer-text';

describe('ReportFooter', () => {
    it('renders', () => {
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: '1.2.3',
            browserSpec: 'dummy browser version 1.0.1',
            axeCoreVersion: '4.5.6',
        };
        const footerText: ReportFooterText = () => <>FOOTER TEXT</>;
        const props: ReportFooterProps = {
            environmentInfo,
            footerText,
        };
        const wrapper = shallow(<ReportFooter {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
