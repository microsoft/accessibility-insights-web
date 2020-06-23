// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WaitToStartStep } from 'electron/views/device-connect-view/components/android-setup/wait-to-start-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('WaitToStartStep', () => {
    const props = new AndroidSetupStepPropsBuilder('wait-to-start').build();

    it('renders', () => {
        const rendered = shallow(<WaitToStartStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
