// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
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

            const wrapper = render(<Header {...props} />);

            expect(wrapper.asFragment()).toMatchSnapshot();
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

            const wrapper = render(<Header {...props} />);

            expect(wrapper.asFragment()).toMatchSnapshot();
        });
    });
});
