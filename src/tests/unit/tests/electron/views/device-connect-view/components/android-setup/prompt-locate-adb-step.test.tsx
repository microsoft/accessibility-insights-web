// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import { AndroidSetupStepLayout } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { FolderPicker } from 'electron/views/device-connect-view/components/android-setup/folder-picker';
import { PromptLocateAdbStep } from 'electron/views/device-connect-view/components/android-setup/prompt-locate-adb-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';
import { IMock, It, Mock, Times } from 'typemoq';

describe('PromptLocateAdbStep', () => {
    let props: CommonAndroidSetupStepProps;
    let closeAppMock: IMock<typeof props.deps.closeApp>;
    let setupActionCreatorMock: IMock<AndroidSetupActionCreator>;
    const stubClickEvent = {} as React.MouseEvent<HTMLButtonElement>;

    beforeEach(() => {
        closeAppMock = Mock.ofInstance(() => {});
        setupActionCreatorMock = Mock.ofType<AndroidSetupActionCreator>();
        props = new AndroidSetupStepPropsBuilder('prompt-locate-adb')
            .withDep('closeApp', closeAppMock.object)
            .withDep('androidSetupActionCreator', setupActionCreatorMock.object)
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

    it('invokes closeApp when left footer button is clicked', () => {
        const rendered = shallow(<PromptLocateAdbStep {...props} />);
        rendered.find(AndroidSetupStepLayout).prop('leftFooterButtonProps').onClick(stubClickEvent);
        closeAppMock.verify(m => m(), Times.once());
    });

    it('does not invoke saveAdbPath for FolderPicker onChange with no next button click', () => {
        const newValue = '/new/path';
        const rendered = shallow(<PromptLocateAdbStep {...props} />);

        rendered.find(FolderPicker).prop('onChange')(newValue);

        setupActionCreatorMock.verify(m => m.saveAdbPath(It.isAny()), Times.never());
    });

    it('invokes saveAdbPath on next click, defaulting to value from saved adbLocation', () => {
        props.userConfigurationStoreData.adbLocation = '/old/path';
        const rendered = shallow(<PromptLocateAdbStep {...props} />);

        rendered
            .find(AndroidSetupStepLayout)
            .prop('rightFooterButtonProps')
            .onClick(stubClickEvent);

        setupActionCreatorMock.verify(m => m.saveAdbPath('/old/path'), Times.once());
    });

    it('invokes saveAdbPath on next click using the most recent onChange value from the FolderPicker', () => {
        const rendered = shallow(<PromptLocateAdbStep {...props} />);

        rendered.find(FolderPicker).prop('onChange')('/first/new/path');
        rendered.find(FolderPicker).prop('onChange')('/second/new/path');

        rendered
            .find(AndroidSetupStepLayout)
            .prop('rightFooterButtonProps')
            .onClick(stubClickEvent);

        setupActionCreatorMock.verify(m => m.saveAdbPath('/second/new/path'), Times.once());
    });
});
