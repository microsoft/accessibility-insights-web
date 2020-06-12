// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetectAdbStep } from 'electron/views/device-connect-view/components/android-setup/detect-adb-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('DetectAdbStep', () => {
    const props = new AndroidSetupStepPropsBuilder('detect-adb').build();

    it('renders', () => {
        const rendered = shallow(<DetectAdbStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
