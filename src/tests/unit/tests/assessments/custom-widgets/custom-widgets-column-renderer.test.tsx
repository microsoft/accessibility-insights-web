// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { customWidgetsColumnRenderer } from 'assessments/custom-widgets/custom-widgets-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { shallow } from 'enzyme';
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

        const wrapper = shallow(<RendererWrapper render={renderer} />);

        const div = wrapper.find('.property-bag-container');
        expect(div.exists()).toBeTruthy();
        expect(div.children()).toHaveLength(1);

        const designPatternSpan = div.childAt(0);
        expect(designPatternSpan).not.toBeUndefined();
        expect(designPatternSpan.hasClass('property-bag-div')).toBeTruthy();
        expect(designPatternSpan.children()).toHaveLength(2);
        expect(designPatternSpan.text()).toEqual(
            `${configs[0].displayName}: ${item.instance.propertyBag.a}`,
        );
    });

    it('should render expected links when role is set', () => {
        const expectedValues = [
            {
                designPattern: 'Accordion',
                URL: 'https://www.w3.org/TR/wai-aria-practices-1.1/#accordion',
            },
            {
                designPattern: 'Button',
                URL: 'https://www.w3.org/TR/wai-aria-practices-1.1/#button',
            },
            {
                designPattern: 'Disclosure (Show/Hide)',
                URL: 'https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure',
            },
            {
                designPattern: 'Menu Button',
                URL: 'https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton',
            },
        ];
        item.instance.propertyBag.role = 'button';

        const renderer = () => customWidgetsColumnRenderer(item, configs, true);

        const wrapper = shallow(<RendererWrapper render={renderer} />);

        const div = wrapper.find('.property-bag-container');
        expect(div.exists()).toBeTruthy();
        expect(div.children()).toHaveLength(2);

        const designPatternSpan = div.childAt(1);
        expect(designPatternSpan).not.toBeUndefined();
        expect(designPatternSpan.hasClass('property-bag-div')).toBeTruthy();

        const links = designPatternSpan.find('NewTabLink');
        expect(links).toHaveLength(4);

        for (let i = 0; i < links.length; i++) {
            checkLink(links.get(i), expectedValues[i].designPattern, expectedValues[i].URL);
        }
    });

    it('should render expected spans when role is set', () => {
        const expectedValues = [
            {
                designPattern: 'Slider',
                URL: 'https://www.w3.org/TR/wai-aria-practices-1.1/#slider',
            },
            {
                designPattern: 'Slider (Multi-thumb)',
                URL: 'https://www.w3.org/TR/wai-aria-practices-1.1/#sliderwothumb',
            },
        ];
        item.instance.propertyBag.role = 'slider';

        const renderer = () => customWidgetsColumnRenderer(item, configs, false);

        const wrapper = shallow(<RendererWrapper render={renderer} />);

        const div = wrapper.find('.property-bag-container');
        expect(div.exists()).toBeTruthy();
        expect(div.children()).toHaveLength(2);
        const spans = div.find('.expanded-property-div > span');
        expect(spans).toHaveLength(2);

        for (let i = 0; i < spans.length; i++) {
            expect(spans.get(i).props.children).toEqual(expectedValues[i].designPattern);
        }
    });

    function checkLink(link: React.ReactElement<any>, name: string, url: string): void {
        expect(link.props.href).toEqual(url);
        expect(link.props.children).toEqual(name);
    }
});

interface TestPropertyBag extends ColumnValueBag {
    a: string;
}
