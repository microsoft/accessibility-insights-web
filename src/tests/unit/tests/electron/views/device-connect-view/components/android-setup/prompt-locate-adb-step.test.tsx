// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptLocateAdbStep } from 'electron/views/device-connect-view/components/android-setup/prompt-locate-adb-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, Mock, Times } from 'typemoq';

describe('PromptLocateAdbStep', () => {
    let props: CommonAndroidSetupStepProps;
    let closeAppMock: IMock<typeof props.deps.closeApp>;

    beforeEach(() => {
        closeAppMock = Mock.ofInstance(() => {});
        props = new AndroidSetupStepPropsBuilder('prompt-locate-adb')
            .withDep('closeApp', closeAppMock.object)
            .build();
    });

    it('renders per snapshot with adbLocation not set', () => {
        props.userConfigurationStoreData.adbLocation = null;
        const rendered = shallow(<PromptLocateAdbStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot with adbLocation set', () => {
        props.userConfigurationStoreData.adbLocation = '/some/path/to/android/home';
        const rendered = shallow(<PromptLocateAdbStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('passes closeApp dep through', () => {
        const stubEvent = {} as React.MouseEvent<HTMLButtonElement>;
        const rendered = shallow(<PromptLocateAdbStep {...props} />);
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubEvent);
        closeAppMock.verify(m => m(), Times.once());
    });
});
