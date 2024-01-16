// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render, within } from '@testing-library/react';
import { PropertyBagColumnRendererFactory } from 'assessments/common/property-bag-column-renderer-factory';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
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

        const renderResult = render(<RendererWrapper render={renderer} />);
        const div = renderResult.container.querySelector('.property-bag-container');
        expect(div).not.toBeNull();
        const propertyBagValue = within(div as HTMLElement).getByText(item.instance.propertyBag.a);
        const displayNameSpan = within(div as HTMLElement).getByText(`${configs[0].displayName}:`);
        expect(propertyBagValue).not.toBeNull();
        expect(displayNameSpan).not.toBeNull();
        expect(displayNameSpan.classList.contains('display-name')).toBeTruthy();
    });
});
