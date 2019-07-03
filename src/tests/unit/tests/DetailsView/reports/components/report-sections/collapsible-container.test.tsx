// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CollapsibleContainer,
    CollapsibleContainerProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/collapsible-container';

describe('CollapsibleContainer', () => {
    const getProps = (customProps?: Partial<CollapsibleContainerProps>): CollapsibleContainerProps => {
        const defaultProps: Partial<CollapsibleContainerProps> = {
            id: 'test-id',
            visibleHeadingContent: <div>this is the visible heading content</div>,
            collapsibleContent: <div> this is the collapsible content </div>,
            buttonAriaLabel: 'button aria label',
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

    it('renders, with heading level for the title container', () => {
        const props = getProps({
            titleHeadingLevel: 5,
        });

        const wrapped = shallow(<CollapsibleContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
