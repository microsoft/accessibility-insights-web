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
});
