// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstallingServiceStep } from 'electron/views/device-connect-view/components/android-setup/installing-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('InstallingServiceStep', () => {
    const props = new AndroidSetupStepPropsBuilder('installing-service').build();

    it('renders', () => {
        const rendered = shallow(<InstallingServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
