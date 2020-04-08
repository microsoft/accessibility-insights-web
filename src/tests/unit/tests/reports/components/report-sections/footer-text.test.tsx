// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfoProvider } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterText } from 'reports/components/report-sections/footer-text';

describe('FooterText', () => {
    it('renders', () => {
        const environmentInfoProvider = new EnvironmentInfoProvider(
            '1.2.3',
            'dummy browser version 1.0.1',
            '4.5.6',
        );



        const footerWrapper = shallow(<FooterText {...{ environmentInfoProvider }} />);
        expect(footerWrapper.getElement()).toMatchSnapshot();
    });
});
