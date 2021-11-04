// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import {
    TabStopsRequirementsWithInstances,
    TabStopsRequirementsWithInstancesDeps,
    TabStopsRequirementsWithInstancesProps,
} from 'DetailsView/tab-stops-requirements-with-instances';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('TabStopsRequirementsWithInstances', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;
    const CollapsibleControlStub = getCollapsibleControlStub();
    let depsStub = {} as TabStopsRequirementsWithInstancesDeps;
    let props = {} as TabStopsRequirementsWithInstancesProps;

    beforeEach(() => {
        tabStopsFailedCounterMock = Mock.ofType(TabStopsFailedCounter);

        depsStub = {
            collapsibleControl: (props: CollapsibleComponentCardsProps) => (
                <CollapsibleControlStub {...props} />
            ),
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
        } as TabStopsRequirementsWithInstancesDeps;

        props = {
            deps: depsStub,
            headingLevel: 3,
            results: [
                {
                    id: 'keyboard-navigation',
                    description: 'test requirement description 1',
                    name: 'test requirement name 1',
                    instances: [{ id: 'test-id-1', description: 'test desc 1' }],
                    isExpanded: false,
                },
                {
                    id: 'keybaord-traps',
                    description: 'test requirement description 2',
                    name: 'test requirement name 2',
                    instances: [{ id: 'test-id-2', description: 'test desc 2' }],
                    isExpanded: false,
                },
            ] as TabStopsRequirementResult[],
        } as TabStopsRequirementsWithInstancesProps;
    });

    it('renders', () => {
        const wrapped = shallow(<TabStopsRequirementsWithInstances {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    function getCollapsibleControlStub(): ReactFCWithDisplayName<CollapsibleComponentCardsProps> {
        return NamedFC<CollapsibleComponentCardsProps>('CollapsibleControlStub', _ => null);
    }
});
