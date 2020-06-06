// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { DetectDevicesStep } from 'electron/views/device-connect-view/components/android-setup/detect-devices-step';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DetectDevicesStep', () => {
    const props: CommonAndroidSetupStepProps = {
        userConfigurationStoreData: null,
        androidSetupStoreData: {
            currentStepId: 'detect-devices',
        },
        deps: {
            androidSetupActionCreator: null,
            windowStateActionCreator: null,
            windowFrameActionCreator: null,
            androidSetupStepComponentProvider: null,
            LinkComponent: null,
        },
        spinnerLabel: 'test-label',
    };

    it('renders', () => {
        const rendered = shallow(<DetectDevicesStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
