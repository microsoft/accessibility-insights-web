// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportFooterProps } from 'reports/components/report-sections/report-footer';
import { PackageReportFooter } from 'reports/package/package-report-footer-text';

describe('PackageReportFooter', () => {
    it('renders', () => {
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: '1.2.3',
            browserSpec: 'dummy browser version 1.0.1',
            axeCoreVersion: '4.5.6',
        };

        const BaseFooter = (props: ReportFooterProps) => <props.footerText {...(props.environmentInfo)} />;
        const Footer = PackageReportFooter('ClientService', BaseFooter);

        const footerWrapper = shallow(<Footer {...{ environmentInfo }} />);
        expect(footerWrapper.getElement()).toMatchSnapshot('footer');

        const footerTextWrapper = footerWrapper.find('footerText').shallow();
        expect(footerTextWrapper.getElement()).toMatchSnapshot('footerText');
    });
});
