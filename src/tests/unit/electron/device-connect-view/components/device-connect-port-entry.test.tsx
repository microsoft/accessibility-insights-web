// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    DeviceConnectPortEntry,
    DeviceConnectPortEntryProps,
} from '../../../../../electron/device-connect-view/components/device-connect-port-entry';

describe('DeviceConnectPortEntryTest', () => {
    test('render', () => {
        const props = {} as DeviceConnectPortEntryProps;
        const rendered = shallow(<DeviceConnectPortEntry {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
