// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    LeftNavIconProps,
    LeftNavIndexIcon,
    LeftNavStatusIcon,
} from '../../../../../../DetailsView/components/left-nav/left-nav-icon';

describe('LeftNavStatusIcon', () => {
    it('render', () => {
        const props: LeftNavIconProps = {
            item: {
                status: 0,
                index: 1,
                name: 'test',
                url: 'test',
            },
            className: 'some class',
        } as LeftNavIconProps;

        const actual = shallow(<LeftNavStatusIcon {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});

describe('LeftNavIndexIcon', () => {
    it('render', () => {
        const props: LeftNavIconProps = {
            item: {
                status: 0,
                index: 1,
                name: 'test',
                url: 'test',
            },
        } as LeftNavIconProps;

        const actual = shallow(<LeftNavIndexIcon {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });
});
