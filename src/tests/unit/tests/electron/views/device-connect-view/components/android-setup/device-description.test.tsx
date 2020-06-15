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
            friendlyName: 'Super-Duper Gadget',
            id: '0',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const props: DeviceDescriptionProps = {
            isEmulator: true,
            friendlyName: 'Emulator Extraordinaire',
            id: '1',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with extra classname', () => {
        const props: DeviceDescriptionProps = {
            isEmulator: true,
            friendlyName: 'Simple Emulator',
            className: 'my-class',
            id: '2',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with currentApplication', () => {
        const props: DeviceDescriptionProps = {
            isEmulator: false,
            friendlyName: 'Whizbang tablet',
            currentApplication: 'Wildlife Manager',
            id: '3',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
