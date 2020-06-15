// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceInfo } from 'electron/platform/android/android-service-configurator';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptInstallFailedStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-failed-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('PromptInstallFailedStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = new AndroidSetupStepPropsBuilder('prompt-install-failed').build();
    });

    it('renders with device', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: false,
            friendlyName: 'Super-Duper Gadget',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallFailedStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: true,
            friendlyName: 'Emulator Extraordinaire',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallFailedStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
