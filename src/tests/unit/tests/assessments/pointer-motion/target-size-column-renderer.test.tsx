// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { targetSizeColumnRenderer } from 'assessments/pointer-motion/target-size-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import * as React from 'react';

import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { RendererWrapper } from '../common/renderer-wrapper';

describe('TargetSizeColumnRenderer', () => {
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
                },
            },
            statusChoiceGroup: null,
            visualizationButton: null,
        };
    });

    it('should render unrelated properties', () => {
        const renderer = () => targetSizeColumnRenderer(item, configs);

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

    describe('when sizeStatus is set', () => {
        beforeEach(() => {
            item.instance.propertyBag.sizeStatus = 'pass';
        });
        it('should render sizeComponent when the necessary properties are available', () => {
            item.instance.propertyBag.height = 40;
            item.instance.propertyBag.width = 40;
            item.instance.propertyBag.minSize = 28;
            const renderer = () => targetSizeColumnRenderer(item, configs);

            const renderResult = render(<RendererWrapper render={renderer} />);
            const div = renderResult.container.querySelector('.property-bag-container');
            expect(div).not.toBeNull();
            expect(div.children).toHaveLength(2);

            const propertyBagDiv = div.children[1];
            expect(propertyBagDiv).not.toBeUndefined();
            expect(propertyBagDiv.classList.contains('property-bag-div')).toBeTruthy();
            expect(propertyBagDiv.children).toHaveLength(2);

            const targetSizeSpan = propertyBagDiv.children[1];
            expect(targetSizeSpan.id).toEqual('target-size');
            expect(targetSizeSpan.children.length).toEqual(0);
            expect(targetSizeSpan.textContent).toContain(
                `${item.instance.propertyBag.height}px by ${item.instance.propertyBag.width}px`,
            );
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('should return null when the necessary properties are not available', () => {
            item.instance.propertyBag.a = 'value for a';
            const renderer = () => targetSizeColumnRenderer(item, configs);

            const renderResult = render(<RendererWrapper render={renderer} />);

            const div = renderResult.container.querySelector('.property-bag-container');
            expect(div).not.toBeNull();
            expect(div.children).toHaveLength(1);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('should render expected message with bolded words when sizeStatus is fail', () => {
            item.instance.propertyBag.sizeStatus = 'fail';
            item.instance.propertyBag.height = 5;
            item.instance.propertyBag.width = 5;
            item.instance.propertyBag.minSize = 28;
            const renderer = () => targetSizeColumnRenderer(item, configs);

            const renderResult = render(<RendererWrapper render={renderer} />);
            const div = renderResult.container.querySelector('.property-bag-container');
            expect(div).not.toBeNull();
            expect(div.children).toHaveLength(2);

            const propertyBagDiv = div.children[1];
            expect(propertyBagDiv).not.toBeUndefined();
            expect(propertyBagDiv.classList.contains('property-bag-div')).toBeTruthy();
            expect(propertyBagDiv.children).toHaveLength(2);

            const targetSizeSpan = propertyBagDiv.children[1];
            expect(targetSizeSpan.id).toEqual('target-size');
            expect(targetSizeSpan.children.length).toEqual(1);
            expect(targetSizeSpan.textContent).toContain(
                `${item.instance.propertyBag.height}px by ${item.instance.propertyBag.width}px`,
            );
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });

    describe('when offsetStatus is set', () => {
        beforeEach(() => {
            item.instance.propertyBag.offsetStatus = 'pass';
        });
        it('should render offsetComponent when the necessary properties are available', () => {
            item.instance.propertyBag.closestOffset = 25;
            item.instance.propertyBag.minOffset = 25;
            const renderer = () => targetSizeColumnRenderer(item, configs);

            const renderResult = render(<RendererWrapper render={renderer} />);
            const div = renderResult.container.querySelector('.property-bag-container');
            expect(div).not.toBeNull();
            expect(div.children).toHaveLength(2);

            const propertyBagDiv = div.children[1];
            expect(propertyBagDiv).not.toBeUndefined();
            expect(propertyBagDiv.classList.contains('property-bag-div')).toBeTruthy();
            expect(propertyBagDiv.children).toHaveLength(2);

            const targetOffsetSpan = propertyBagDiv.children[1];
            expect(targetOffsetSpan.id).toEqual('target-offset');
            expect(targetOffsetSpan.children.length).toEqual(0);
            expect(targetOffsetSpan.textContent).toContain(
                `${item.instance.propertyBag.closestOffset}px`,
            );
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('should return null when the necessary properties are not available', () => {
            item.instance.propertyBag.a = 'value for a';
            const renderer = () => targetSizeColumnRenderer(item, configs);

            const renderResult = render(<RendererWrapper render={renderer} />);

            const div = renderResult.container.querySelector('.property-bag-container');
            expect(div).not.toBeNull();
            expect(div.children).toHaveLength(1);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});

interface TestPropertyBag extends ColumnValueBag {
    a: string;
}
