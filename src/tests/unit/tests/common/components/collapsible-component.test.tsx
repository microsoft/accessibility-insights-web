// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';

import {
    CollapsibleComponent,
    CollapsibleComponentProps,
} from '../../../../../common/components/collapsible-component';

describe('CollapsibleComponentTest', () => {
    test('render expanded with content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            contentClassName: 'content-class-name',
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render expanded without content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render with container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            containerClassName: 'a-container',
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render without container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('toggle from expanded to collapsed', async () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot('expanded');
        await userEvent.click(renderResult.getByRole('button'));
        expect(renderResult.asFragment()).toMatchSnapshot('collapsed');
    });
});
