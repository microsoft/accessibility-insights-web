// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
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

jest.mock('@fluentui/react-components');
describe('CollapsibleComponentTest', () => {
    mockReactComponents([Button]);
    test('render expanded with content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            contentClassName: 'content-class-name',
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    test('render expanded without content-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    test('render with container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            containerClassName: 'a-container',
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    test('render without container-class-name', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    test('toggle from expanded to collapsed', async () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const renderResult = render(<CollapsibleComponent {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot('expanded');
        expectMockedComponentPropsToMatchSnapshots([Button]);
        await userEvent.click(renderResult.container.querySelector('mock-customizedactionbutton'));
        expect(renderResult.asFragment()).toMatchSnapshot('collapsed');
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });
});
