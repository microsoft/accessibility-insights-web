// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CollapsibleComponentCard,
    CollapsibleComponentProps,
} from 'electron/views/automated-checks/components/collapsible-component-cards';
import { shallow } from 'enzyme';
import { forOwn } from 'lodash';
import * as React from 'react';

describe('CollapsibleComponentCardsTest', () => {
    const optionalPropertiesObject = {
        contentClassName: [undefined, 'content-class-name-a'],
        containerClassName: [undefined, 'a-container'],
        buttonAriaLabel: [undefined, 'some button label'],
    };

    forOwn(optionalPropertiesObject, (propertyValues, propertyName) => {
        propertyValues.forEach(value => {
            test(`render with ${propertyName} set to: ${value}`, () => {
                const props: CollapsibleComponentProps = {
                    header: <div>Some header</div>,
                    content: <div>Some content</div>,
                    headingLevel: 5,
                    [propertyName]: value,
                };
                const control = CollapsibleComponentCard(props);
                const result = shallow(control);
                expect(result.getElement()).toMatchSnapshot();
            });
        });
    });

    test('matches stored UI snapshot for both expanded and collapsed state', () => {
        const props: CollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            headingLevel: 5,
            id: 'test-id',
        };
        const control = CollapsibleComponentCard(props);
        const result = shallow(control);
        expect(result.getElement()).toMatchSnapshot('expanded');

        const button = result.find('CustomizedActionButton');
        button.simulate('click');
        expect(result.getElement()).toMatchSnapshot('collapsed');
    });
});
