// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HeadingLevel } from 'common/components/heading-element-for-level';
import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
    TabStopsFailedInstanceSectionProps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import {
    TabStopsInstanceSectionPropsFactory,
    TabStopsInstanceSectionPropsFactoryProps,
} from 'DetailsView/components/tab-stops/tab-stops-instance-section-props-factory';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopsFailedInstanceSection', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;
    let tabStopsInstanceSectionPropsFactoryMock: IMock<TabStopsInstanceSectionPropsFactory>;
    let props: TabStopsFailedInstanceSectionProps;
    let deps: TabStopsFailedInstanceSectionDeps;
    const getNextHeadingLevelStub = (headingLevel: HeadingLevel) => headingLevel + 1;

    beforeEach(() => {
        tabStopsFailedCounterMock = Mock.ofType<TabStopsFailedCounter>();
        tabStopsInstanceSectionPropsFactoryMock =
            Mock.ofType<TabStopsInstanceSectionPropsFactory>();

        tabStopsInstanceSectionPropsFactoryMock
            .setup(mock => mock(It.isAny()))
            .returns((props: TabStopsInstanceSectionPropsFactoryProps) => {
                return {
                    results: props.results,
                    headingLevel: props.headingLevel,
                    getCollapsibleComponentPropsWithInstance: () => null,
                    deps: {} as TabStopsFailedInstanceSectionDeps,
                };
            })
            .verifiable(Times.once());

        deps = {
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
            tabStopsInstanceSectionPropsFactory: tabStopsInstanceSectionPropsFactoryMock.object,
            getNextHeadingLevel: getNextHeadingLevelStub,
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
            alwaysRenderSection: false,
            sectionHeadingLevel: 2,
            featureFlagStoreData: {},
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
        tabStopsInstanceSectionPropsFactoryMock.verifyAll();
    });

    it('does not render when no results are failing', () => {
        const requirementsStub = props.tabStopRequirementState;
        for (const requirementId of Object.keys(requirementsStub)) {
            requirementsStub[requirementId].status = 'pass';
            requirementsStub[requirementId].instances = [];
        }
        tabStopsInstanceSectionPropsFactoryMock.reset();
        tabStopsInstanceSectionPropsFactoryMock
            .setup(mock => mock(It.isAny()))
            .verifiable(Times.never());

        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 0)
            .verifiable(Times.once());

        const wrapper = shallow(<TabStopsFailedInstanceSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
        tabStopsFailedCounterMock.verifyAll();
        tabStopsInstanceSectionPropsFactoryMock.verifyAll();
    });

    it('does renders when no results are failing and set to alwaysRenderSection', () => {
        const requirementsStub = props.tabStopRequirementState;
        for (const requirementId of Object.keys(requirementsStub)) {
            requirementsStub[requirementId].status = 'pass';
            requirementsStub[requirementId].instances = [];
        }
        props.alwaysRenderSection = true;
        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 0)
            .verifiable(Times.once());

        const wrapper = shallow(<TabStopsFailedInstanceSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
        tabStopsFailedCounterMock.verifyAll();
        tabStopsInstanceSectionPropsFactoryMock.verifyAll();
    });
});
