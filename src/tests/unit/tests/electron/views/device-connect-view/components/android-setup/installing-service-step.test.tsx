// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonAndroidSetupStepProps } from 'electron/views/device-connect-view/components/android-setup/android-setup-types';
import { InstallingServiceStep } from 'electron/views/device-connect-view/components/android-setup/installing-service-step';
import { shallow } from 'enzyme';
import * as React from 'react';
describe('InstallingServiceStep', () => {
    const props: CommonAndroidSetupStepProps = {
        userConfigurationStoreData: null,
        androidSetupStoreData: {
            currentStepId: 'installing-service',
        },
        deps: {
            androidSetupActionCreator: null,
            androidSetupStepComponentProvider: null,
            LinkComponent: null,
            closeApp: null,
        },
    };

    it('renders', () => {
        const rendered = shallow(<InstallingServiceStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
