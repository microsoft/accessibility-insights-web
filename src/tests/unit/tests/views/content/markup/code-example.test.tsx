// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CodeBlock } from 'assessments/markup';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

import { CodeExample } from 'views/content/markup/code-example';

jest.mock('assessments/markup');

describe('<CodeExample>', () => {
    mockReactComponents([CodeBlock]);
    it('renders with title', () => {
        const renderResult = render(<CodeExample title="title">code</CodeExample>);

        expect(renderResult.container.querySelector('.code-example-title')).not.toBe(null);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with no title', () => {
        const renderResult = render(<CodeExample>code</CodeExample>);
        expect(renderResult.container.querySelector('.code-example-title')).toBe(null);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with no highlighted region', () => {
        const renderResult = render(<CodeExample>No highlight</CodeExample>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with one highlighted region', () => {
        const renderResult = render(<CodeExample>One [single] highlight</CodeExample>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with empty highlighted region', () => {
        const renderResult = render(<CodeExample>Empty [] highlight</CodeExample>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with unterminated highlighted region', () => {
        const renderResult = render(<CodeExample>One [unterminated highlight</CodeExample>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with many highlighted regions', () => {
        const renderResult = render(
            <CodeExample>With [quite] a [number] of [highlights].</CodeExample>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with a single line break', () => {
        const renderResult = render(<CodeExample>{`Line 1\nLine 2`}</CodeExample>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with a line breaks and a highlighted line', () => {
        const renderResult = render(<CodeExample>{`Line 1\n[Line 2]\nLine 3`}</CodeExample>);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with a highlight that spans multiple lines', () => {
        const renderResult = render(
            <CodeExample>{`Line 1\n[Line 2\nLine 3]\nLine 4`}</CodeExample>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with a highlight that breaks in the middle of multiple lines', () => {
        const renderResult = render(
            <CodeExample>{`Line 1\nLine 2 [HIGHLIGHT\nHERE]Line 3\nLine 4`}</CodeExample>,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('br has the correct key', () => {
        const renderResult = render(<CodeExample>{`Line 1\nLine 2`}</CodeExample>);
        expect(renderResult.container.querySelector('br')).not.toBeNull();
    });
});
