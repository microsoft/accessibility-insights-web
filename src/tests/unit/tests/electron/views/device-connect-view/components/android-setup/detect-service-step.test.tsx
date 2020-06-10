// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetectServiceStep } from 'electron/views/device-connect-view/components/android-setup/detect-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('DetectServiceStep', () => {
    const props = new AndroidSetupStepPropsBuilder('detect-service').build();

    it('renders', () => {
        const rendered = shallow(<DetectServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
