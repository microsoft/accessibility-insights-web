// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptConnectedStartTestingStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connected-start-testing-step';
import { rescanAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('PromptConnectedStartTestingStep', () => {
    const testApp: string = 'super-cool app';
    let props: CommonAndroidSetupStepProps;
    let startTestingMock: IMock<typeof props.deps.startTesting>;
    let androidSetupActionCreatorMock: IMock<AndroidSetupActionCreator>;

    beforeEach(() => {
        startTestingMock = Mock.ofInstance(() => {});
        androidSetupActionCreatorMock = Mock.ofType(AndroidSetupActionCreator);
        props = new AndroidSetupStepPropsBuilder('prompt-connected-start-testing')
            .withDep('startTesting', startTestingMock.object)
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
        props.androidSetupStoreData.applicationName = testApp;

        const rendered = shallow(<PromptConnectedStartTestingStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceInfo = {
            isEmulator: true,
            friendlyName: 'Emulator Extraordinaire',
            id: '1',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;
        props.androidSetupStoreData.applicationName = testApp;

        const rendered = shallow(<PromptConnectedStartTestingStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('passes startTesting dep through', () => {
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        const rendered = shallow(<PromptConnectedStartTestingStep {...props} />);
        rendered.find(AndroidSetupStepLayout).prop('rightFooterButtonProps').onClick(stubEvent);
        startTestingMock.verifyAll();
    });

    it('handles the cancel button with the cancel action', () => {
        const rendered = shallow(<PromptConnectedStartTestingStep {...props} />);
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubEvent);
        androidSetupActionCreatorMock.verify(m => m.cancel(), Times.once());
    });

    it('handles the rescan button with the rescan action', () => {
        const rendered = shallow(<PromptConnectedStartTestingStep {...props} />);
        rendered.find({ 'data-automation-id': rescanAutomationId }).simulate('click');
        androidSetupActionCreatorMock.verify(m => m.rescan(), Times.once());
    });
});
