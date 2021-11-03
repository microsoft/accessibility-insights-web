// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TabStopsMinimalRequirementHeader,
    TabStopsMinimalRequirementHeaderProps,
} from 'DetailsView/tab-stops-minimal-requirement-header';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('TabStopsMinimalRequirementHeader', () => {
    const requirement = {
        id: 'keyboard-navigation',
        description: 'test requirement description',
        name: 'test requirement name',
        instances: [{ id: 'test-id', description: 'test description' }],
        isExpanded: false,
    } as TabStopsRequirementResult;

    it('renders', () => {
        const props: TabStopsMinimalRequirementHeaderProps = {
            requirement,
        };
        const wrapped = shallow(<TabStopsMinimalRequirementHeader {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
