// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActionCreator } from 'electron/flux/action-creator/android-setup-action-creator';
import {
    AndroidSetupSpinnerLayout,
    AndroidSetupSpinnerProps,
} from 'electron/views/device-connect-view/components/android-setup/android-setup-spinner-layout';
import { DeviceConnectFooter } from 'electron/views/device-connect-view/components/device-connect-footer';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AndroidSetupSpinnerLayout', () => {
    let mockAndroidActionCreator: IMock<AndroidSetupActionCreator>;
    let props: AndroidSetupSpinnerProps;

    beforeEach(() => {
        mockAndroidActionCreator = Mock.ofType<AndroidSetupActionCreator>(
            undefined,
            MockBehavior.Strict,
        );

        props = {
            userConfigurationStoreData: null,
            androidSetupStoreData: {
                currentStepId: 'detect-devices',
            },
            deps: {
                androidSetupActionCreator: mockAndroidActionCreator.object,
                windowStateActionCreator: null,
                windowFrameActionCreator: null,
                androidSetupStepComponentProvider: null,
                LinkComponent: null,
            },
            spinnerLabel: 'test-label',
        };

        mockAndroidActionCreator.setup(mockCreator => mockCreator.cancel);
    });

    it('renders', () => {
        const rendered = shallow(<AndroidSetupSpinnerLayout {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('invokes androidSetupActionCreator.cancel when cancel button is clicked', () => {
        mockAndroidActionCreator
            .setup(mockCreator => mockCreator.cancel())
            .verifiable(Times.once());

        const rendered = shallow(<AndroidSetupSpinnerLayout {...props} />);
        const footer = rendered.find(DeviceConnectFooter);
        footer.prop('cancelClick')();

        mockAndroidActionCreator.verifyAll();
    });
});
