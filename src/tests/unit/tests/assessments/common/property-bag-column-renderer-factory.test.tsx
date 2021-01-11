// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PropertyBagColumnRendererFactory } from 'assessments/common/property-bag-column-renderer-factory';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { shallow } from 'enzyme';
import * as React from 'react';

import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { RendererWrapper } from './renderer-wrapper';

interface TestPropertyBag extends ColumnValueBag {
    a: string;
}

describe('PropertyBagColumnRendererFactoryTest', () => {
    test('get', () => {
        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            {
                propertyName: 'a',
                displayName: 'display a',
            },
        ];

        const item: InstanceTableRow<TestPropertyBag> = {
            key: 'stub-key',
            instance: {
                html: null,
                target: null,
                testStepResults: null,
                propertyBag: {
                    a: 'value for a',
                },
            },
            statusChoiceGroup: null,
            visualizationButton: null,
        };

        const result = PropertyBagColumnRendererFactory.getRenderer(configs);

        const renderer = () => result(item);

        const wrapper = shallow(<RendererWrapper render={renderer} />);

        const div = wrapper.find('.property-bag-container');

        expect(div.exists()).toBeTruthy();

        const outterSpan = div.childAt(0);

        expect(outterSpan.exists()).toBeTruthy();
        expect(outterSpan.hasClass('property-bag-div')).toBeTruthy();
        expect(outterSpan.children().length).toBe(2);

        const displayNameSpan = outterSpan.childAt(0);

        expect(displayNameSpan.exists()).toBeTruthy();
        expect(displayNameSpan.hasClass('display-name')).toBeTruthy();
        expect(`${configs[0].displayName}: `).toBe(displayNameSpan.text());
    });
});
