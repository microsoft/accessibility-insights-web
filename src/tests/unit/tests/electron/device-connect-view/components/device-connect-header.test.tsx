// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectHeader } from 'electron/device-connect-view/components/device-connect-header';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectHeaderTest', () => {
    test('render', () => {
        const rendered = shallow(<DeviceConnectHeader />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
