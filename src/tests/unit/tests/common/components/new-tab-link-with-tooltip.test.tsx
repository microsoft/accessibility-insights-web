// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TooltipHost } from '@fluentui/react';
import { render } from '@testing-library/react';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe(NewTabLinkWithTooltip.displayName, () => {
    mockReactComponents([TooltipHost]);
    const props = {
        href: 'test',
        tooltipContent: 'tooltip text',
    };

    it('renders with tooltip content', () => {
        const renderResult = render(<NewTabLinkWithTooltip {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TooltipHost]);
    });

    it('renders with null tooltip content', () => {
        const testProps = {
            ...props,
            tooltipContent: undefined,
        };

        const renderResult = render(<NewTabLinkWithTooltip {...testProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TooltipHost]);
    });

    it('handles children', () => {
        const renderResult = render(
            <NewTabLinkWithTooltip {...props}>link text</NewTabLinkWithTooltip>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TooltipHost]);
    });
});
