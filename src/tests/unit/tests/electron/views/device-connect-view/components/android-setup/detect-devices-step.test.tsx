// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetectDevicesStep } from 'electron/views/device-connect-view/components/android-setup/detect-devices-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('DetectDevicesStep', () => {
    const props = new AndroidSetupStepPropsBuilder('detect-devices').build();

    it('renders', () => {
        const rendered = shallow(<DetectDevicesStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
