// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { DetectAdbStep } from 'electron/views/device-connect-view/components/android-setup/detect-adb-step';
import { shallow } from 'enzyme';
import * as React from 'react';
describe('DetectAdbStep', () => {
    const props: CommonAndroidSetupStepProps = {
        userConfigurationStoreData: null,
        androidSetupStoreData: {
            currentStepId: 'detect-adb',
        },
        deps: {
            androidSetupActionCreator: null,
            androidSetupStepComponentProvider: null,
            LinkComponent: null,
        },
    };

    it('renders', () => {
        const rendered = shallow(<DetectAdbStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
