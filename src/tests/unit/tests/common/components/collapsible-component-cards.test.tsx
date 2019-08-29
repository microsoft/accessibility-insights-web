// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { forOwn } from 'lodash';
import {
    CollapsibleComponentCards,
    CollapsibleComponentCardsProps,
} from '../../../../../DetailsView/components/cards/collapsible-component-cards';

describe('CollapsibleComponentCardsTest', () => {
    const optionalPropertiesObject = {
        contentClassName: [undefined, 'content-class-name-a'],
        containerClassName: [undefined, 'a-container'],
        buttonAriaLabel: [undefined, 'some button label'],
    };

    forOwn(optionalPropertiesObject, (propertyValues, propertyName) => {
        propertyValues.forEach(value => {
            test(`render with ${propertyName} set to: ${value}`, () => {
                const props: CollapsibleComponentCardsProps = {
                    header: <div>Some header</div>,
                    content: <div>Some content</div>,
                    headingLevel: 5,
                    [propertyName]: value,
                };

                const result = shallow(<CollapsibleComponentCards {...props} />);
                expect(result.getElement()).toMatchSnapshot();
            });
        });
    });

    test('toggle from expanded to collapsed', () => {
        const props: CollapsibleComponentCardsProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            headingLevel: 5,
        };
        const result = shallow(<CollapsibleComponentCards {...props} />);
        expect(result.getElement()).toMatchSnapshot('expanded');
        const button = result.find('CustomizedActionButton');
        button.simulate('click');
        expect(result.getElement()).toMatchSnapshot('collapsed');
    });
});
