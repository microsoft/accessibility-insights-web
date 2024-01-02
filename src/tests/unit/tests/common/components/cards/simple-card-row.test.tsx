// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { SimpleCardRow, SimpleCardRowProps } from 'common/components/cards/simple-card-row';
import * as React from 'react';

describe('SimpleCardRow', () => {
    let label: string;
    let content: string | JSX.Element;
    let rowKey: string;
    let props: SimpleCardRowProps;

    beforeEach(() => {
        label = 'test label';
        content = 'test content';
        rowKey = 'test row key';
        props = {
            label,
            content,
            rowKey,
        };
    });

    it('renders', () => {
        const renderResult = render(<SimpleCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with correct styling with extra class name', () => {
        props.contentClassName = 'test class name';
        const renderResult = render(<SimpleCardRow {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
