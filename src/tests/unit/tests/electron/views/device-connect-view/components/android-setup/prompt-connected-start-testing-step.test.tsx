// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptConnectedStartTestingStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connected-start-testing-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

describe('PromptConnectedStartTestingStep', () => {
    let props: CommonAndroidSetupStepProps;
    let startTestingMock: IMock<typeof props.deps.startTesting>;
    const mockCancelAction = Mock.ofInstance(_ => {}, MockBehavior.Strict);
    let sampleAndroidSetupActionCreator: AndroidSetupActionCreator;

    beforeEach(() => {
        startTestingMock = Mock.ofInstance(() => {});
        mockCancelAction.setup(m => m(It.isAny())).verifiable();
        sampleAndroidSetupActionCreator = {
            cancel: mockCancelAction.object,
        } as AndroidSetupActionCreator;
        props = new AndroidSetupStepPropsBuilder('prompt-connected-start-testing')
            .withDep('startTesting', startTestingMock.object)
            .withDep('androidSetupActionCreator', sampleAndroidSetupActionCreator)
            .build();
    });

    it('renders with device', () => {
        const selectedDevice: DeviceMetadata = {
            isEmulator: false,
            description: 'Super-Duper Gadget',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

        const rendered = shallow(<PromptConnectedStartTestingStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const selectedDevice: DeviceMetadata = {
            isEmulator: true,
            description: 'Emulator Extraordinaire',
        };

        props.androidSetupStoreData.selectedDevice = selectedDevice;

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

        mockCancelAction.verifyAll();
    });
});
