// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConfiguringPortForwardingStep } from 'electron/views/device-connect-view/components/android-setup/configuring-port-forwarding-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('ConfiguringPortForwardingStep', () => {
    const props = new AndroidSetupStepPropsBuilder('configuring-port-forwarding').build();

    it('renders', () => {
        const rendered = shallow(<ConfiguringPortForwardingStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
