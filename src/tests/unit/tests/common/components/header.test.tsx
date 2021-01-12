// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Header, HeaderDeps } from 'common/components/header';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('Header', () => {
    const stubNarrowModeStatus = {
        isHeaderAndNavCollapsed: false,
    } as NarrowModeStatus;

    it('renders per snapshot', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const wrapper = shallow(<Header deps={deps} narrowModeStatus={stubNarrowModeStatus} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders without header title', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const wrapper = shallow(
            <Header deps={deps} showHeaderTitle={false} narrowModeStatus={stubNarrowModeStatus} />,
        );
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
                narrowModeStatus={stubNarrowModeStatus}
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
        const narrowModeStatus = {
            isHeaderAndNavCollapsed: true,
        } as NarrowModeStatus;
        const wrapper = shallow(<Header deps={deps} narrowModeStatus={narrowModeStatus} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
