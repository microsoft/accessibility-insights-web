// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import * as React from 'react';

import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { RendererWrapper } from '../common/renderer-wrapper';
import { TargetSizeColumnRendererFactory } from 'assessments/pointer-motion/target-size-column-renderer-factory';

describe('TargetSizeColumnRendererFactory', () => {
    let configs: PropertyBagColumnRendererConfig<TestPropertyBag>[];
    let item: InstanceTableRow<TestPropertyBag>;

    beforeEach(() => {
        configs = [
            {
                propertyName: 'a',
                displayName: 'display a',
            },
            {
                propertyName: 'sizeComponent',
                displayName: 'size',
            },
            {
                propertyName: 'offsetComponent',
                displayName: 'offset',
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
                    sizeStatus: 'pass',
                    height: 40,
                    width: 40,
                    minSize: 30,
                },
            },
            statusChoiceGroup: null,
            visualizationButton: null,
        };
    });

    it('getColumnComponent should render component', () => {
        const result = TargetSizeColumnRendererFactory.getColumnComponent(configs);

        checkPropertyBagAndTag(result, 'SPAN');
    });

    function checkPropertyBagAndTag(result: Function, tag: string): void {
        const renderer = () => result(item);

        const renderResult = render(<RendererWrapper render={renderer} />);
        renderResult.debug();
        const div = renderResult.container.querySelector('.property-bag-container');
        expect(div).not.toBeNull();
        expect(div.children).toHaveLength(2);

        const targetSizeSpan = div.children[1];
        expect(targetSizeSpan).not.toBeUndefined();
        expect(targetSizeSpan.classList.contains('property-bag-div')).toBeTruthy();
        expect(targetSizeSpan.children).toHaveLength(2);
        const contentElement = targetSizeSpan.children[1];
        expect(contentElement).not.toBeNull();
        expect(contentElement.tagName).toBe(tag);
    }
});

interface TestPropertyBag extends ColumnValueBag {
    a: string;
}
