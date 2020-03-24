// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterText } from 'reports/components/report-sections/footer-text';

describe('FooterText', () => {
    it('renders', () => {
        const environmentInfo: EnvironmentInfo = {
            extensionVersion: '1.2.3',
            browserSpec: 'dummy browser version 1.0.1',
            axeCoreVersion: '4.5.6',
        };

        const footerWrapper = shallow(<FooterText {...{ environmentInfo }} />);
        expect(footerWrapper.getElement()).toMatchSnapshot();
    });
});
