// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptInstallServiceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('PromptInstallServiceStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = {
            userConfigurationStoreData: {} as UserConfigurationStoreData,
            androidSetupStoreData: {
                currentStepId: 'prompt-install-service',
            },
            deps: {
                androidSetupActionCreator: null,
                androidSetupStepComponentProvider: null,
                LinkComponent: linkProps => <a {...linkProps} />,
            },
        };
    });

    it('renders with device', () => {
        const selectedDevice: DeviceMetadata = {
            iconName: 'CellPhone',
            description: 'Super-Duper Gadget',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceMetadata = {
            iconName: 'Devices3',
            description: 'Emulator Extraordinaire',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
