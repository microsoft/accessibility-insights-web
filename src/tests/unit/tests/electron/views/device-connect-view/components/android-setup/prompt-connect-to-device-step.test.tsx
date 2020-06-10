// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptConnectToDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connect-to-device-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('PromptConnectToDeviceStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = new AndroidSetupStepPropsBuilder('prompt-connect-to-device').build();
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<PromptConnectToDeviceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
