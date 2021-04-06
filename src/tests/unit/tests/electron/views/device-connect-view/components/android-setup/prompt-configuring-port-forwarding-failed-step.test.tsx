// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptConfiguringPortForwardingFailedStep } from 'electron/views/device-connect-view/components/android-setup/prompt-configuring-port-forwarding-failed-step';
import { tryAgainAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('PromptConfiguringPortForwardingFailedStep', () => {
    let props: CommonAndroidSetupStepProps;
    let androidSetupActionCreatorMock: IMock<AndroidSetupActionCreator>;

    beforeEach(() => {
        androidSetupActionCreatorMock = Mock.ofType(AndroidSetupActionCreator);
        props = new AndroidSetupStepPropsBuilder('prompt-configuring-port-forwarding-failed')
            .withDep('androidSetupActionCreator', androidSetupActionCreatorMock.object)
            .build();
    });

    it('renders with device', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: false,
            friendlyName: 'Super-Duper Gadget',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptConfiguringPortForwardingFailedStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: true,
            friendlyName: 'Emulator Extraordinaire',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptConfiguringPortForwardingFailedStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('routes try again button to next action', () => {
        const rendered = shallow(<PromptConfiguringPortForwardingFailedStep {...props} />);
        const button = rendered.find({ 'data-automation-id': tryAgainAutomationId });
        button.simulate('click');
        androidSetupActionCreatorMock.verify(m => m.next(), Times.once());
    });
});
