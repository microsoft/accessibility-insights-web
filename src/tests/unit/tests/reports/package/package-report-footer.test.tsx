// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { SectionProps } from 'reports/components/report-sections/report-section-factory';
import { PackageReportFooter } from 'reports/package/package-report-footer';

describe('PackageReportFooter', () => {
    it('renders', () => {
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: '1.2.3',
            browserSpec: 'dummy browser version 1.0.1',
            axeCoreVersion: '4.5.6',
        };
        const props: SectionProps = {
            environmentInfo,
        } as SectionProps;
        const wrapper = shallow(<PackageReportFooter {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
