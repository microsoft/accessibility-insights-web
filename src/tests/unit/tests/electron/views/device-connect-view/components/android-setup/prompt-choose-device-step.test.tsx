// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptChooseDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-choose-device-step';
import { rescanAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('PromptChooseDeviceStep', () => {
    let props: CommonAndroidSetupStepProps;
    let closeAppMock: IMock<typeof props.deps.closeApp>;
    let actionMessageCreatorMock: IMock<AndroidSetupActionCreator>;

    beforeEach(() => {
        closeAppMock = Mock.ofInstance(() => {});
        actionMessageCreatorMock = Mock.ofType(AndroidSetupActionCreator);
        props = new AndroidSetupStepPropsBuilder('prompt-choose-device')
            .withDep('closeApp', closeAppMock.object)
            .withDep('androidSetupActionCreator', actionMessageCreatorMock.object)
            .build();

        props.androidSetupStoreData = {
            availableDevices: [
                {
                    id: '1',
                    friendlyName: 'Phone 1',
                    isEmulator: true,
                },
                {
                    id: '2',
                    friendlyName: 'Phone 2',
                    isEmulator: false,
                },
                {
                    id: '3',
                    friendlyName: 'Phone 3',
                    isEmulator: true,
                },
            ],
        } as AndroidSetupStoreData;
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<PromptChooseDeviceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('passes closeApp dep through', () => {
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        const rendered = shallow(<PromptChooseDeviceStep {...props} />);
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubEvent);
        closeAppMock.verify(m => m(), Times.once());
    });

    it('passes rescan dep through', () => {
        const rendered = shallow(<PromptChooseDeviceStep {...props} />);
        const rescanButton = rendered.find({ 'data-automation-id': rescanAutomationId });
        rescanButton.simulate('click');
        actionMessageCreatorMock.verify(m => m.rescan(), Times.once());
    });

    it('passes setSelectedDevice dep through', () => {
        const expectedDevice: DeviceInfo = props.androidSetupStoreData.availableDevices[0];
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        const rendered = mount(<PromptChooseDeviceStep {...props} />);
        rendered.find(AndroidSetupStepLayout).prop('rightFooterButtonProps').onClick(stubEvent);
        actionMessageCreatorMock.verify(m => m.setSelectedDevice(expectedDevice), Times.once());
    });

    it('next button is disabled on entry if no devices are in list (not expected in production)', () => {
        props.androidSetupStoreData.availableDevices = [];
        const rendered = mount(<PromptChooseDeviceStep {...props} />);
        expect(rendered.find('button').at(2).props().disabled).toBeTruthy();
    });

    it('next button is enabled on entry if devices are in list', () => {
        const rendered = mount(<PromptChooseDeviceStep {...props} />);
        expect(rendered.find('button').at(2).props().disabled).toBeUndefined();
    });
});
