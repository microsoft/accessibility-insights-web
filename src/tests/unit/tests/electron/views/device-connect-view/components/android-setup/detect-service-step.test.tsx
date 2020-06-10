// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { DetectServiceStep } from 'electron/views/device-connect-view/components/android-setup/detect-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';
describe('DetectServiceStep', () => {
    const props: CommonAndroidSetupStepProps = {
        userConfigurationStoreData: null,
        androidSetupStoreData: {
            currentStepId: 'detect-service',
        },
        deps: {
            androidSetupActionCreator: null,
            androidSetupStepComponentProvider: null,
            LinkComponent: null,
        },
    };

    it('renders', () => {
        const rendered = shallow(<DetectServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
