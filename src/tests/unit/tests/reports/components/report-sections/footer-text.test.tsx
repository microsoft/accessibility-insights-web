// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import { EnvironmentInfo, EnvironmentInfoProvider } from 'common/environment-info-provider';
import { shallow } from 'enzyme';
import { FooterText, FooterTextProps } from 'reports/components/report-sections/footer-text';
import { IMock, Mock, Times } from 'typemoq';

describe('FooterText', () => {
    let environmentInfoProviderMock: IMock<EnvironmentInfoProvider>;

    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.2.3',
        browserSpec: 'dummy browser version 1.0.1',
        axeCoreVersion: '4.5.6',
    };

    beforeEach(() => {
        environmentInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);

        environmentInfoProviderMock
            .setup(eipm => eipm.getEnvironmentInfo())
            .returns(() => environmentInfo)
            .verifiable(Times.once());
    });

    it('renders', () => {
        const footerTextProps: FooterTextProps = {
            environmentInfoProvider: environmentInfoProviderMock.object,
        };
        const footerWrapper = shallow(<FooterText {...footerTextProps} />);
        expect(footerWrapper.getElement()).toMatchSnapshot();
    });

    afterEach(() => {
        environmentInfoProviderMock.verifyAll();
    });
});
