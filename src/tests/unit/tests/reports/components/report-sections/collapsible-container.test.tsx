// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { CollapsibleContainer, CollapsibleContainerProps } from 'reports/components/report-sections/collapsible-container';

describe('CollapsibleContainer', () => {
    const getProps = (customProps?: Partial<CollapsibleContainerProps>): CollapsibleContainerProps => {
        const defaultProps: Partial<CollapsibleContainerProps> = {
            id: 'test-id',
            visibleHeadingContent: <div>this is the visible heading content</div>,
            collapsibleContent: <div> this is the collapsible content </div>,
            titleHeadingLevel: 5,
        };

        return {
            ...defaultProps,
            ...customProps,
        } as CollapsibleContainerProps;
    };

    it('renders, no optional fields', () => {
        const props = getProps();
        const wrapped = shallow(<CollapsibleContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('renders, with extra class name for the container div', () => {
        const props = getProps({
            containerClassName: 'extra-class-name',
        });

        const wrapped = shallow(<CollapsibleContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('renders, with button aria label', () => {
        const props = getProps({
            buttonAriaLabel: 'test button aria label',
        });

        const wrapped = shallow(<CollapsibleContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
