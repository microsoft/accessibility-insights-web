// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfoProvider } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterTextForService } from 'reports/package/footer-text-for-service';

describe('FooterTextForService', () => {
    it('renders', () => {
        const environmentInfoProvider: EnvironmentInfoProvider = new EnvironmentInfoProvider(
            '1.2.3',
            'dummy browser version 1.0.1',
            '4.5.6',
        );

        const FooterText = FooterTextForService('ClientService');

        const footerWrapper = shallow(<FooterText {...{ environmentInfoProvider }} />);
        expect(footerWrapper.getElement()).toMatchSnapshot('footer');
    });
});
