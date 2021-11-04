// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import {
    TabStopsMinimalRequirementHeader,
    TabStopsMinimalRequirementHeaderDeps,
    TabStopsMinimalRequirementHeaderProps,
} from 'DetailsView/tab-stops-minimal-requirement-header';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('TabStopsMinimalRequirementHeader', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;

    const requirement = {
        id: 'keyboard-navigation',
        description: 'test requirement description',
        name: 'test requirement name',
        instances: [{ id: 'test-id', description: 'test description' }],
        isExpanded: false,
    } as TabStopsRequirementResult;

    let deps = {} as TabStopsMinimalRequirementHeaderDeps;

    beforeAll(() => {
        tabStopsFailedCounterMock = Mock.ofType(TabStopsFailedCounter);

        deps = {
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
        } as TabStopsMinimalRequirementHeaderDeps;
    });

    it('renders', () => {
        const props: TabStopsMinimalRequirementHeaderProps = {
            deps,
            requirement,
        };
        const wrapped = shallow(<TabStopsMinimalRequirementHeader {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
