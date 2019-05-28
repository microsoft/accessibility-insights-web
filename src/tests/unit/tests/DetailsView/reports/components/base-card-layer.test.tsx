// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { BaseCardLayer } from '../../../../../../DetailsView/reports/components/base-card-layer';

describe('BaseCardLayer', () => {
    test('render', () => {
        const wrapper = shallow(<BaseCardLayer />);
        expect(wrapper.hasClass('base-card-layer-main')).toBe(true);
    });
    test('component shows up a children if passed', () => {
        const shallowWrap = shallow(
            <BaseCardLayer>
                <h1>Test</h1>
            </BaseCardLayer>,
        );
        expect(shallowWrap.children).toHaveLength(1);
        expect(shallowWrap.getElement()).toMatchSnapshot();
    });
});
