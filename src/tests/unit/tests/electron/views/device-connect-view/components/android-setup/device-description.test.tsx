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
            isEmulator: false,
            description: 'Super-Duper Gadget',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const props: DeviceDescriptionProps = {
            isEmulator: true,
            description: 'Emulator Extraordinaire',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with extra classname', () => {
        const props: DeviceDescriptionProps = {
            isEmulator: true,
            description: 'Simple Emulator',
            className: 'my-class',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with currentApplication', () => {
        const props: DeviceDescriptionProps = {
            isEmulator: false,
            description: 'Whizbang tablet',
            currentApplication: 'Wildlife Manager',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
