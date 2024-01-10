// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';

import {
    CollapsibleComponent,
    CollapsibleComponentProps,
} from '../../../../../common/components/collapsible-component';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('CollapsibleComponentTest', () => {
    mockReactComponents([ActionButton]);
    test('render expanded with content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            contentClassName: 'content-class-name',
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });

    test('render expanded without content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });

    test('render with container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            containerClassName: 'a-container',
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });

    test('render without container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });

    test('toggle from expanded to collapsed', async () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot('expanded');
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
        await userEvent.click(renderResult.container.querySelector('mock-customizedactionbutton'));
        expect(renderResult.asFragment()).toMatchSnapshot('collapsed');
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });
});
