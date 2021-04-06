// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DeviceDescription,
    DeviceDescriptionProps,
} from 'electron/views/device-connect-view/components/android-setup/device-description';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceDescription', () => {
    it.each([null, undefined])('renders as null with no deviceInfo', deviceInfo => {
        const props: DeviceDescriptionProps = {
            deviceInfo,
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toBeNull();
    });

    it('renders with device', () => {
        const props: DeviceDescriptionProps = {
            deviceInfo: {
                isEmulator: false,
                model: 'Super-Duper Gadget',
                id: '0',
            },
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with emulator', () => {
        const props: DeviceDescriptionProps = {
            deviceInfo: {
                isEmulator: true,
                model: 'Emulator Extraordinaire',
                id: '1',
            },
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with extra classname', () => {
        const props: DeviceDescriptionProps = {
            deviceInfo: {
                isEmulator: true,
                model: 'Simple Emulator',
                id: '2',
            },
            className: 'my-class',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with currentApplication', () => {
        const props: DeviceDescriptionProps = {
            deviceInfo: {
                isEmulator: false,
                model: 'Whizbang tablet',
                id: '3',
            },
            currentApplication: 'Wildlife Manager',
        };

        const rendered = shallow(<DeviceDescription {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
