// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { propertyBagColumnRenderer } from 'assessments/common/property-bag-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { PropertyBagColumnRendererConfig } from 'common/types/property-bag/property-bag-column-renderer-config';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { ColumnValueBag } from '../../../../../common/types/property-bag/column-value-bag';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { RendererWrapper } from './renderer-wrapper';

interface TestPropertyBag extends ColumnValueBag {
    a: string;
    b: number;
    c: Date;
    d: boolean;
    e: DictionaryStringTo<string>;
    f: DictionaryStringTo<string>;
    nullValues: DictionaryStringTo<string>;
}

describe('PropertyBagColumnRendererTest', () => {
    test('render, one property from the bag', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const config: PropertyBagColumnRendererConfig<TestPropertyBag> = {
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

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'a', displayName: 'display a' },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with expanded object', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'e', displayName: 'display e', expand: true },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with expanded object where some have null values', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'nullValues', displayName: 'display null values', expand: true },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render, empty object', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'f', displayName: 'display f', defaultValue: 'default', expand: true },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render, default value', () => {
        const propertyBag = getPropertyBag();
        propertyBag.a = null;
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
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

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'a', displayName: 'display a' },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with a combination of expanded and not expanded objects', () => {
        const propertyBag = getPropertyBag();
        const item = buildItemWithPropertyBag(propertyBag);

        const configs: PropertyBagColumnRendererConfig<TestPropertyBag>[] = [
            { propertyName: 'e', displayName: 'display e', expand: true },
            { propertyName: 'b', displayName: 'display b' },
        ];

        const wrapper = createWrapper(item, configs);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});

function createWrapper(item, configs): ShallowWrapper {
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

function buildItemWithPropertyBag(bag: TestPropertyBag): InstanceTableRow<TestPropertyBag> {
    return {
        key: 'stub-key',
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
