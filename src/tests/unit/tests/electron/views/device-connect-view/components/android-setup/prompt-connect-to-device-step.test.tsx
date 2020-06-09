// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { PromptConnectToDeviceStep } from 'electron/views/device-connect-view/components/android-setup/prompt-connect-to-device-step';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('PromptConnectToDeviceStep', () => {
    let props: CommonAndroidSetupStepProps;

    beforeEach(() => {
        props = {
            userConfigurationStoreData: {} as UserConfigurationStoreData,
            androidSetupStoreData: {
                currentStepId: 'prompt-connect-to-device',
            },
            deps: {
                androidSetupActionCreator: null,
                androidSetupStepComponentProvider: null,
                LinkComponent: linkProps => <a {...linkProps} />,
            },
        };
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<PromptConnectToDeviceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
