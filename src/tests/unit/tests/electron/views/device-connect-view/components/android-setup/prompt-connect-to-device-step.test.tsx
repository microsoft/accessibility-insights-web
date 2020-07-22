// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptConnectToDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connect-to-device-step';
import { detectDeviceAutomationId } from 'electron/views/device-connect-view/components/automation-ids';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('PromptConnectToDeviceStep', () => {
    let props: CommonAndroidSetupStepProps;
    let closeAppMock: IMock<typeof props.deps.closeApp>;
    let androidSetupActionCreatorMock: IMock<AndroidSetupActionCreator>;

    beforeEach(() => {
        closeAppMock = Mock.ofInstance(() => {});
        androidSetupActionCreatorMock = Mock.ofType(AndroidSetupActionCreator);
        props = new AndroidSetupStepPropsBuilder('prompt-connect-to-device')
            .withDep('closeApp', closeAppMock.object)
            .withDep('androidSetupActionCreator', androidSetupActionCreatorMock.object)
            .build();
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<PromptConnectToDeviceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('passes closeApp dep through', () => {
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        const rendered = shallow(<PromptConnectToDeviceStep {...props} />);
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubEvent);
        closeAppMock.verify(m => m(), Times.once());
    });

    it('invokes next action when detect devices selected', () => {
        const rendered = shallow(<PromptConnectToDeviceStep {...props} />);
        rendered.find({ 'data-automation-id': detectDeviceAutomationId }).simulate('click');
        androidSetupActionCreatorMock.verify(m => m.next(), Times.once());
    });
});
