// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { Header, HeaderDeps } from 'common/components/header';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
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
        const renderResult = render(<Header deps={deps} narrowModeStatus={stubNarrowModeStatus} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders without header title', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const renderResult = render(
            <Header deps={deps} showHeaderTitle={false} narrowModeStatus={stubNarrowModeStatus} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it.each([true, false])('renders with showFarItems equals %s', showFarItems => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as HeaderDeps;
        const renderResult = render(
            <Header
                deps={deps}
                farItems={<div>THis is far items!</div>}
                showFarItems={showFarItems}
                narrowModeStatus={stubNarrowModeStatus}
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
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
        const renderResult = render(<Header deps={deps} narrowModeStatus={narrowModeStatus} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
