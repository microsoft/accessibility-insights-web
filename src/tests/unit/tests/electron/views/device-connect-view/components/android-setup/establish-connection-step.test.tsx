// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EstablishConnectionStep } from 'electron/views/device-connect-view/components/android-setup/establish-connection-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('EstablishConnectionStep', () => {
    const props = new AndroidSetupStepPropsBuilder('establish-connection').build();

    it('renders', () => {
        const rendered = shallow(<EstablishConnectionStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
