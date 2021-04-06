// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import {
    installAutomationId,
    PromptInstallServiceStep,
} from 'electron/views/device-connect-view/components/android-setup/prompt-install-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('PromptInstallServiceStep', () => {
    let props: CommonAndroidSetupStepProps;
    let androidSetupActionCreatorMock: IMock<AndroidSetupActionCreator>;

    beforeEach(() => {
        androidSetupActionCreatorMock = Mock.ofType(AndroidSetupActionCreator);
        props = new AndroidSetupStepPropsBuilder('prompt-install-service')
            .withDep('androidSetupActionCreator', androidSetupActionCreatorMock.object)
            .build();
    });

    it('renders with device', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: false,
            model: 'Super-Duper Gadget',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: true,
            model: 'Emulator Extraordinaire',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('calls cancel action when cancel button selected', () => {
        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubEvent);
        androidSetupActionCreatorMock.verify(m => m.cancel(), Times.once());
    });

    it('handles the install button with the next action', () => {
        const rendered = shallow(<PromptInstallServiceStep {...props} />);
        rendered.find({ 'data-automation-id': installAutomationId }).simulate('click');
        androidSetupActionCreatorMock.verify(m => m.next(), Times.once());
    });
});
