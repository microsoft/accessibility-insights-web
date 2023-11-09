// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CustomWidgetsColumnRendererFactory } from 'assessments/custom-widgets/custom-widgets-column-renderer-factory';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import * as React from 'react';

import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { RendererWrapper } from '../common/renderer-wrapper';

describe('CustomWidgetsColumnRendererFactory', () => {
    let configs: PropertyBagColumnRendererConfig<TestPropertyBag>[];
    let item: InstanceTableRow<TestPropertyBag>;

    beforeEach(() => {
        configs = [
            {
                propertyName: 'a',
                displayName: 'display a',
            },
            {
                propertyName: 'designPattern',
                displayName: 'pattern',
            },
        ];

        item = {
            key: 'stub-key',
            instance: {
                html: null,
                target: null,
                testStepResults: null,
                propertyBag: {
                    a: 'value for a',
                    role: 'combobox',
                },
            },
            statusChoiceGroup: null,
            visualizationButton: null,
        };
    });

    it('getWithLink should render link', () => {
        const result = CustomWidgetsColumnRendererFactory.getWithLink(configs);

        checkPropertyBagAndTag(result, 'A');
    });

    it('getWithoutLink should render text', () => {
        const result = CustomWidgetsColumnRendererFactory.getWithoutLink(configs);

        checkPropertyBagAndTag(result, 'SPAN');
    });

    function checkPropertyBagAndTag(result: Function, tag: string): void {
        const renderer = () => result(item);

        const renderResult = render(<RendererWrapper render={renderer} />);

        const div = renderResult.container.querySelector('.property-bag-container');
        expect(div).not.toBeNull();
        expect(div.children).toHaveLength(2);

        const designPatternSpan = div.children[1];
        expect(designPatternSpan).not.toBeUndefined();
        expect(designPatternSpan.classList.contains('property-bag-div')).toBeTruthy();
        expect(designPatternSpan.children).toHaveLength(2);

        const contentElement = designPatternSpan.children[1].children[0];
        expect(contentElement).not.toBeNull();
        expect(contentElement.tagName).toBe(tag);
    }
});

interface TestPropertyBag extends ColumnValueBag {
    a: string;
}
