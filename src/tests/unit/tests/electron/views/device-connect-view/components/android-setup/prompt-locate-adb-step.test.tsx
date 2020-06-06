// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptLocateAdbStep } from 'electron/views/device-connect-view/components/android-setup/prompt-locate-adb-step';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('PromptLocateAdbStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = {
            userConfigurationStoreData: {} as UserConfigurationStoreData,
            androidSetupStoreData: {
                currentStepId: 'prompt-locate-adb',
            },
            deps: {
                androidSetupActionCreator: null,
                androidSetupStepComponentProvider: null,
                LinkComponent: linkProps => <a {...linkProps} />,
            },
        };
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
});
