// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Header, HeaderProps } from 'popup/components/header';
import * as React from 'react';

describe('Header', () => {
    describe('render', () => {
        const title = 'test-title';

        it.each(['test-sub-title', undefined])('with subtitle <%s>', subtitle => {
            const props: HeaderProps = {
                title,
                subtitle,
            };

            const wrapper = shallow(<Header {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it.each`
            description             | children
            ${'non-empty children'} | ${(<span>test children</span>)}
            ${'null children'}      | ${null}
        `('with children: $description', ({ children }) => {
            const props: HeaderProps = {
                title,
                children,
            };

            const wrapper = shallow(<Header {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
