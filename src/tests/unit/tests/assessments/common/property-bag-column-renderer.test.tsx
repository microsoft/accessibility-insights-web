// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    IPropertyBagColumnRendererConfig,
    propertyBagColumnRenderer,
} from '../../../../../assessments/common/property-bag-column-renderer';
import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { IAssessmentInstanceRowData } from '../../../../../DetailsView/components/assessment-instance-table';
import { RendererWrapper } from './renderer-wrapper';

interface TestPropertyBag extends ColumnValueBag {
    a: string;
    b: number;
    c: Date;
    d: boolean;
    e: IDictionaryStringTo<string>;
    f: IDictionaryStringTo<string>;
    nullValues: IDictionaryStringTo<string>;
}

describe('PropertyBagColumnRendererTest', () => {
    test('render, one property from the bag', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const config: IPropertyBagColumnRendererConfig<TestPropertyBag> = {
            propertyName: 'a',
            displayName: 'display name',
        };

        const configs = [config];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render, several properties from the bag', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'a', displayName: 'display a' },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with expanded object', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'e', displayName: 'display e', expand: true },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with expanded object where some have null values', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'nullValues', displayName: 'display null values', expand: true },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render, empty object', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'f', displayName: 'display f', defaultValue: 'default', expand: true },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render, default value', () => {
        const propertyBag = getPropertyBag();
        propertyBag.a = null;
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'a', displayName: 'display a', defaultValue: 'is a default value' },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render, property is null, no default value', () => {
        const propertyBag = getPropertyBag();
        propertyBag.a = null;
        propertyBag.b = null;

        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'a', displayName: 'display a' },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with a combination of expanded and not expanded objects', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: IPropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'e', displayName: 'display e', expand: true },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});

function createWrapper(item, configs) {
    const renderer = () => propertyBagColumnRenderer(item, configs);

    return shallow(<RendererWrapper render={renderer} />);
}

function getPropertyBag(): TestPropertyBag {
    return {
        a: 'string value',
        b: -1,
        c: new Date(),
        d: true,
        e: {
            key1: 'value1',
            key2: 'value2',
        },
        f: {},
        nullValues: {
            key1: 'value1',
            key2: null,
        },
    };
}

function buildItemWithPropertyBag(bag: TestPropertyBag): IAssessmentInstanceRowData<TestPropertyBag> {
    return {
        instance: {
            propertyBag: bag,
            html: null,
            target: null,
            testStepResults: null,
        },
        statusChoiceGroup: null,
        visualizationButton: null,
    };
}
