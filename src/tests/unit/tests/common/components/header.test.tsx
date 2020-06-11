// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { Header, HeaderDeps } from 'common/components/header';

describe('Header', () => {
    it('renders per snapshot', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const wrapper = shallow(<Header deps={deps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders without header title', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const wrapper = shallow(<Header deps={deps} showHeaderTitle={false} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it.each([true, false])('renders with showFarItems equals %s', showFarItems => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const wrapper = shallow(
            <Header
                deps={deps}
                farItems={<div>THis is far items!</div>}
                showFarItems={showFarItems}
            />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders in narrow mode', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const wrapper = shallow(<Header deps={deps} isNarrowMode={true} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
