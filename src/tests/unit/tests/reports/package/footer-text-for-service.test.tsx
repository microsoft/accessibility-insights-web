// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo, EnvironmentInfoProvider } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterTextForService, FooterTextForServiceProps } from 'reports/package/footer-text-for-service';
import { IMock, Mock, Times } from 'typemoq';

describe('FooterTextForService', () => {
    let environmentInfoProviderMock: IMock<EnvironmentInfoProvider>;

    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.2.3',
        browserSpec: 'dummy browser version 1.0.1',
        axeCoreVersion: '4.5.6',
    };

    beforeEach(() => {
        environmentInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);

        environmentInfoProviderMock.setup(eipm => eipm.getEnvironmentInfo()).returns(() => environmentInfo).verifiable(Times.once());
    });

    it('renders', () => {
        const footerTextForServiceProps: FooterTextForServiceProps = {
            environmentInfoProvider: environmentInfoProviderMock.object,
        };

        const FooterText = FooterTextForService('ClientService');

        const footerWrapper = shallow(<FooterText {...footerTextForServiceProps} />);
        expect(footerWrapper.getElement()).toMatchSnapshot('footer');
    });

    afterEach(() => {
        environmentInfoProviderMock.verifyAll();
    });
});
