// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CollapsibleComponentCards,
    CollapsibleComponentCardsProps,
} from '../../../../../DetailsView/components/cards/collapsible-component-cards';

describe('CollapsibleComponentCardsTest', () => {
    test('render expanded with content-class-name', () => {
        const props: CollapsibleComponentCardsProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            contentClassName: 'content-class-name-a',
        };
        const result = shallow(<CollapsibleComponentCards {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render expanded without content-class-name', () => {
        const props: CollapsibleComponentCardsProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const result = shallow(<CollapsibleComponentCards {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render with container-class-name', () => {
        const props: CollapsibleComponentCardsProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            containerClassName: 'a-container',
        };

        const result = shallow(<CollapsibleComponentCards {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('render without container-class-name', () => {
        const props: CollapsibleComponentCardsProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };

        const result = shallow(<CollapsibleComponentCards {...props} />);
        expect(result.getElement()).toMatchSnapshot();
    });

    test('toggle from expanded to collapsed', () => {
        const props: CollapsibleComponentCardsProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
        };
        const result = shallow(<CollapsibleComponentCards {...props} />);
        expect(result.getElement()).toMatchSnapshot('expanded');
        const button = result.find('CustomizedActionButton');
        button.simulate('click');
        expect(result.getElement()).toMatchSnapshot('collapsed');
    });
});
