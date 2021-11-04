// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
    TabStopsFailedInstanceSectionProps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('TabStopsFailedInstanceSection', () => {
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;

    const visualizationScanResultDataStub = {
        tabStops: { requirements: {} },
    } as VisualizationScanResultData;

    let props = {} as TabStopsFailedInstanceSectionProps;
    let depsStub = {} as TabStopsFailedInstanceSectionDeps;

    beforeAll(() => {
        tabStopsFailedCounterMock = Mock.ofType(TabStopsFailedCounter);

        depsStub = {
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
        } as TabStopsFailedInstanceSectionDeps;

        props = {
            deps: depsStub,
            visualizationScanResultData: visualizationScanResultDataStub,
        };
    });

    beforeEach(() => {
        props.visualizationScanResultData.tabStops.requirements = {
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
        };
    });

    it('renders with failing results', () => {
        const wrapper = shallow(
            <TabStopsFailedInstanceSection
                deps={depsStub}
                visualizationScanResultData={visualizationScanResultDataStub}
            />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('does not render when no results are failing', () => {
        const requirementsStub = props.visualizationScanResultData.tabStops.requirements;
        for (const requirementId of Object.keys(requirementsStub)) {
            requirementsStub[requirementId].status = 'pass';
            requirementsStub[requirementId].instances = [];
        }

        const wrapper = shallow(
            <TabStopsFailedInstanceSection
                deps={depsStub}
                visualizationScanResultData={visualizationScanResultDataStub}
            />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
