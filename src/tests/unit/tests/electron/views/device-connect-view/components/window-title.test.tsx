// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowTitle, WindowTitleProps } from 'electron/views/device-connect-view/components/window-title';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('WindowTitleTest', () => {
    it('renders without actionable icons', () => {
        const props: WindowTitleProps = {
            title: 'title 1',
            children: <span>logo</span>,
        };

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with actionable icons', () => {
        const props: WindowTitleProps = {
            title: 'title 1',
            children: <span>logo</span>,
            actionableIcons: [<div key="key1">icon1</div>, <div key="key2">icon2</div>],
        };

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders without children & actionable icon', () => {
        const props: WindowTitleProps = {
            title: 'title 1',
        };

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with custom class name', () => {
        const props: WindowTitleProps = {
            title: 'title 1',
            className: 'custom-class-name',
        };

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
