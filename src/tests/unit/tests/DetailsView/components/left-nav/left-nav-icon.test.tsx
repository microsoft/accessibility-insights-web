// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    LeftNavIconProps,
    LeftNavIndexIcon,
    LeftNavStatusIcon,
} from '../../../../../../DetailsView/components/left-nav/left-nav-icon';
import { StatusIcon } from '../../../../../../DetailsView/components/status-icon';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../DetailsView/components/status-icon');
describe('LeftNavStatusIcon', () => {
    mockReactComponents([StatusIcon]);
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

        const renderResult = render(<LeftNavStatusIcon {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
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

        const renderResult = render(<LeftNavIndexIcon {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
