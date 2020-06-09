// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupSpinner } from 'electron/views/device-connect-view/components/android-setup/android-setup-spinner';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AndroidSetupSpinner', () => {
    it('renders per snapshot', () => {
        const rendered = shallow(<AndroidSetupSpinner label="test label" />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
