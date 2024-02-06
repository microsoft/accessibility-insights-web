// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { HeadingElementForLevel, HeadingLevel } from 'common/components/heading-element-for-level';
import {
    TabStopsInstanceSectionPropsFactory,
    TabStopsInstanceSectionPropsFactoryProps,
} from 'DetailsView/components/tab-stops/tab-stops-instance-section-props-factory';
import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
    TabStopsFailedInstanceSectionProps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { TabStopsRequirementsWithInstances } from '../../../../../DetailsView/tab-stops-requirements-with-instances';
import { ResultSectionTitle } from '../../../../../common/components/cards/result-section-title';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('common/components/heading-element-for-level');
jest.mock('../../../../../common/components/cards/result-section-title');

jest.mock('../../../../../DetailsView/tab-stops-requirements-with-instances');
describe('TabStopsFailedInstanceSection', () => {
    mockReactComponents([
        TabStopsRequirementsWithInstances,
        HeadingElementForLevel,
        ResultSectionTitle,
    ]);
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
        };
    });

    it('renders with failing results', () => {
        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailed(It.isAny()))
            .returns(() => 10)
            .verifiable(Times.once());

        const renderResult = render(<TabStopsFailedInstanceSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TabStopsRequirementsWithInstances]);
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

        const renderResult = render(<TabStopsFailedInstanceSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TabStopsRequirementsWithInstances]);
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

        const renderResult = render(<TabStopsFailedInstanceSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([TabStopsRequirementsWithInstances]);
        tabStopsFailedCounterMock.verifyAll();
        tabStopsInstanceSectionPropsFactoryMock.verifyAll();
    });
});
