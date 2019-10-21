// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ElectronCollapsibleComponent,
    ElectronCollapsibleComponentProps,
} from 'electron/common/components/collapsible-component-cards-electron';
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
                const props: ElectronCollapsibleComponentProps = {
                    header: <div>Some header</div>,
                    content: <div>Some content</div>,
                    headingLevel: 5,
                    [propertyName]: value,
                };
                const control = ElectronCollapsibleComponent(props);
                const result = shallow(control);
                expect(result.getElement()).toMatchSnapshot();
            });
        });
    });

    test('toggle from expanded to collapsed', () => {
        const props: ElectronCollapsibleComponentProps = {
            header: <div>Some header</div>,
            content: <div>Some content</div>,
            headingLevel: 5,
            id: 'test-id',
        };
        const control = ElectronCollapsibleComponent(props);
        const result = shallow(control);
        expect(result.getElement()).toMatchSnapshot('expanded');

        const button = result.find('CustomizedActionButton');
        button.simulate('click');
        expect(result.getElement()).toMatchSnapshot('collapsed');
    });
});
