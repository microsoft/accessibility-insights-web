// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowTitle, WindowTitleProps } from 'electron/views/device-connect-view/components/window-title';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('WindowTitleTest', () => {
    test('render', () => {
        const props: WindowTitleProps = {
            title: 'Test',
            children: <span>test</span>,
        };

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
