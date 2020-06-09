// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptChooseDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-choose-device-step';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('PromptChooseDeviceStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = {
            userConfigurationStoreData: {} as UserConfigurationStoreData,
            androidSetupStoreData: {
                currentStepId: 'prompt-choose-device',
            },
            deps: {
                androidSetupActionCreator: null,
                androidSetupStepComponentProvider: null,
                LinkComponent: linkProps => <a {...linkProps} />,
                closeApp: null,
            },
        };
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<PromptChooseDeviceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
