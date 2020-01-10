// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Header, HeaderProps } from 'popup/components/header';
import * as React from 'react';

describe('HeaderTest', () => {
    test('render', () => {
        const props: HeaderProps = {
            title: 'title',
            subtitle: 'sub-title',
        };

        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with rowExtraClassName prop', () => {
        const props: HeaderProps = {
            title: null,
            subtitle: null,
            rowExtraClassName: 'extra-class',
        };

        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with children prop', () => {
        const children: JSX.Element = <div>my content</div>;

        const props: HeaderProps = {
            title: null,
            subtitle: null,
        };

        const wrapper = shallow(<Header {...props}>{children}</Header>);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
