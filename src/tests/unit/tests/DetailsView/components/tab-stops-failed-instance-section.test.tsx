// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
    TabStopsFailedInstanceSectionProps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopsFailedInstanceSection', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;

    let props: TabStopsFailedInstanceSectionProps;
    let deps: TabStopsFailedInstanceSectionDeps;

    beforeEach(() => {
        tabStopsFailedCounterMock = Mock.ofType(TabStopsFailedCounter);

        deps = {
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
        } as TabStopsFailedInstanceSectionDeps;

        props = {
            deps: deps,
            tabStopRequirementState: {
                'keyboard-navigation': {
                    status: 'fail',
                    instances: [{ id: 'test-id-1', description: 'test desc 1' }],
                    isExpanded: false,
                },
                'keyboard-traps': {
                    status: 'fail',
                    instances: [{ id: 'test-id-2', description: 'test desc 2' }],
                    isExpanded: false,
                },
            },
        };
    });

    it('renders with failing results', () => {
        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 10)
            .verifiable(Times.once());

        const wrapper = shallow(<TabStopsFailedInstanceSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        tabStopsFailedCounterMock.verifyAll();
    });

    it('does not render when no results are failing', () => {
        const requirementsStub = props.tabStopRequirementState;
        for (const requirementId of Object.keys(requirementsStub)) {
            requirementsStub[requirementId].status = 'pass';
            requirementsStub[requirementId].instances = [];
        }

        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 0)
            .verifiable(Times.once());

        const wrapper = shallow(<TabStopsFailedInstanceSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        tabStopsFailedCounterMock.verifyAll();
    });
});
