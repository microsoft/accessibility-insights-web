// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceDescription', () => {
    it('renders with device', () => {
        const props: DeviceDescriptionProps = {
            iconName: 'CellPhone',
            description: 'Super-Duper Gadget',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const props: DeviceDescriptionProps = {
            iconName: 'Devices3',
            description: 'Emulator Extraordinaire',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
