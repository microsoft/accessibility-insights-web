// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptGrantPermissionsStep } from 'electron/views/device-connect-view/components/android-setup/prompt-grant-permissions-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('PromptGrantPermissionsStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = new AndroidSetupStepPropsBuilder('prompt-grant-permissions').build();
    });

    it('renders with device', () => {
        const selectedDevice: DeviceMetadata = {
            isEmulator: false,
            description: 'Super-Duper Gadget',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptGrantPermissionsStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceMetadata = {
            isEmulator: true,
            description: 'Emulator Extraordinaire',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptGrantPermissionsStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
