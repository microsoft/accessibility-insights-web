// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DeviceConnectHeader,
    DeviceConnectHeaderProps,
} from 'electron/views/device-connect-view/components/device-connect-header';
import { ElectronLink } from 'electron/views/device-connect-view/components/electron-link';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectHeaderTest', () => {
    test('render', () => {
        const props: DeviceConnectHeaderProps = {
            deps: {
                LinkComponent: ElectronLink,
            },
        };

        const rendered = shallow(<DeviceConnectHeader {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
