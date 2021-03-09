// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GrantOverlayPermissionStep } from 'electron/views/device-connect-view/components/android-setup/grant-overlay-permission-step';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AndroidSetupStepPropsBuilder } from 'tests/unit/common/android-setup-step-props-builder';

describe('GrantOverlayPermissionStep', () => {
    const props = new AndroidSetupStepPropsBuilder('grant-overlay-permission').build();

    it('renders', () => {
        const rendered = shallow(<GrantOverlayPermissionStep {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
