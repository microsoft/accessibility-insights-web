// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptInstallServiceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('PromptInstallServiceStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = new AndroidSetupStepPropsBuilder('prompt-install-service').build();
    });

    it('renders with device', () => {
        const selectedDevice: DeviceMetadata = {
            isEmulator: false,
            description: 'Super-Duper Gadget',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceMetadata = {
            isEmulator: true,
            description: 'Emulator Extraordinaire',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
