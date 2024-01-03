// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { customWidgetsColumnRenderer } from 'assessments/custom-widgets/custom-widgets-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import * as React from 'react';

import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { RendererWrapper } from '../common/renderer-wrapper';

describe('CustomWidgetsColumnRenderer', () => {
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
                },
            },
            statusChoiceGroup: null,
            visualizationButton: null,
        };
    });

    it('should render unrelated properties', () => {
        const renderer = () => customWidgetsColumnRenderer(item, configs, true);

        const renderResult = render(<RendererWrapper render={renderer} />);

        const div = renderResult.container.querySelector('.property-bag-container');
        expect(div).not.toBeNull();
        expect(div.children).toHaveLength(1);

        const designPatternSpan = div.children[0];
        expect(designPatternSpan).not.toBeUndefined();
        expect(designPatternSpan.classList.contains('property-bag-div')).toBeTruthy();
        expect(designPatternSpan.children).toHaveLength(1);
        expect(designPatternSpan.textContent).toEqual(
            `${configs[0].displayName}: ${item.instance.propertyBag.a}`,
        );
    });

    it('should render expected links when role is set', () => {
        const expectedValues = [
            {
                designPattern: 'Accordion',
                URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion',
            },
            {
                designPattern: 'Button',
                URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/button',
            },
            {
                designPattern: 'Disclosure (Show/Hide)',
                URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure',
            },
            {
                designPattern: 'Menu Button',
                URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/menubutton',
            },
        ];
        item.instance.propertyBag.role = 'button';

        const renderer = () => customWidgetsColumnRenderer(item, configs, true);

        const renderResult = render(<RendererWrapper render={renderer} />);

        const div = renderResult.container.querySelector('.property-bag-container');
        expect(div).not.toBeNull();
        expect(div.children).toHaveLength(2);

        const designPatternSpan = div.children[1];
        expect(designPatternSpan).not.toBeUndefined();
        expect(designPatternSpan.classList.contains('property-bag-div')).toBeTruthy();

        const links = designPatternSpan.querySelectorAll('a');
        expect(links).toHaveLength(4);

        for (let i = 0; i < links.length; i++) {
            checkLink(links.item(i), expectedValues[i].designPattern, expectedValues[i].URL);
        }
    });

    it('should render expected spans when role is set', () => {
        const expectedValues = [
            {
                designPattern: 'Slider',
                URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider',
            },
            {
                designPattern: 'Slider (Multi-thumb)',
                URL: 'https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb',
            },
        ];
        item.instance.propertyBag.role = 'slider';

        const renderer = () => customWidgetsColumnRenderer(item, configs, false);

        const renderResult = render(<RendererWrapper render={renderer} />);

        const div = renderResult.container.querySelector('.property-bag-container');
        expect(div).not.toBeNull();
        expect(div.children).toHaveLength(2);
        const spans = div.querySelectorAll('.expanded-property-div > span');
        expect(spans).toHaveLength(2);

        for (let i = 0; i < spans.length; i++) {
            expect(spans.item(i).textContent).toEqual(expectedValues[i].designPattern);
        }
    });

    function checkLink(link: Element, name: string, url: string): void {
        expect(link.getAttribute('href')).toEqual(url);
        expect(link.textContent).toEqual(name);
    }
});

interface TestPropertyBag extends ColumnValueBag {
    a: string;
}
